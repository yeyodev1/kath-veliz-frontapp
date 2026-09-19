import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { usePayphoneBox } from '@/composables/usePayphoneBox'
import { studentCopy } from '@/config/student'
import type { ApiError, SessionUser } from '@/types'
import type { BuyerUser, CouponResult, OrderSummary, StudentProduct } from '@/types/student'

const copy = studentCopy.checkout

/** Payphone pide el celular como +593984111222; la gente escribe 0984111222. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, '')
  if (/^09\d{8}$/.test(digits)) return `+593${digits.slice(1)}`
  if (/^5939\d{8}$/.test(digits)) return `+${digits}`
  return digits
}

/** De vuelta a como se escribe acá, para precargar el campo. */
function displayPhone(stored: string): string {
  return /^\+5939\d{8}$/.test(stored) ? `0${stored.slice(4)}` : stored
}

export function useCheckout() {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const toast = useToastStore()
  const box = usePayphoneBox()

  const slug = computed(() => String(route.params.slug || ''))
  // El enlace de pago de una asesoría aprobada llega con ?solicitud=<id>.
  const serviceRequestId = computed(() =>
    typeof route.query.solicitud === 'string' ? route.query.solicitud : undefined,
  )
  const user = computed(() => userStore.user as BuyerUser | null)

  const product = ref<StudentProduct | null>(null)
  const loading = ref(true)
  const loadError = ref<'' | 'notFound' | 'error'>('')

  const step = ref<'form' | 'paying'>('form')
  const creating = ref(false)
  const error = ref('')
  const alreadyOwned = ref(false)
  const order = ref<OrderSummary | null>(null)

  const buyer = reactive({ phone: '', documentId: '' })
  const buyerErrors = reactive({ phone: '', documentId: '' })

  const couponCode = ref('')
  const coupon = ref<CouponResult | null>(null)
  const couponError = ref('')
  const couponLoading = ref(false)

  const subtotalCents = computed(() => product.value?.priceCents ?? 0)
  const discountCents = computed(() => coupon.value?.discountCents ?? 0)
  // Lo que se muestra es informativo: el monto real lo calcula el backend al crear la orden.
  const totalCents = computed(
    () => order.value?.totalCents ?? coupon.value?.totalCents ?? subtotalCents.value,
  )
  const purchasable = computed(() => {
    const p = product.value
    if (!p || p.type === 'free') return false
    return (
      !p.saleMode || p.saleMode === 'open' || (p.type === 'service' && !!serviceRequestId.value)
    )
  })

  async function load() {
    loading.value = true
    loadError.value = ''
    try {
      product.value = await orderService.product(slug.value)
      buyer.phone = displayPhone(user.value?.phone || '')
      buyer.documentId = user.value?.documentId || ''
    } catch (e) {
      loadError.value = (e as ApiError).status === 404 ? 'notFound' : 'error'
    } finally {
      loading.value = false
    }
  }

  async function applyCoupon() {
    const code = couponCode.value.trim().toUpperCase()
    if (!code || couponLoading.value) return
    couponError.value = ''
    couponLoading.value = true
    try {
      coupon.value = await orderService.validateCoupon(code, slug.value)
      couponCode.value = coupon.value.code
    } catch (e) {
      coupon.value = null
      couponError.value = (e as ApiError).message
    } finally {
      couponLoading.value = false
    }
  }

  function removeCoupon() {
    coupon.value = null
    couponCode.value = ''
    couponError.value = ''
  }

  function validateBuyer(): boolean {
    const phone = normalizePhone(buyer.phone)
    const documentId = buyer.documentId.trim()
    buyerErrors.phone = /^\+?\d{9,15}$/.test(phone) ? '' : copy.buyer.phoneError
    buyerErrors.documentId = /^[A-Za-z0-9]{6,20}$/.test(documentId) ? '' : copy.buyer.documentError
    return !buyerErrors.phone && !buyerErrors.documentId
  }

  /** Crea una orden nueva y monta la Cajita. También es el "generar nuevo intento". */
  async function confirm() {
    if (creating.value || !product.value || !validateBuyer()) return
    const phone = normalizePhone(buyer.phone)
    const documentId = buyer.documentId.trim()

    error.value = ''
    creating.value = true
    try {
      if (user.value && (user.value.phone !== phone || user.value.documentId !== documentId)) {
        const saved = await orderService.saveBuyer({ name: user.value.name, phone, documentId })
        userStore.user = saved as SessionUser
      }

      const result = await orderService.create({
        productSlug: slug.value,
        couponCode: coupon.value?.code,
        phone,
        documentId,
        serviceRequestId: serviceRequestId.value,
      })
      order.value = result.order

      // Cupón del 100 %: el backend ya dio el acceso y no hay nada que cobrar.
      if (!result.payphone) {
        toast.success(copy.freeGranted)
        router.replace('/mis-cursos')
        return
      }

      step.value = 'paying'
      await box.mount(result.payphone)
    } catch (e) {
      const apiError = e as ApiError
      if (apiError.status === 409) alreadyOwned.value = true
      else error.value = apiError.message
    } finally {
      creating.value = false
    }
  }

  /** Volver al formulario abandona el intento: la orden queda `pending` y no se cobra. */
  function edit() {
    box.reset()
    order.value = null
    step.value = 'form'
  }

  return {
    slug,
    user,
    product,
    loading,
    loadError,
    purchasable,
    step,
    creating,
    error,
    alreadyOwned,
    buyer,
    buyerErrors,
    couponCode,
    coupon,
    couponError,
    couponLoading,
    subtotalCents,
    discountCents,
    totalCents,
    boxStatus: box.status,
    timeLeft: box.timeLeft,
    secondsLeft: box.secondsLeft,
    load,
    applyCoupon,
    removeCoupon,
    confirm,
    edit,
  }
}
