import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import type { ApiError } from '@/types'
import type { ConfirmOrderResponse } from '@/types/student'

export type ConfirmationState = 'confirming' | 'paid' | 'canceled' | 'failed' | 'missing' | 'login'

// Payphone reversa el cobro si no se confirma en 5 minutos: ante un fallo de red
// se reintenta solo, sin esperar a que la persona entienda qué pasó.
const NETWORK_RETRIES = 3
const RETRY_DELAY_MS = 2500

function first(value: unknown): string {
  const item = Array.isArray(value) ? value[0] : value
  return typeof item === 'string' ? item : ''
}

export function usePaymentConfirmation() {
  const route = useRoute()
  const state = ref<ConfirmationState>('confirming')
  const result = ref<ConfirmOrderResponse | null>(null)
  const errorMessage = ref('')
  let running = false

  const id = computed(() => first(route.query.id))
  const clientTransactionId = computed(
    () => first(route.query.clientTransactionId) || first(route.query.clientTxId),
  )
  // De vuelta a esta misma URL completa: el id de Payphone viaja en la query.
  const loginTarget = computed(() => ({ path: '/login', query: { next: route.fullPath } }))

  async function confirm() {
    if (running) return
    if (!id.value || !clientTransactionId.value) {
      state.value = 'missing'
      return
    }

    running = true
    state.value = 'confirming'
    errorMessage.value = ''

    for (let attempt = 1; attempt <= NETWORK_RETRIES; attempt++) {
      try {
        result.value = await orderService.confirm(id.value, clientTransactionId.value)
        state.value = result.value.status
        break
      } catch (e) {
        const error = e as ApiError
        if (error.status === 401) {
          state.value = 'login'
          break
        }
        // 408/500 de httpBase = no hubo respuesta del API; lo demás es una respuesta real.
        const isNetwork = error.status === 408 || (error.status === 500 && !error.data)
        if (isNetwork && attempt < NETWORK_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
          continue
        }
        errorMessage.value = error.message
        state.value = 'failed'
        break
      }
    }
    running = false
  }

  return { state, result, errorMessage, loginTarget, confirm }
}
