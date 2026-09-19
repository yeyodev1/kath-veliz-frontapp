<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  backTo?: string
  backLabel?: string
}>()
</script>

<template>
  <header class="page-header">
    <RouterLink v-if="backTo" :to="backTo" class="page-header__back">
      <i class="fa-solid fa-arrow-left"></i>
      {{ backLabel || 'Volver' }}
    </RouterLink>
    <div class="page-header__row">
      <div class="page-header__text">
        <h1 class="page-header__title">{{ title }}</h1>
        <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.default" class="page-header__actions">
        <slot />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-header {
  @include flex(column, stretch, flex-start, 0.4rem);

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    align-self: flex-start;
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;

    &:hover {
      color: $accent-deep;
    }
  }

  &__row {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__text {
    flex: 1 1 220px;
    min-width: 0;
  }

  &__title {
    @include display($display-sm, 600);
    overflow-wrap: anywhere;
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.3rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }
}
</style>
