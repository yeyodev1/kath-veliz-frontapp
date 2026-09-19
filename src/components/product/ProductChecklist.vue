<script setup lang="ts">
import { vReveal } from '@/composables/useReveal'

// "Qué vas a recibir" y "Es para ti si…" son la misma lista con otro icono.
withDefaults(defineProps<{ title: string; items: string[]; variant?: 'check' | 'star' }>(), {
  variant: 'check',
})
</script>

<template>
  <section v-reveal class="checklist" :class="`checklist--${variant}`">
    <h2 class="checklist__title">{{ title }}</h2>
    <ul class="checklist__list">
      <li v-for="item in items" :key="item">
        <i :class="variant === 'check' ? 'fa-solid fa-check' : 'fa-solid fa-star'" aria-hidden="true"></i>
        <span>{{ item }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.checklist {
  &__title {
    @include display($display-sm);
    margin-bottom: 1.4rem;
  }

  &__list {
    @include flex-cards(260px, 0.9rem 2rem);
    list-style: none;

    li {
      @include flex(row, flex-start, flex-start, 0.8rem);
      padding-bottom: 0.9rem;
      border-bottom: 1px solid $line;
    }

    i {
      @include flex(row, center, center);
      flex-shrink: 0;
      width: 1.6rem;
      height: 1.6rem;
      margin-top: 0.15rem;
      border-radius: 50%;
      font-size: 0.7rem;
      background: $accent-soft;
      color: $accent;
    }
  }

  &--star i {
    background: $clay-soft;
    color: $clay-deep;
  }
}
</style>
