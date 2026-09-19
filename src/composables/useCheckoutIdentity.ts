import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { studentCopy } from '@/config/student'
import {
  displayPhone,
  isDocumentId,
  isEmail,
  isMobilePhone,
  normalizePhone,
} from '@/utils/validate'
import type { ApiError } from '@/types'
import type { BuyerData, BuyerUser, ServiceRequestPrefill } from '@/types/student'

const copy = studentCopy.checkout.identity

// register/login = sin sesión; profile = con sesión pero falta (o se edita) algún dato;
// summary = con sesión y todo listo, el bloque se muestra resumido.
export type IdentityMode = 'register' | 'login' | 'profile' | 'summary'
export type IdentityField = 'name' | 'email' | 'phone' | 'documentId' | 'password'

const FIELDS: Record<IdentityMode, IdentityField[]> = {
  register: ['name', 'email', 'phone', 'documentId', 'password'],
  login: ['email', 'password'],
  profile: ['name', 'phone', 'documentId'],
  summary: [],
}

export const identityFieldId = (field: IdentityField) => `checkout-${field}`

/**
 * El bloque "Tus datos" del checkout: crea la cuenta o inicia sesión ahí mismo
 * y deja guardados celular y cédula, sin sacar a la persona de la página.
 */
export function useCheckoutIdentity() {
  const userStore = useUserStore()
  const user = computed(() => userStore.user as BuyerUser | null)

  const guestMode = ref<'register' | 'login'>('register')
  const editing = ref(false)
  const busy = ref(false)
  const notice = ref('')
  const failure = ref('')
  const request = ref<ServiceRequestPrefill | null>(null)

  const form = reactive({ name: '', email: '', phone: '', documentId: '', password: '' })
  const errors = reactive<Record<IdentityField, string>>({
    name: '',
    email: '',
    phone: '',
    documentId: '',
    password: '',
  })

  const complete = computed(() => {
    const u = user.value
    return !!u && !!u.name && isMobilePhone(u.phone || '') && isDocumentId(u.documentId || '')
  })

  const mode = computed<IdentityMode>(() => {
    if (!user.value) return guestMode.value
    return editing.value || !complete.value ? 'profile' : 'summary'
  })

  const sameEmail = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

  // El backend solo deja pagar la asesoría a la cuenta del mismo correo de la solicitud.
  const mismatch = computed(
    () => !!user.value && !!request.value && !sameEmail(user.value.email, request.value.email),
  )

  function fillFrom(source: { name?: string; email?: string; phone?: string }, force: boolean) {
    if (source.name && (force || !form.name)) form.name = source.name
    if (source.email && (force || !form.email)) form.email = source.email
    if (source.phone && (force || !form.phone)) form.phone = displayPhone(source.phone)
  }

  // Solo se pisa con valores que existen: recién registrada la cuenta aún no tiene
  // cédula y no debe borrarse la que la persona acaba de escribir.
  watch(
    user,
    (u) => {
      if (!u) return
      fillFrom(u, true)
      if (u.documentId) form.documentId = u.documentId
      form.password = ''
    },
    { immediate: true },
  )

  function setRequest(prefill: ServiceRequestPrefill | null) {
    request.value = prefill
    if (prefill && !user.value) fillFrom(prefill, false)
  }

  function check(field: IdentityField): string {
    const value = form[field]
    switch (field) {
      case 'name':
        return value.trim().length >= 3 ? '' : copy.errors.name
      case 'email':
        if (!isEmail(value)) return copy.errors.email
        if (request.value && !sameEmail(value, request.value.email)) {
          return copy.requestHint(request.value.email)
        }
        return ''
      case 'phone':
        return isMobilePhone(value) ? '' : copy.errors.phone
      case 'documentId':
        return isDocumentId(value) ? '' : copy.errors.documentId
      default:
        if (mode.value === 'login') return value ? '' : copy.errors.password
        return value.length >= 8 ? '' : copy.errors.newPassword
    }
  }

  /** Al salir del campo. Un campo vacío no se regaña todavía: eso espera al botón. */
  function touch(field: IdentityField) {
    errors[field] = form[field].trim() ? check(field) : ''
  }

  function clearErrors() {
    for (const field of Object.keys(errors) as IdentityField[]) errors[field] = ''
    failure.value = ''
  }

  function focus(field: IdentityField) {
    nextTick(() => document.getElementById(identityFieldId(field))?.focus())
  }

  function validate(): boolean {
    let firstInvalid: IdentityField | null = null
    for (const field of FIELDS[mode.value]) {
      errors[field] = check(field)
      if (errors[field] && !firstInvalid) firstInvalid = field
    }
    if (firstInvalid) focus(firstInvalid)
    return !firstInvalid
  }

  function switchTo(next: 'register' | 'login') {
    guestMode.value = next
    notice.value = ''
    form.password = ''
    clearErrors()
  }

  function startEdit() {
    editing.value = true
    clearErrors()
  }

  /** Cierra la sesión para entrar con el correo de la solicitud, sin salir del checkout. */
  function switchAccount() {
    userStore.clear()
    editing.value = false
    form.name = ''
    form.phone = ''
    form.documentId = ''
    form.email = ''
    if (request.value) fillFrom(request.value, true)
    switchTo('register')
  }

  async function saveProfile(): Promise<BuyerData> {
    const data = {
      name: form.name.trim(),
      phone: normalizePhone(form.phone),
      documentId: form.documentId.trim(),
    }
    const u = user.value
    if (!u || u.name !== data.name || u.phone !== data.phone || u.documentId !== data.documentId) {
      await userStore.updateProfile(data)
    }
    editing.value = false
    return { phone: data.phone, documentId: data.documentId }
  }

  /**
   * Deja una sesión iniciada con celular y cédula guardados. Devuelve esos datos,
   * o null si todavía falta algo (el bloque ya muestra qué).
   */
  async function submit(): Promise<BuyerData | null> {
    if (busy.value || mismatch.value) return null
    failure.value = ''
    if (!validate()) return null

    busy.value = true
    try {
      if (mode.value === 'register') {
        try {
          await userStore.register({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            phone: normalizePhone(form.phone),
          })
        } catch (e) {
          if ((e as ApiError).status !== 409) throw e
          // El correo ya tiene cuenta: mismo lugar, mismo correo, solo falta la contraseña.
          switchTo('login')
          notice.value = copy.exists
          focus('password')
          return null
        }
        return await saveProfile()
      }

      if (mode.value === 'login') {
        await userStore.login(form.email.trim().toLowerCase(), form.password)
        notice.value = ''
        // Una cuenta vieja puede no tener cédula: el bloque pasa solo a pedirla.
        if (!complete.value || mismatch.value) return null
      }

      if (mode.value === 'profile') return await saveProfile()

      const u = user.value as BuyerUser
      return { phone: normalizePhone(u.phone), documentId: (u.documentId || '').trim() }
    } catch (e) {
      // Un solo aviso a la vez: el error reemplaza al "ya tienes cuenta".
      notice.value = ''
      failure.value = (e as ApiError).message
      return null
    } finally {
      busy.value = false
    }
  }

  return {
    user,
    mode,
    form,
    errors,
    busy,
    notice,
    failure,
    request,
    mismatch,
    setRequest,
    touch,
    switchTo,
    startEdit,
    switchAccount,
    submit,
  }
}
