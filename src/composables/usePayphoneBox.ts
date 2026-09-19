import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import type { PayphoneConfig } from '@/types/student'
import '@/styles/payphone.scss'

const CDN = 'https://cdn.payphonetodoesposible.com/box/v2.0'
const CSS_URL = `${CDN}/payphone-payment-box.css`
const JS_URL = `${CDN}/payphone-payment-box.js`

export const PAYPHONE_CONTAINER_ID = 'pp-button'
// Payphone invalida el formulario a los 10 minutos de cargarlo.
const FORM_LIFETIME_SECONDS = 10 * 60
const SDK_TIMEOUT_MS = 20000

// Estado de módulo: el SDK se inserta UNA sola vez por carga de la página,
// aunque la alumna entre y salga del checkout varias veces.
let sdkPromise: Promise<void> | null = null

function loadSdk(): Promise<void> {
  if (window.PPaymentButtonBox) return Promise.resolve()
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CSS_URL
      document.head.appendChild(link)
    }

    const script = document.createElement('script')
    script.type = 'module'
    script.src = JS_URL
    script.onerror = () => fail('No se pudo descargar el formulario de Payphone')
    document.head.appendChild(script)

    // Un módulo puede disparar `load` antes de dejar la clase en window: en vez
    // de confiar en el evento se espera a que el global exista.
    const startedAt = Date.now()
    const poll = window.setInterval(() => {
      if (window.PPaymentButtonBox) {
        window.clearInterval(poll)
        resolve()
      } else if (Date.now() - startedAt > SDK_TIMEOUT_MS) {
        fail('El formulario de Payphone tardó demasiado en cargar')
      }
    }, 80)

    function fail(message: string) {
      window.clearInterval(poll)
      script.remove()
      sdkPromise = null // permite reintentar
      reject(new Error(message))
    }
  })

  return sdkPromise
}

/** 10 dígitos = cédula, 13 = RUC, cualquier otra cosa se trata como pasaporte. */
function identificationType(documentId: string): 1 | 2 | 3 {
  if (/^\d{10}$/.test(documentId)) return 1
  if (/^\d{13}$/.test(documentId)) return 2
  return 3
}

export type PayphoneBoxStatus = 'idle' | 'loading' | 'ready' | 'error' | 'expired'

export function usePayphoneBox() {
  const status = ref<PayphoneBoxStatus>('idle')
  const secondsLeft = ref(FORM_LIFETIME_SECONDS)
  let timer: number | null = null
  let mountId = 0

  const timeLeft = computed(() => {
    const m = Math.floor(secondsLeft.value / 60)
    const s = secondsLeft.value % 60
    return `${m}:${String(s).padStart(2, '0')}`
  })

  function stopTimer() {
    if (timer !== null) window.clearInterval(timer)
    timer = null
  }

  function clearContainer() {
    const el = document.getElementById(PAYPHONE_CONTAINER_ID)
    if (el) el.innerHTML = ''
  }

  function startTimer() {
    stopTimer()
    // Contra el reloj y no restando de a uno: en una pestaña en segundo plano
    // los intervalos se frenan y el contador mentiría.
    const deadline = Date.now() + FORM_LIFETIME_SECONDS * 1000
    secondsLeft.value = FORM_LIFETIME_SECONDS
    timer = window.setInterval(() => {
      secondsLeft.value = Math.max(0, Math.round((deadline - Date.now()) / 1000))
      if (secondsLeft.value === 0) {
        stopTimer()
        // Un formulario vencido no debe quedar usable: cobraría una orden muerta.
        clearContainer()
        status.value = 'expired'
      }
    }, 1000)
  }

  /** Monta la Cajita con la configuración que devolvió POST /orders. */
  async function mount(config: PayphoneConfig) {
    const current = ++mountId
    stopTimer()
    status.value = 'loading'

    try {
      await loadSdk()
      await nextTick()
      if (current !== mountId) return

      const Box = window.PPaymentButtonBox
      if (!Box || !document.getElementById(PAYPHONE_CONTAINER_ID)) {
        throw new Error('La Cajita de Pagos no está disponible')
      }

      clearContainer()
      new Box({
        token: config.token,
        clientTransactionId: config.clientTransactionId,
        amount: config.amount,
        amountWithoutTax: config.amountWithoutTax,
        amountWithTax: config.amountWithTax ?? 0,
        tax: config.tax ?? 0,
        service: config.service ?? 0,
        tip: config.tip ?? 0,
        currency: config.currency,
        storeId: config.storeId,
        reference: config.reference,
        lang: 'es',
        defaultMethod: 'card',
        timeZone: -5,
        email: config.email,
        phoneNumber: config.phoneNumber,
        documentId: config.documentId,
        identificationType: identificationType(config.documentId),
      }).render(PAYPHONE_CONTAINER_ID)

      status.value = 'ready'
      startTimer()
    } catch {
      if (current === mountId) status.value = 'error'
    }
  }

  function reset() {
    mountId++
    stopTimer()
    clearContainer()
    status.value = 'idle'
  }

  onBeforeUnmount(reset)

  return { status, secondsLeft, timeLeft, mount, reset }
}
