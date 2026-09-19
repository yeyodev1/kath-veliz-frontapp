import { reactive } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'
import { adminCopy } from '@/config/admin'

interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  danger?: boolean
}

/**
 * Confirmación antes de borrar, revocar o avisar. La vista pinta un BaseModal
 * con `modal` y este composable corre la acción solo si Kath confirma.
 */
export function useConfirm() {
  const toast = useToastStore()
  const modal = reactive({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmar',
    danger: false,
  })
  let pending: (() => Promise<unknown>) | null = null
  let running = false

  function ask(options: ConfirmOptions, action: () => Promise<unknown>) {
    modal.title = options.title
    modal.message = options.message || ''
    modal.confirmLabel = options.confirmLabel || 'Confirmar'
    modal.danger = options.danger ?? false
    pending = action
    modal.open = true
  }

  async function accept() {
    // Doble toque en el celular: la acción corre una sola vez.
    if (running || !pending) return
    running = true
    try {
      await pending()
    } catch (err) {
      toast.error((err as ApiError).message || adminCopy.genericError)
    } finally {
      running = false
      pending = null
      modal.open = false
    }
  }

  function cancel() {
    pending = null
    modal.open = false
  }

  return { modal, ask, accept, cancel }
}
