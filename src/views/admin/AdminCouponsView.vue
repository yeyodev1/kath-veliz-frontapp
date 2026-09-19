<script setup lang="ts">
import { onMounted } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminRecord from '@/components/admin/AdminRecord.vue'
import AdminDatum from '@/components/admin/AdminDatum.vue'
import AdminBadge from '@/components/admin/AdminBadge.vue'
import CouponForm from '@/components/admin/CouponForm.vue'
import { useCoupons } from '@/composables/admin/useCoupons'
import { useConfirm } from '@/composables/admin/useConfirm'
import { useProductOptions } from '@/composables/admin/useProductOptions'
import { adminCopy } from '@/config/admin'
import { formatDateEc, refProduct } from '@/utils/adminFormat'
import type { AdminCoupon } from '@/types/admin'

const copy = adminCopy.coupons
const { coupons, loading, error, saving, form, load, open, save, toggleActive, remove } = useCoupons()
const { products, load: loadProducts, titleOf } = useProductOptions()
const confirm = useConfirm()

function productLabel(coupon: AdminCoupon): string {
  if (!coupon.product) return 'Todos los productos'
  const ref = refProduct(coupon.product)
  return ref.title || titleOf(ref.id) || 'Un producto'
}

function askDelete(coupon: AdminCoupon) {
  confirm.ask(
    { title: copy.deleteTitle, message: `${coupon.code}. ${copy.deleteMessage}`, confirmLabel: 'Sí, borrar', danger: true },
    () => remove(coupon),
  )
}

onMounted(() => {
  loadProducts()
  load()
})
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle">
      <button class="btn btn--primary" @click="open()">
        <i class="fa-solid fa-plus"></i>
        {{ copy.create }}
      </button>
    </AdminPageHeader>

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!coupons.length"
      :empty-text="copy.empty"
      empty-icon="fa-solid fa-ticket"
      @retry="load"
    >
      <div class="adm-list">
        <AdminRecord v-for="coupon in coupons" :key="coupon.id" :muted="!coupon.isActive">
          <template #title>
            {{ coupon.code }}
            <small>{{ coupon.percentOff }}% de descuento</small>
          </template>
          <template #badge>
            <AdminBadge :tone="coupon.isActive ? 'success' : 'neutral'">
              {{ coupon.isActive ? 'Activo' : 'Inactivo' }}
            </AdminBadge>
          </template>

          <AdminDatum label="Aplica a">{{ productLabel(coupon) }}</AdminDatum>
          <AdminDatum label="Vence">{{ coupon.expiresAt ? formatDateEc(coupon.expiresAt) : 'No vence' }}</AdminDatum>
          <AdminDatum label="Usos">
            {{ coupon.usedCount || 0 }}{{ coupon.maxUses ? ` de ${coupon.maxUses}` : ' (sin límite)' }}
          </AdminDatum>

          <template #actions>
            <button class="btn btn--ghost adm-btn-sm" @click="open(coupon)">
              <i class="fa-solid fa-pen"></i>
              Editar
            </button>
            <button class="btn btn--ghost adm-btn-sm" @click="toggleActive(coupon)">
              {{ coupon.isActive ? 'Desactivar' : 'Activar' }}
            </button>
            <button class="adm-icon-btn adm-icon-btn--danger" aria-label="Borrar cupón" @click="askDelete(coupon)">
              <i class="fa-solid fa-trash"></i>
            </button>
          </template>
        </AdminRecord>
      </div>
    </AdminState>

    <CouponForm :form="form" :products="products" :saving="saving" @close="form.open = false" @save="save" />
    <BaseModal v-bind="confirm.modal" @confirm="confirm.accept" @cancel="confirm.cancel" />
  </section>
</template>
