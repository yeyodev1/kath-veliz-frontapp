import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

/**
 * A dónde ir después de ingresar o registrarse. Respeta ?next= solo si es una
 * ruta interna: un next externo sería una redirección abierta.
 */
export function useNextRoute() {
  const route = useRoute()
  const userStore = useUserStore()

  const next = computed(() => {
    const raw = route.query.next
    return typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//') ? raw : ''
  })

  /** Se conserva el next al saltar entre ingresar y registrarse. */
  const nextQuery = computed(() => (next.value ? { next: next.value } : {}))

  const isCheckout = computed(() => next.value.startsWith('/checkout'))

  function destination(): string {
    if (next.value) return next.value
    return userStore.isAdmin ? '/admin' : '/mis-cursos'
  }

  return { next, nextQuery, isCheckout, destination }
}
