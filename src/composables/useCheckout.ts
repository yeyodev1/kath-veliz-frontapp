import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { usePayphoneBox } from '@/composables/usePayphoneBox'
import { useCheckoutIdentity } from '@/composables/useCheckoutIdentity'
import { studentCopy } from '@/config/student'
import type { ApiError } from '@/types'
import type { CouponResult, OrderSummary, StudentProduct } from '@/types/student'

const copy = studentCopy.checkout

export const CHECKOUT_MAIN_ID = 'checkout-main'

export function useCheckout() {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const toast = useToastStore()
  const box = usePayphoneBox()
  const identity = useCheckoutIdentity()

  const slug = computed(() => String(route.params.slug || ''))
  // El enlace de pago de una asesoría aprobada llega con ?solicitud=<id>.
  const serviceRequestId = computed(() =>
    typeof route.query.solicitud === 'string' ? route.query.solicitud : undefined,
  )
  const product = ref<StudentProduct | null>(null)
  const loading = ref(true)
  const loadError = ref<'' | 'notFound' | 'error'>('')
  // El enlace de pago apunta a una solicitud que ya no está aprobada (pagada, rechazada o inexistente).
  const requestInvalid = ref(false)

  const step = ref<'form' | 'paying'>('form')
  const creating = ref(false)
  const error = ref('')
  const alreadyOwned = ref(false)
  const order = ref<OrderSummary | null>(null)

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

  /** Precarga nombre, correo y celular de la solicitud aprobada. Si el API falla, se sigue sin precarga. */
  async function loadRequest() {
    if (!serviceRequestId.value) return
    try {
      const prefill = await orderService.requestPrefill(serviceRequestId.value)
      if (prefill.productSlug === slug.value) identity.setRequest(prefill)
      else requestInvalid.value = true
    } catch (e) {
      if ((e as ApiError).status === 404) requestInvalid.value = true
    }
  }

  async function load() {
    loading.value = true
    loadError.value = ''
    requestInvalid.value = false
    try {
      // La ruta ya no exige sesión, así que el guard no la restaura: se hace acá
      // para que quien ya tiene cuenta vea sus datos precargados.
      const [loaded] = await Promise.all([
        orderService.product(slug.value),
        userStore.restore(),
        loadRequest(),
      ])
      product.value = loaded
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

  /** Crea una orden nueva y monta la Cajita. También es el "generar nuevo intento". */
  async function confirm() {
    if (creating.value || !product.value) return

    error.value = ''
    creating.value = true
    try {
      // Primero la cuenta (registro o ingreso en la misma página) y los datos del comprador.
      const buyer = await identity.submit()
      if (!buyer) return

      const result = await orderService.create({
        productSlug: slug.value,
        couponCode: coupon.value?.code,
        phone: buyer.phone,
        documentId: buyer.documentId,
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
      scrollToMain()
      await box.mount(result.payphone)
    } catch (e) {
      const apiError = e as ApiError
      if (apiError.status === 409) alreadyOwned.value = true
      else error.value = apiError.message
    } finally {
      creating.value = false
    }
  }

  function scrollToMain() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    nextTick(() =>
      document
        .getElementById(CHECKOUT_MAIN_ID)
        ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }),
    )
  }

  /** Volver al formulario abandona el intento: la orden queda `pending` y no se cobra. */
  function edit() {
    box.reset()
    order.value = null
    step.value = 'form'
    identity.startEdit()
  }

  // Si la sesión caduca con la Cajita abierta, ese intento ya no se puede confirmar.
  watch(identity.user, (u) => {
    if (!u && step.value === 'paying') {
      box.reset()
      order.value = null
      step.value = 'form'
    }
  })

  return {
    slug,
    identity,
    product,
    loading,
    loadError,
    requestInvalid,
    purchasable,
    step,
    creating,
    error,
    alreadyOwned,
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
