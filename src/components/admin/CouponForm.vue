<script setup lang="ts">
import AdminSheet from './AdminSheet.vue'
import type { AdminProduct } from '@/types/admin'

interface CouponFormState {
  open: boolean
  id: string
  code: string
  percentOff: number
  product: string
  expires: string
  maxUses: string
  isActive: boolean
}

defineProps<{ form: CouponFormState; products: AdminProduct[]; saving: boolean }>()
const emit = defineEmits<{ close: []; save: [] }>()
</script>

<template>
  <AdminSheet :open="form.open" :title="form.id ? 'Editar cupón' : 'Nuevo cupón'" @close="emit('close')">
    <form id="coupon-form" class="adm-form" @submit.prevent="emit('save')">
      <div class="adm-row">
        <div class="adm-field">
          <label for="coupon-code">Código</label>
          <input
            id="coupon-code"
            v-model="form.code"
            type="text"
            autocapitalize="characters"
            autocomplete="off"
            placeholder="BIENVENIDA10"
            class="coupon__code"
            required
          />
          <p class="adm-field__hint">Se guarda en mayúsculas.</p>
        </div>
        <div class="adm-field">
          <label for="coupon-percent">Descuento (%)</label>
          <input
            id="coupon-percent"
            v-model.number="form.percentOff"
            type="number"
            inputmode="numeric"
            min="1"
            max="100"
            required
          />
        </div>
      </div>

      <div class="adm-field">
        <label for="coupon-product">¿Para qué producto?</label>
        <select id="coupon-product" v-model="form.product">
          <option value="">Todos los productos</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.title }}
          </option>
        </select>
      </div>

      <div class="adm-row">
        <div class="adm-field">
          <label for="coupon-expires">Vence el (opcional)</label>
          <input id="coupon-expires" v-model="form.expires" type="date" />
          <p class="adm-field__hint">Vacío = no vence.</p>
        </div>
        <div class="adm-field">
          <label for="coupon-max">Máximo de usos (opcional)</label>
          <input id="coupon-max" v-model="form.maxUses" type="number" inputmode="numeric" min="1" />
          <p class="adm-field__hint">Vacío = sin límite.</p>
        </div>
      </div>

      <label class="adm-check">
        <input v-model="form.isActive" type="checkbox" />
        <span>Cupón activo</span>
      </label>
    </form>

    <template #footer>
      <button type="button" class="btn btn--ghost" @click="emit('close')">Cancelar</button>
      <button type="submit" form="coupon-form" class="btn btn--primary" :disabled="saving">
        {{ saving ? 'Guardando…' : 'Guardar cupón' }}
      </button>
    </template>
  </AdminSheet>
</template>

<style scoped lang="scss">
.coupon__code {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
</style>
