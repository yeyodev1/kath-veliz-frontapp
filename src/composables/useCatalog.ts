import { ref } from 'vue'
import { productService } from '@/services/product.service'
import type { ProductCard, ProductType } from '@/types/catalog'
import type { ApiError } from '@/types'

/**
 * Lista de productos publicados. Se pide el catálogo entero una vez y se
 * filtra acá: son pocos productos y así el Home y los catálogos no dependen
 * de cuántos `type` acepte el API en una sola llamada.
 */
export function useCatalog(types?: ProductType[]) {
  const products = ref<ProductCard[]>([])
  const loading = ref(false)
  const error = ref('')
  const loaded = ref(false)

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const all = await productService.list()
      products.value = types?.length ? all.filter((p) => types.includes(p.type)) : all
    } catch (e) {
      products.value = []
      error.value = (e as ApiError).message
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  return { products, loading, error, loaded, load }
}
