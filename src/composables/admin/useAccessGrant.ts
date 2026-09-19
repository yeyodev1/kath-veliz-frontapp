import { computed, reactive, ref } from 'vue'
import { adminAccessService } from '@/services/adminAccess.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/admin'
import type { ApiError } from '@/types'
import { useExpiryChoice } from './useExpiryChoice'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Formulario "Dar acceso manual". */
export function useAccessGrant(onDone: () => void) {
  const toast = useToastStore()
  const form = reactive({ email: '', name: '', productIds: [] as string[], note: '' })
  const expiry = useExpiryChoice()
  const saving = ref(false)

  // El botón se habilita solo con correo, al menos un producto y el vencimiento decidido.
  const canSubmit = computed(
    () =>
      EMAIL.test(form.email.trim()) &&
      form.productIds.length > 0 &&
      expiry.isValid.value &&
      !saving.value,
  )

  function toggleProduct(id: string) {
    const index = form.productIds.indexOf(id)
    if (index === -1) form.productIds.push(id)
    else form.productIds.splice(index, 1)
  }

  function reset() {
    form.email = ''
    form.name = ''
    form.productIds = []
    form.note = ''
    expiry.reset()
  }

  async function submit() {
    if (!canSubmit.value) return
    saving.value = true
    try {
      const name = form.name.trim()
      await adminAccessService.grant({
        email: form.email.trim().toLowerCase(),
        ...(name ? { name } : {}),
        productIds: [...form.productIds],
        // Siempre viaja: fecha ISO o null explícito.
        expiresAt: expiry.toPayload(),
        note: form.note.trim(),
      })
      toast.success('Acceso otorgado. Le llegó un correo con los detalles.')
      reset()
      onDone()
    } catch (err) {
      toast.error((err as ApiError).message || adminCopy.genericError)
    } finally {
      saving.value = false
    }
  }

  return { form, expiry, saving, canSubmit, toggleProduct, reset, submit }
}
