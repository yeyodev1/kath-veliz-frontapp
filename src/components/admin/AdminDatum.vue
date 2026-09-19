<script setup lang="ts">
defineProps<{ label: string; wide?: boolean }>()
</script>

<template>
  <div class="datum" :class="{ 'datum--wide': wide }">
    <span class="datum__label">{{ label }}</span>
    <span class="datum__value"><slot /></span>
  </div>
</template>

<style scoped lang="scss">
.datum {
  @include flex(column, flex-start, flex-start, 0.1rem);
  flex: 1 1 130px;
  min-width: 0;

  &--wide {
    flex-basis: 100%;
  }

  &__label {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__value {
    font-size: $text-sm;
    color: $ink;
    overflow-wrap: anywhere;
    white-space: pre-line;
  }
}
</style>
