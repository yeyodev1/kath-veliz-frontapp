<script setup lang="ts">
// Encabezado de sección: eyebrow condensado + titular serif con una palabra
// en cursiva. Es la firma tipográfica del sitio, por eso vive en un solo lugar.
withDefaults(
  defineProps<{
    eyebrow?: string
    title: { before: string; em: string; after: string }
    text?: string
    level?: 1 | 2
    align?: 'left' | 'center'
    onDark?: boolean
  }>(),
  { level: 2, align: 'left' },
)
</script>

<template>
  <header class="heading" :class="[`heading--${align}`, { 'heading--dark': onDark }]">
    <p v-if="eyebrow" class="heading__eyebrow">{{ eyebrow }}</p>
    <component :is="`h${level}`" class="heading__title" :class="`heading__title--h${level}`">
      {{ title.before }}<em>{{ title.em }}</em
      >{{ title.after }}
    </component>
    <p v-if="text" class="heading__text">{{ text }}</p>
  </header>
</template>

<style scoped lang="scss">
.heading {
  @include flex(column, flex-start, flex-start, 0.9rem);
  max-width: 44rem;

  &--center {
    align-items: center;
    text-align: center;
    margin-inline: auto;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.7rem);

    // Filete corto antes del eyebrow, como en una cabecera de revista.
    &::before {
      content: '';
      width: 1.8rem;
      height: 1px;
      background: currentColor;
    }
  }

  &__title {
    @include display($display-md);

    &--h1 {
      font-size: $display-lg;
    }
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 38rem;
  }

  &--dark {
    color: $paper;

    .heading__eyebrow {
      color: $butter;
    }

    .heading__title em {
      color: $butter;
    }

    .heading__text {
      color: rgba($paper, 0.82);
    }
  }
}
</style>
