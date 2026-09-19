<script setup lang="ts">
import { studentCopy } from '@/config/student'

// Dos pasos y nada más: saber cuánto falta baja la ansiedad de pagar.
defineProps<{ current: 1 | 2 }>()

const copy = studentCopy.checkout.steps
const steps = [copy.data, copy.pay]
</script>

<template>
  <ol class="steps" :aria-label="copy.label">
    <li
      v-for="(label, index) in steps"
      :key="label"
      class="steps__item"
      :class="{
        'steps__item--current': current === index + 1,
        'steps__item--done': current > index + 1,
      }"
      :aria-current="current === index + 1 ? 'step' : undefined"
    >
      <span class="steps__dot" aria-hidden="true">
        <i v-if="current > index + 1" class="fa-solid fa-check"></i>
        <template v-else>{{ index + 1 }}</template>
      </span>
      <span class="steps__label">{{ label }}</span>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.steps {
  list-style: none;
  padding: 0;
  @include flex(row, center, flex-start, 0.6rem);

  &__item {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-muted;

    // La línea que une un paso con el siguiente.
    & + &::before {
      content: '';
      width: 1.75rem;
      height: 1px;
      margin-right: 0.1rem;
      background: $line;
    }

    &--current,
    &--done {
      color: $ink;
    }
  }

  &__dot {
    @include flex(row, center, center);
    flex: 0 0 1.6rem;
    height: 1.6rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    color: $ink-muted;
    border: 1px solid $line;
    background: $surface;
  }

  &__item--current &__dot {
    color: $paper;
    border-color: $accent;
    background: $accent;
  }

  &__item--done &__dot {
    color: $success;
    border-color: transparent;
    background: $success-bg;
  }
}
</style>
