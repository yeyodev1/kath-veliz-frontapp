// Globales que llegan por <script>: la Cajita de Pagos de Payphone y player.js
// (el puente de Bunny Stream para controlar el iframe del video).
export {}

declare global {
  interface PPaymentButtonBoxOptions {
    token: string
    clientTransactionId: string
    amount: number
    amountWithoutTax: number
    amountWithTax?: number
    tax?: number
    service?: number
    tip?: number
    currency: string
    storeId: string
    reference: string
    lang?: 'es' | 'en'
    defaultMethod?: 'card' | 'payphone'
    timeZone?: number
    email?: string
    phoneNumber?: string
    documentId?: string
    /** 1 = cédula, 2 = RUC, 3 = pasaporte */
    identificationType?: 1 | 2 | 3
    optionalParameter?: string
  }

  class PPaymentButtonBox {
    constructor(options: PPaymentButtonBoxOptions)
    render(containerId: string): void
  }

  interface PlayerJsTimeUpdate {
    seconds: number
    duration: number
  }

  interface PlayerJsPlayer {
    on(event: 'ready' | 'play' | 'pause' | 'ended', callback: () => void): void
    on(event: 'timeupdate', callback: (data: PlayerJsTimeUpdate) => void): void
    off(event: string): void
    setCurrentTime(seconds: number): void
    getCurrentTime(callback: (seconds: number) => void): void
    play(): void
    pause(): void
  }

  interface Window {
    PPaymentButtonBox?: typeof PPaymentButtonBox
    playerjs?: { Player: new (iframe: HTMLIFrameElement | string) => PlayerJsPlayer }
  }
}
