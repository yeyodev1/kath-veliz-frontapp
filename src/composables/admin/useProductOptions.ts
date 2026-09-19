import { ref } from 'vue'
import { adminProductsService } from '@/services/adminProducts.service'
import type { AdminProduct } from '@/types/admin'

// Estado de módulo: varias pantallas necesitan la lista de productos para sus
// selectores y no tiene sentido pedirla de nuevo en cada una.
const products = ref<AdminProduct[]>([])
const loading = ref(false)
let loaded = false

export function useProductOptions() {
  async function load(force = false) {
    if ((loaded && !force) || loading.value) return
    loading.value = true
    try {
      products.value = await adminProductsService.list()
      loaded = true
    } catch {
      // El selector queda vacío; la pantalla principal ya muestra su propio error.
      products.value = []
    } finally {
      loading.value = false
    }
  }

  function titleOf(id: string): string {
    return products.value.find((product) => product.id === id)?.title || ''
  }

  return { products, loading, load, titleOf }
}
