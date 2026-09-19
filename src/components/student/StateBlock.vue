<script setup lang="ts">
// Pantalla de estado (cargando, vacío, error, bloqueado, pago aprobado…).
// Una sola pieza para que todos los estados del área del alumno se vean iguales.
withDefaults(
  defineProps<{
    icon?: string
    tone?: 'neutral' | 'success' | 'warning' | 'danger'
    eyebrow?: string
    title?: string
    text?: string
    loading?: boolean
    compact?: boolean
  }>(),
  { icon: 'fa-circle-info', tone: 'neutral', loading: false, compact: false },
)
</script>

<template>
  <div
    class="state"
    :class="[`state--${tone}`, { 'state--compact': compact }]"
    :role="loading ? 'status' : undefined"
    aria-live="polite"
  >
    <span class="state__icon" aria-hidden="true">
      <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
      <i v-else class="fa-solid" :class="icon"></i>
    </span>
    <p v-if="eyebrow" class="state__eyebrow">{{ eyebrow }}</p>
    <h2 v-if="title" class="state__title">{{ title }}</h2>
    <p v-if="text" class="state__text">{{ text }}</p>
    <slot />
    <div v-if="$slots.actions" class="state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.state {
  @include flex(column, center, center, 0.75rem);
  width: 100%;
  max-width: 520px;
  margin-inline: auto;
  padding: $space-lg 0.5rem;
  text-align: center;

  &--compact {
    padding-block: $space-md;
  }

  &__icon {
    @include flex(row, center, center);
    width: 3.5rem;
    height: 3.5rem;
    border-radius: $radius-pill;
    font-size: 1.35rem;
    color: $ink-soft;
    background: $sand;
    margin-bottom: 0.25rem;
  }

  &--success &__icon {
    color: $success;
    background: $success-bg;
  }

  &--warning &__icon {
    color: $warning;
    background: $warning-bg;
  }

  &--danger &__icon {
    color: $danger;
    background: $danger-bg;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($text-xl, 600);
    line-height: 1.2;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-base;
  }

  &__actions {
    @include flex(column, stretch, center, 0.6rem);
    width: 100%;
    margin-top: 0.75rem;

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      width: auto;
    }
  }
}
</style>
