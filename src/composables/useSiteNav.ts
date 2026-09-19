import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

export interface NavLink {
  label: string
  to: string
  icon?: string
}

/** Enlaces del header y del drawer: los públicos más los que dependen de la sesión. */
export function useSiteNav() {
  const router = useRouter()
  const userStore = useUserStore()
  const toast = useToastStore()

  const links = computed<NavLink[]>(() => [...site.nav])

  const userLinks = computed<NavLink[]>(() => {
    if (!userStore.isAuthenticated) return []
    const items: NavLink[] = [{ ...site.navUser.courses, icon: 'fa-solid fa-graduation-cap' }]
    if (userStore.isAdmin) items.push({ ...site.navUser.admin, icon: 'fa-solid fa-sliders' })
    items.push({ ...site.navUser.account, icon: 'fa-regular fa-user' })
    return items
  })

  function logout() {
    userStore.clear()
    toast.info(site.account.loggedOut)
    router.replace('/')
  }

  return { links, userLinks, logout, userStore }
}
