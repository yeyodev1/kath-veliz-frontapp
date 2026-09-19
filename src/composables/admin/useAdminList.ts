import { onBeforeUnmount, reactive, ref, watch, type Ref } from 'vue'
import type { ApiError, Paginated } from '@/types'
import type { Query } from '@/services/adminBase.service'
import { adminCopy } from '@/config/admin'

/**
 * Lista paginada con filtros: todas las pantallas del panel comparten los
 * mismos estados (cargando, error, vacío) y la misma paginación.
 */
export function useAdminList<T, F extends Query>(
  fetcher: (query: F & { page: number }) => Promise<Paginated<T>>,
  initialFilters: F,
) {
  const items = ref([]) as Ref<T[]>
  const filters = reactive({ ...initialFilters }) as F
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const error = ref('')

  // Si el usuario escribe rápido, solo cuenta la última respuesta.
  let requestId = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  async function load() {
    const current = ++requestId
    loading.value = true
    error.value = ''
    try {
      const result = await fetcher({ ...(filters as F), page: page.value })
      if (current !== requestId) return
      items.value = result.items
      pages.value = result.pages
      total.value = result.total
    } catch (err) {
      if (current !== requestId) return
      error.value = (err as ApiError).message || adminCopy.genericError
    } finally {
      if (current === requestId) loading.value = false
    }
  }

  function goTo(next: number) {
    if (next < 1 || next > pages.value || next === page.value) return
    page.value = next
    load()
  }

  // Cambiar un filtro vuelve a la página 1; la espera evita una petición por tecla.
  watch(
    () => ({ ...filters }),
    () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        page.value = 1
        load()
      }, 350)
    },
  )

  onBeforeUnmount(() => clearTimeout(timer))

  return { items, filters, page, pages, total, loading, error, load, goTo }
}
