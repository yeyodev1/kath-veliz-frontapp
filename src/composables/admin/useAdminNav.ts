import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminNav, type AdminNavItem } from '@/config/admin'
import { useUserStore } from '@/stores/user'

/** Navegación del panel: qué sección está activa y cómo salir. */
export function useAdminNav() {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()

  // "/admin" solo es activo en el resumen; el resto también con sus subrutas.
  function isActive(item: AdminNavItem): boolean {
    if (item.to === '/admin') return route.path === '/admin' || route.path === '/admin/'
    return route.path === item.to || route.path.startsWith(`${item.to}/`)
  }

  const current = computed(() => adminNav.find(isActive) || adminNav[0])
  const primary = adminNav.filter((item) => item.primary)
  // Si la sección activa vive dentro de "Más", ese botón se marca como activo.
  const moreActive = computed(() => !current.value?.primary)

  function logout() {
    userStore.clear()
    router.replace({ name: 'Login' })
  }

  return { items: adminNav, primary, current, moreActive, isActive, logout, userStore }
}
