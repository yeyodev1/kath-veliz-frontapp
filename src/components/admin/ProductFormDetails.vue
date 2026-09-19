<script setup lang="ts">
import AdminStringList from './AdminStringList.vue'
import AdminFaqList from './AdminFaqList.vue'
import AdminFileUpload from './AdminFileUpload.vue'
import AdminSurveyBuilder from './AdminSurveyBuilder.vue'
import type { ProductFormState } from '@/composables/admin/useProductForm'

defineProps<{ form: ProductFormState }>()
</script>

<template>
  <!-- Lo propio de cada tipo de producto -->
  <section v-if="form.type === 'download'" class="adm-card adm-form">
    <h2 class="adm-section-title">Archivo descargable</h2>
    <AdminFileUpload
      v-model="form.downloadFile"
      label="Archivo que recibe quien compra"
      hint="Queda privado: solo lo puede descargar quien tenga acceso. Hasta 100 MB."
      private
    />
  </section>

  <section v-if="form.type === 'free'" class="adm-card adm-form">
    <h2 class="adm-section-title">Recurso gratuito</h2>
    <div class="adm-field">
      <label for="product-free-url">Enlace del recurso</label>
      <input
        id="product-free-url"
        v-model="form.freeResourceUrl"
        type="url"
        inputmode="url"
        autocapitalize="none"
        placeholder="https://…"
      />
      <p class="adm-field__hint">
        Este enlace llega por correo a quien deje su nombre y su correo.
      </p>
    </div>
  </section>

  <section v-if="form.type === 'service'" class="adm-card adm-form">
    <h2 class="adm-section-title">Asesoría</h2>
    <AdminFileUpload
      v-model="form.infoPdf"
      label="PDF informativo"
      hint="Se envía por correo apenas la persona llena la encuesta."
      accept="application/pdf"
    />
    <AdminSurveyBuilder v-model="form.surveyQuestions" />
  </section>

  <section class="adm-card adm-form">
    <h2 class="adm-section-title">Página de venta</h2>
    <AdminStringList
      v-model="form.highlights"
      label="Qué vas a recibir"
      placeholder="Ej.: 5 módulos grabados"
      add-label="Agregar punto"
    />
    <AdminStringList
      v-model="form.audience"
      label="Esto es para ti si…"
      placeholder="Ej.: Sientes que el sueldo no te alcanza"
      add-label="Agregar punto"
    />
    <AdminFaqList v-model="form.faqs" />
  </section>
</template>
