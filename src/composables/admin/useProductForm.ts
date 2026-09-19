import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminProductsService } from '@/services/adminProducts.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/admin'
import { centsToInput, inputToCents, slugify } from '@/utils/adminFormat'
import type { ApiError } from '@/types'
import type {
  AdminProduct,
  AdminProductPayload,
  ProductFaq,
  ProductType,
  SaleMode,
  SurveyQuestion,
  UploadedFile,
  UploadedImage,
} from '@/types/admin'

/** Lo que Kath ve en pantalla: precios en dólares y la duración como una decisión explícita. */
export interface ProductFormState {
  type: ProductType
  slug: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  audience: string[]
  faqs: ProductFaq[]
  cover: UploadedImage | null
  price: string
  compareAtPrice: string
  saleMode: SaleMode
  lifetime: boolean
  accessDays: number | null
  isPublished: boolean
  order: number
  downloadFile: UploadedFile | null
  freeResourceUrl: string
  infoPdf: UploadedFile | null
  surveyQuestions: SurveyQuestion[]
}

function emptyForm(): ProductFormState {
  return {
    type: 'course',
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    highlights: [],
    audience: [],
    faqs: [],
    cover: null,
    price: '',
    compareAtPrice: '',
    saleMode: 'open',
    lifetime: true,
    accessDays: null,
    isPublished: false,
    order: 0,
    downloadFile: null,
    freeResourceUrl: '',
    infoPdf: null,
    surveyQuestions: [],
  }
}

export function useProductForm() {
  const router = useRouter()
  const toast = useToastStore()
  const form = reactive<ProductFormState>(emptyForm())
  const productId = ref('')
  const loading = ref(false)
  const error = ref('')
  const saving = ref(false)
  // Al crear, el slug sigue al título hasta que Kath lo edite a mano.
  const slugTouched = ref(false)

  const isNew = computed(() => !productId.value)

  function fill(product: AdminProduct) {
    Object.assign(form, emptyForm(), {
      type: product.type,
      slug: product.slug,
      title: product.title,
      subtitle: product.subtitle || '',
      description: product.description || '',
      highlights: [...(product.highlights || [])],
      audience: [...(product.audience || [])],
      faqs: (product.faqs || []).map((faq) => ({ ...faq })),
      cover: product.cover || null,
      price: centsToInput(product.priceCents),
      compareAtPrice: centsToInput(product.compareAtPriceCents),
      saleMode: product.saleMode || 'open',
      lifetime: product.accessDurationDays === null || product.accessDurationDays === undefined,
      accessDays: product.accessDurationDays ?? null,
      isPublished: Boolean(product.isPublished),
      order: product.order || 0,
      downloadFile: product.downloadFile || null,
      freeResourceUrl: product.freeResourceUrl || '',
      infoPdf: product.infoPdf || null,
      surveyQuestions: (product.surveyQuestions || []).map((q) => ({
        ...q,
        options: [...(q.options || [])],
      })),
    })
    slugTouched.value = true
  }

  async function load(id: string) {
    productId.value = id
    loading.value = true
    error.value = ''
    try {
      const product = await adminProductsService.getById(id)
      if (!product) error.value = 'No encontramos este producto. Puede que lo hayan borrado.'
      else fill(product)
    } catch (err) {
      error.value = (err as ApiError).message || adminCopy.genericError
    } finally {
      loading.value = false
    }
  }

  function onTitleInput() {
    if (isNew.value && !slugTouched.value) form.slug = slugify(form.title)
  }

  /** Devuelve el mensaje del primer problema, o '' si todo está bien. */
  function validate(): string {
    if (!form.title.trim()) return 'Escribe el título del producto.'
    if (!form.slug.trim()) return 'Falta el enlace (slug) del producto.'
    if (form.type !== 'free' && inputToCents(form.price) === null)
      return 'Escribe un precio válido en dólares.'
    if (!form.lifetime && !(Number(form.accessDays) >= 1))
      return 'Escribe cuántos días dura el acceso.'
    if (form.type === 'free' && !form.freeResourceUrl.trim())
      return 'Pega el enlace del recurso gratuito.'
    const badSelect = form.surveyQuestions.some(
      (q) => q.type === 'select' && q.options.filter((option) => option.trim()).length < 2,
    )
    if (form.type === 'service' && badSelect)
      return 'Las preguntas de lista necesitan al menos dos opciones.'
    return ''
  }

  function toPayload(): AdminProductPayload {
    const clean = (list: string[]) => list.map((item) => item.trim()).filter(Boolean)
    const isFree = form.type === 'free'
    return {
      type: form.type,
      slug: slugify(form.slug),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      highlights: clean(form.highlights),
      audience: clean(form.audience),
      faqs: form.faqs
        .map((faq) => ({ question: faq.question.trim(), answer: faq.answer.trim() }))
        .filter((faq) => faq.question),
      cover: form.cover,
      // El input está en dólares; al API siempre van centavos enteros.
      priceCents: isFree ? 0 : inputToCents(form.price) || 0,
      compareAtPriceCents: isFree ? null : inputToCents(form.compareAtPrice) || null,
      saleMode: form.saleMode,
      accessDurationDays: form.lifetime ? null : Math.floor(Number(form.accessDays)),
      isPublished: form.isPublished,
      order: Number(form.order) || 0,
      downloadFile: form.type === 'download' ? form.downloadFile : null,
      freeResourceUrl: isFree ? form.freeResourceUrl.trim() : '',
      infoPdf: form.type === 'service' ? form.infoPdf : null,
      surveyQuestions:
        form.type === 'service'
          ? form.surveyQuestions
              .filter((q) => q.label.trim())
              .map((q) => ({
                label: q.label.trim(),
                type: q.type,
                options: q.type === 'select' ? clean(q.options) : [],
                required: q.required,
              }))
          : [],
    }
  }

  async function save() {
    const problem = validate()
    if (problem) {
      toast.error(problem)
      return
    }
    saving.value = true
    try {
      if (isNew.value) {
        const created = await adminProductsService.createProduct(toPayload())
        toast.success('Producto creado.')
        // Ya con id se puede subir contenido: se pasa a la pantalla de edición.
        await router.replace({ name: 'AdminProductEdit', params: { id: created.id } })
      } else {
        fill(await adminProductsService.updateProduct(productId.value, toPayload()))
        toast.success('Cambios guardados.')
      }
    } catch (err) {
      toast.error((err as ApiError).message || adminCopy.genericError)
    } finally {
      saving.value = false
    }
  }

  function reset() {
    productId.value = ''
    slugTouched.value = false
    error.value = ''
    Object.assign(form, emptyForm())
  }

  return {
    form,
    productId,
    isNew,
    loading,
    error,
    saving,
    slugTouched,
    load,
    save,
    reset,
    onTitleInput,
  }
}
