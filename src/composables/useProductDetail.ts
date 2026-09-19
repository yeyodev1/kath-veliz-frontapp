import { ref, watch, type Ref } from 'vue'
import { productService } from '@/services/product.service'
import { site } from '@/config/site'
import type { ProductDetail } from '@/types/catalog'
import type { ApiError } from '@/types'

/** Carga la landing de un producto y la recarga si cambia el slug de la ruta. */
export function useProductDetail(slug: Ref<string>) {
  const product = ref<ProductDetail | null>(null)
  const loading = ref(true)
  const error = ref('')
  const notFound = ref(false)

  async function load() {
    if (!slug.value) return
    const wanted = slug.value
    loading.value = true
    error.value = ''
    notFound.value = false
    try {
      const data = await productService.bySlug(wanted)
      // Si la ruta cambió mientras llegaba la respuesta, esta ya no sirve.
      if (wanted !== slug.value) return
      product.value = normalize(data)
      document.title = `${data.title} — ${site.name}`
    } catch (e) {
      if (wanted !== slug.value) return
      product.value = null
      const apiError = e as ApiError
      notFound.value = apiError.status === 404
      error.value = apiError.message
    } finally {
      if (wanted === slug.value) loading.value = false
    }
  }

  watch(slug, load, { immediate: true })

  return { product, loading, error, notFound, reload: load }
}

/** El API puede omitir arreglos vacíos; la plantilla no debería enterarse. */
function normalize(data: ProductDetail): ProductDetail {
  return {
    ...data,
    highlights: data.highlights ?? [],
    audience: data.audience ?? [],
    faqs: data.faqs ?? [],
    surveyQuestions: data.surveyQuestions ?? [],
    modules: (data.modules ?? []).map((m) => ({ ...m, lessons: m.lessons ?? [] })),
    nextLiveSessions: data.nextLiveSessions ?? [],
  }
}
