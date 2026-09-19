<script setup lang="ts">
import { site } from '@/config/site'
import BaseButton from '@/components/ui/BaseButton.vue'

const copy = site.notFound
</script>

<template>
  <section class="not-found">
    <p class="not-found__code">{{ copy.code }}</p>
    <h1 class="not-found__title">
      {{ copy.title.before }}<em>{{ copy.title.em }}</em
      >{{ copy.title.after }}
    </h1>
    <p class="not-found__text">{{ copy.text }}</p>
    <div class="not-found__actions">
      <BaseButton to="/">{{ copy.cta }}</BaseButton>
      <BaseButton to="/cursos" variant="ghost">{{ copy.secondary }}</BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  @include container(680px);
  @include flex(column, center, center, 1rem);
  flex: 1;
  text-align: center;
  padding-block: $space-section;

  &__code {
    @include eyebrow;
    color: $clay-deep;
  }

  &__title {
    @include display($display-lg);
  }

  &__text {
    color: $ink-soft;
    max-width: 30rem;
  }

  &__actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }
}
</style>
