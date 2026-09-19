import { reactive, ref } from 'vue'
import { leadService } from '@/services/lead.service'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'
import { isEmail } from '@/utils/validate'
import type { LeadKind } from '@/types/catalog'
import type { ApiError } from '@/types'

interface LeadFormOptions {
  kind: LeadKind
  /** Slug de la landing o "footer". */
  source: string
  productSlug?: string
  /** El newsletter del footer solo pide correo. */
  askName?: boolean
}

/** Estado y envío de cualquier captura de contacto (gratis, espera, newsletter). */
export function useLeadForm(options: LeadFormOptions) {
  const userStore = useUserStore()
  const askName = options.askName !== false

  const form = reactive({
    name: userStore.user?.name ?? '',
    email: userStore.user?.email ?? '',
  })
  const errors = reactive({ name: '', email: '' })
  const sending = ref(false)
  const done = ref(false)
  const failure = ref('')

  function validate(): boolean {
    errors.name = askName && !form.name.trim() ? site.forms.required : ''
    errors.email = !form.email.trim()
      ? site.forms.required
      : isEmail(form.email)
        ? ''
        : site.forms.invalidEmail
    return !errors.name && !errors.email
  }

  async function submit() {
    failure.value = ''
    if (!validate() || sending.value) return
    sending.value = true
    try {
      await leadService.create({
        // El modelo exige nombre; el newsletter no lo pide, así que va la parte local del correo.
        name: askName ? form.name.trim() : form.email.trim().split('@')[0],
        email: form.email.trim().toLowerCase(),
        source: options.source,
        productSlug: options.productSlug,
        kind: options.kind,
      })
      done.value = true
    } catch (e) {
      failure.value = (e as ApiError).message
    } finally {
      sending.value = false
    }
  }

  return { form, errors, sending, done, failure, submit, askName }
}
