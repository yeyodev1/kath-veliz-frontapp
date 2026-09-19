<script setup lang="ts">
import AdminImageUpload from './AdminImageUpload.vue'
import { productTypeHints, productTypeLabels } from '@/config/admin'
import type { ProductFormState } from '@/composables/admin/useProductForm'

// `form` es el estado reactivo de useProductForm: los campos escriben directo en él.
defineProps<{ form: ProductFormState; isNew: boolean }>()
const emit = defineEmits<{ titleInput: []; slugInput: [] }>()
</script>

<template>
  <section class="adm-card adm-form">
    <h2 class="adm-section-title">Lo básico</h2>

    <fieldset class="basics__types">
      <legend>¿Qué tipo de producto es?</legend>
      <label
        v-for="(label, value) in productTypeLabels"
        :key="value"
        class="adm-choice"
        :class="{ 'adm-choice--active': form.type === value }"
      >
        <input v-model="form.type" type="radio" name="product-type" :value="value" />
        <span>
          {{ label }}
          <small>{{ productTypeHints[value] }}</small>
        </span>
      </label>
    </fieldset>

    <div class="adm-field">
      <label for="product-title">Título</label>
      <input id="product-title" v-model="form.title" type="text" required @input="emit('titleInput')" />
    </div>

    <div class="adm-field">
      <label for="product-slug">Enlace de la página</label>
      <input
        id="product-slug"
        v-model="form.slug"
        type="text"
        autocapitalize="none"
        autocomplete="off"
        spellcheck="false"
        @input="emit('slugInput')"
      />
      <p class="adm-field__hint">
        La página quedará en /p/{{ form.slug || 'tu-producto' }}.
        <template v-if="!isNew">Si lo cambias, los enlaces que ya compartiste dejan de funcionar.</template>
      </p>
    </div>

    <div class="adm-field">
      <label for="product-subtitle">Subtítulo</label>
      <input id="product-subtitle" v-model="form.subtitle" type="text" />
    </div>

    <div class="adm-field">
      <label for="product-description">Descripción</label>
      <textarea id="product-description" v-model="form.description" rows="6"></textarea>
      <p class="adm-field__hint">Los saltos de línea se respetan en la página.</p>
    </div>

    <AdminImageUpload v-model="form.cover" label="Portada" hint="Horizontal, JPG o PNG, hasta 10 MB." />
  </section>
</template>

<style scoped lang="scss">
.basics__types {
  @include flex-cards(220px, 0.5rem);
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
