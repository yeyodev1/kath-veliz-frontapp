import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { site } from '@/config/site'
import type { ApiError } from '@/types'

/** Los dos formularios de /cuenta: datos personales y cambio de contraseña. */
export function useAccount() {
  const userStore = useUserStore()
  const toast = useToastStore()

  const profile = reactive({
    name: userStore.user?.name ?? '',
    phone: userStore.user?.phone ?? '',
    documentId: userStore.user?.documentId ?? '',
  })
  const profileErrors = reactive({ name: '', documentId: '' })
  const savingProfile = ref(false)
  const profileFailure = ref('')

  async function saveProfile() {
    profileFailure.value = ''
    profileErrors.name = profile.name.trim() ? '' : site.forms.required
    // La cédula es opcional acá (se exige en el checkout), pero si viene, que sean 10 o 13 dígitos.
    const doc = profile.documentId.trim()
    profileErrors.documentId = !doc || /^\d{10}(\d{3})?$/.test(doc) ? '' : site.account.documentIdInvalid
    if (profileErrors.name || profileErrors.documentId) return

    savingProfile.value = true
    try {
      await userStore.updateProfile({
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        documentId: doc,
      })
      toast.success(site.account.saved)
    } catch (e) {
      profileFailure.value = (e as ApiError).message
    } finally {
      savingProfile.value = false
    }
  }

  const password = reactive({ current: '', next: '' })
  const passwordErrors = reactive({ current: '', next: '' })
  const savingPassword = ref(false)
  const passwordFailure = ref('')

  async function savePassword() {
    passwordFailure.value = ''
    passwordErrors.current = password.current ? '' : site.forms.required
    passwordErrors.next = password.next.length >= 8 ? '' : site.forms.shortPassword
    if (passwordErrors.current || passwordErrors.next) return

    savingPassword.value = true
    try {
      await userStore.changePassword(password.current, password.next)
      password.current = ''
      password.next = ''
      toast.success(site.account.passwordChanged)
    } catch (e) {
      passwordFailure.value = (e as ApiError).message
    } finally {
      savingPassword.value = false
    }
  }

  return {
    profile,
    profileErrors,
    savingProfile,
    profileFailure,
    saveProfile,
    password,
    passwordErrors,
    savingPassword,
    passwordFailure,
    savePassword,
  }
}
