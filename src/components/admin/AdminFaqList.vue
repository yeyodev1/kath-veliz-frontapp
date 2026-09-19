<script setup lang="ts">
import type { ProductFaq } from '@/types/admin'

const faqs = defineModel<ProductFaq[]>({ required: true })
</script>

<template>
  <div class="faq-list">
    <span class="faq-list__label">Preguntas frecuentes</span>

    <div v-for="(faq, index) in faqs" :key="index" class="faq-list__item">
      <div class="faq-list__fields">
        <input v-model="faq.question" type="text" placeholder="Pregunta" :aria-label="`Pregunta ${index + 1}`" />
        <textarea v-model="faq.answer" rows="2" placeholder="Respuesta" :aria-label="`Respuesta ${index + 1}`"></textarea>
      </div>
      <button
        type="button"
        class="adm-icon-btn adm-icon-btn--danger"
        :aria-label="`Quitar pregunta ${index + 1}`"
        @click="faqs.splice(index, 1)"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <button
      type="button"
      class="btn btn--ghost adm-btn-sm faq-list__add"
      @click="faqs.push({ question: '', answer: '' })"
    >
      <i class="fa-solid fa-plus"></i>
      Agregar pregunta
    </button>
  </div>
</template>

<style scoped lang="scss">
.faq-list {
  @include flex(column, stretch, flex-start, 0.6rem);
  min-width: 0;

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
  }

  &__item {
    @include flex(row, flex-start, flex-start, 0.5rem);
    padding: 0.7rem;
    border-radius: $radius-sm;
    background: $sand;
  }

  &__fields {
    @include flex(column, stretch, flex-start, 0.5rem);
    flex: 1;
    min-width: 0;
  }

  &__add {
    align-self: flex-start;
  }
}
</style>
