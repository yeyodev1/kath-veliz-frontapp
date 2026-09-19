<script setup lang="ts">
import { adminCopy, saleModeHints, saleModeLabels } from '@/config/admin'
import type { ProductFormState } from '@/composables/admin/useProductForm'

defineProps<{ form: ProductFormState }>()
const copy = adminCopy.products
</script>

<template>
  <section class="adm-card adm-form">
    <h2 class="adm-section-title">Precio y venta</h2>

    <div v-if="form.type !== 'free'" class="adm-row">
      <div class="adm-field">
        <label for="product-price">Precio (USD)</label>
        <input
          id="product-price"
          v-model="form.price"
          type="text"
          inputmode="decimal"
          placeholder="49.90"
          autocomplete="off"
        />
        <p class="adm-field__hint">En dólares, con centavos. Ej.: 49.90</p>
      </div>
      <div class="adm-field">
        <label for="product-compare">Precio anterior (opcional)</label>
        <input
          id="product-compare"
          v-model="form.compareAtPrice"
          type="text"
          inputmode="decimal"
          placeholder="79.00"
          autocomplete="off"
        />
        <p class="adm-field__hint">Se muestra tachado junto al precio.</p>
      </div>
    </div>
    <p v-else class="adm-muted">Los recursos gratuitos no tienen precio.</p>

    <fieldset class="sale__group">
      <legend>¿Cómo se vende?</legend>
      <label
        v-for="(label, value) in saleModeLabels"
        :key="value"
        class="adm-choice"
        :class="{ 'adm-choice--active': form.saleMode === value }"
      >
        <input v-model="form.saleMode" type="radio" name="sale-mode" :value="value" />
        <span>
          {{ label }}
          <small>{{ saleModeHints[value] }}</small>
        </span>
      </label>
    </fieldset>

    <fieldset v-if="form.type !== 'free'" class="sale__group">
      <legend>¿Cuánto dura el acceso de quien compra?</legend>
      <label class="adm-choice" :class="{ 'adm-choice--active': form.lifetime }">
        <input v-model="form.lifetime" type="radio" name="access-duration" :value="true" />
        <span>
          {{ copy.lifetime }}
          <small>El acceso no vence nunca.</small>
        </span>
      </label>
      <label class="adm-choice" :class="{ 'adm-choice--active': !form.lifetime }">
        <input v-model="form.lifetime" type="radio" name="access-duration" :value="false" />
        <span>
          {{ copy.limited }}
          <small>Se cuenta desde el día de la compra.</small>
        </span>
      </label>
      <div v-if="!form.lifetime" class="adm-field">
        <label for="product-days">Días de acceso</label>
        <input
          id="product-days"
          v-model.number="form.accessDays"
          type="number"
          inputmode="numeric"
          min="1"
          placeholder="365"
        />
      </div>
    </fieldset>

    <div class="adm-row">
      <div class="adm-field">
        <label for="product-order">Orden en la web</label>
        <input id="product-order" v-model.number="form.order" type="number" inputmode="numeric" min="0" />
        <p class="adm-field__hint">El número más bajo aparece primero.</p>
      </div>
    </div>

    <label class="adm-choice" :class="{ 'adm-choice--active': form.isPublished }">
      <input v-model="form.isPublished" type="checkbox" />
      <span>
        Publicado
        <small>
          {{ form.isPublished ? 'Se ve en la web.' : 'Borrador: solo tú lo ves, aquí en el panel.' }}
        </small>
      </span>
    </label>
  </section>
</template>

<style scoped lang="scss">
.sale__group {
  @include flex(column, stretch, flex-start, 0.5rem);
  border: none;
  min-width: 0;

  legend {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
    margin-bottom: 0.5rem;
  }
}
</style>
