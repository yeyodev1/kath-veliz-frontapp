import { reactive, ref } from 'vue'
import { adminSalesService } from '@/services/adminSales.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/admin'
import { dateInputToIso, isoToDateInput, refProduct } from '@/utils/adminFormat'
import type { ApiError } from '@/types'
import type { AdminCoupon } from '@/types/admin'

/** Lista y formulario de cupones. */
export function useCoupons() {
  const toast = useToastStore()
  const coupons = ref<AdminCoupon[]>([])
  const loading = ref(true)
  const error = ref('')
  const saving = ref(false)

  const form = reactive({
    open: false,
    id: '',
    code: '',
    percentOff: 10,
    product: '',
    expires: '',
    maxUses: '',
    isActive: true,
  })

  async function load() {
    loading.value = true
    error.value = ''
    try {
      coupons.value = await adminSalesService.coupons()
    } catch (err) {
      error.value = (err as ApiError).message || adminCopy.genericError
    } finally {
      loading.value = false
    }
  }

  function open(coupon?: AdminCoupon) {
    form.id = coupon?.id || ''
    form.code = coupon?.code || ''
    form.percentOff = coupon?.percentOff ?? 10
    form.product = coupon?.product ? refProduct(coupon.product).id : ''
    form.expires = isoToDateInput(coupon?.expiresAt)
    form.maxUses = coupon?.maxUses ? String(coupon.maxUses) : ''
    form.isActive = coupon?.isActive ?? true
    form.open = true
  }

  async function save() {
    const percent = Math.round(Number(form.percentOff))
    if (!form.code.trim() || !(percent >= 1 && percent <= 100)) {
      toast.error('Escribe un código y un descuento entre 1 y 100.')
      return
    }
    const maxUses = Math.floor(Number(form.maxUses))
    const payload = {
      code: form.code.trim().toUpperCase(),
      percentOff: percent,
      product: form.product || null,
      expiresAt: form.expires ? dateInputToIso(form.expires) : null,
      maxUses: maxUses > 0 ? maxUses : null,
      isActive: form.isActive,
    }

    saving.value = true
    try {
      if (form.id) await adminSalesService.updateCoupon(form.id, payload)
      else await adminSalesService.createCoupon(payload)
      toast.success(form.id ? 'Cupón actualizado.' : 'Cupón creado.')
      form.open = false
      await load()
    } catch (err) {
      toast.error((err as ApiError).message || adminCopy.genericError)
    } finally {
      saving.value = false
    }
  }

  async function toggleActive(coupon: AdminCoupon) {
    try {
      await adminSalesService.updateCoupon(coupon.id, { isActive: !coupon.isActive })
      coupon.isActive = !coupon.isActive
      toast.success(coupon.isActive ? 'Cupón activado.' : 'Cupón desactivado.')
    } catch (err) {
      toast.error((err as ApiError).message || adminCopy.genericError)
    }
  }

  async function remove(coupon: AdminCoupon) {
    await adminSalesService.deleteCoupon(coupon.id)
    toast.success('Cupón borrado.')
    await load()
  }

  return { coupons, loading, error, saving, form, load, open, save, toggleActive, remove }
}
