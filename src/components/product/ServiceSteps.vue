<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'

// El flujo nuevo de la asesoría: encuesta → Kath aprueba → pago y sesiones.
const copy = site.product.service
</script>

<template>
  <section class="steps">
    <h2 v-reveal class="steps__title">{{ copy.stepsTitle }}</h2>
    <ol class="steps__list">
      <li v-for="(step, i) in copy.steps" :key="step.title" v-reveal="i + 1" class="steps__item">
        <span class="steps__num" aria-hidden="true">{{ i + 1 }}</span>
        <h3 class="steps__name">{{ step.title }}</h3>
        <p class="steps__text">{{ step.text }}</p>
      </li>
    </ol>
  </section>
</template>

<style scoped lang="scss">
.steps {
  &__title {
    @include display($display-sm);
    margin-bottom: 1.4rem;
  }

  &__list {
    @include flex-cards(200px, 1.25rem);
    list-style: none;
  }

  &__item {
    @include flex(column, flex-start, flex-start, 0.5rem);
    background: $sand;
    border-radius: $radius-md;
    padding: 1.4rem 1.3rem;
  }

  &__num {
    font-family: $font-display;
    font-style: italic;
    font-size: 3.2rem;
    line-height: 0.85;
    color: $clay;
  }

  &__name {
    @include display($text-xl, 600);
    margin-top: 0.5rem;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
