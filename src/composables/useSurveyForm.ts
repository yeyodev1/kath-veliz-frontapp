import { reactive, ref, watch, type Ref } from 'vue'
import { leadService } from '@/services/lead.service'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'
import { isEmail } from '@/utils/validate'
import type { ProductDetail } from '@/types/catalog'
import type { ApiError } from '@/types'

/**
 * Encuesta de la asesoría. Las preguntas llegan del producto
 * (`surveyQuestions`), así que las respuestas se guardan por índice.
 */
export function useSurveyForm(product: Ref<ProductDetail>) {
  const userStore = useUserStore()

  const contact = reactive({
    name: userStore.user?.name ?? '',
    email: userStore.user?.email ?? '',
    phone: userStore.user?.phone ?? '',
  })
  const answers = ref<string[]>([])
  const errors = reactive<{ name: string; email: string; phone: string; answers: string[] }>({
    name: '',
    email: '',
    phone: '',
    answers: [],
  })
  const sending = ref(false)
  const done = ref(false)
  const failure = ref('')

  watch(
    () => product.value.surveyQuestions,
    (questions) => {
      answers.value = questions.map(() => '')
      errors.answers = questions.map(() => '')
    },
    { immediate: true },
  )

  function validate(): boolean {
    errors.name = contact.name.trim() ? '' : site.forms.required
    errors.email = !contact.email.trim()
      ? site.forms.required
      : isEmail(contact.email)
        ? ''
        : site.forms.invalidEmail
    errors.phone = contact.phone.trim() ? '' : site.forms.required
    errors.answers = product.value.surveyQuestions.map((q, i) =>
      q.required && !answers.value[i]?.trim() ? site.forms.required : '',
    )
    return !errors.name && !errors.email && !errors.phone && errors.answers.every((e) => !e)
  }

  async function submit(): Promise<boolean> {
    failure.value = ''
    if (sending.value) return false
    if (!validate()) return false
    sending.value = true
    try {
      await leadService.requestService({
        productSlug: product.value.slug,
        name: contact.name.trim(),
        email: contact.email.trim().toLowerCase(),
        phone: contact.phone.trim(),
        answers: product.value.surveyQuestions
          .map((q, i) => ({ question: q.label, answer: (answers.value[i] ?? '').trim() }))
          .filter((a) => a.answer),
      })
      done.value = true
      return true
    } catch (e) {
      failure.value = (e as ApiError).message
      return false
    } finally {
      sending.value = false
    }
  }

  return { contact, answers, errors, sending, done, failure, submit }
}
