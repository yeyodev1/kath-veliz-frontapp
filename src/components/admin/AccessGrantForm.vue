<script setup lang="ts">
import { onMounted } from 'vue'
import AdminSheet from './AdminSheet.vue'
import AdminExpiryChoice from './AdminExpiryChoice.vue'
import { adminCopy, productTypeLabels } from '@/config/admin'
import { useAccessGrant } from '@/composables/admin/useAccessGrant'
import { useProductOptions } from '@/composables/admin/useProductOptions'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; granted: [] }>()

const { products, loading, load } = useProductOptions()
const { form, expiry, saving, canSubmit, toggleProduct, submit } = useAccessGrant(() => {
  emit('granted')
  emit('close')
})

onMounted(() => load())
</script>

<template>
  <AdminSheet
    :open="open"
    :title="adminCopy.access.grant"
    subtitle="Si la persona no tiene cuenta, se crea y le llega un correo para definir su contraseña."
    @close="emit('close')"
  >
    <form id="grant-form" class="adm-form" @submit.prevent="submit">
      <div class="adm-field">
        <label for="grant-email">Correo del alumno</label>
        <input
          id="grant-email"
          v-model="form.email"
          type="email"
          inputmode="email"
          autocomplete="off"
          autocapitalize="none"
          placeholder="nombre@correo.com"
          required
        />
      </div>

      <div class="adm-field">
        <label for="grant-name">Nombre (opcional)</label>
        <input id="grant-name" v-model="form.name" type="text" autocomplete="off" />
      </div>

      <fieldset class="grant__products">
        <legend>Productos a los que tendrá acceso</legend>
        <p v-if="loading" class="adm-muted">Cargando productos…</p>
        <p v-else-if="!products.length" class="adm-muted">Todavía no hay productos creados.</p>
        <label
          v-for="product in products"
          :key="product.id"
          class="adm-choice"
          :class="{ 'adm-choice--active': form.productIds.includes(product.id) }"
        >
          <input
            type="checkbox"
            :checked="form.productIds.includes(product.id)"
            @change="toggleProduct(product.id)"
          />
          <span>
            {{ product.title }}
            <small>{{ productTypeLabels[product.type] }}</small>
          </span>
        </label>
      </fieldset>

      <AdminExpiryChoice v-model="expiry.choice" :min-date="expiry.minDate" name="grant-expiry" />

      <div class="adm-field">
        <label for="grant-note">Nota (opcional)</label>
        <textarea
          id="grant-note"
          v-model="form.note"
          rows="2"
          placeholder="Ej.: alumna de la cohorte 2025, cortesía, canje…"
        ></textarea>
        <p class="adm-field__hint">
          Solo la ves tú. Sirve para acordarte por qué diste este acceso.
        </p>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn--ghost" @click="emit('close')">Cancelar</button>
      <button type="submit" form="grant-form" class="btn btn--primary" :disabled="!canSubmit">
        <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
        {{ saving ? 'Enviando…' : 'Dar acceso' }}
      </button>
    </template>
  </AdminSheet>
</template>

<style scoped lang="scss">
.grant__products {
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
