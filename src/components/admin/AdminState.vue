<script setup lang="ts">
import { adminCopy } from '@/config/admin'

// Un solo lugar decide qué se ve mientras carga, si falló o si no hay nada.
defineProps<{
  loading?: boolean
  error?: string
  empty?: boolean
  emptyText?: string
  emptyIcon?: string
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="loading" class="state" role="status">
    <i class="fa-solid fa-spinner fa-spin state__icon"></i>
    <p>{{ adminCopy.loading }}</p>
  </div>

  <div v-else-if="error" class="state state--error" role="alert">
    <i class="fa-solid fa-circle-exclamation state__icon"></i>
    <p>{{ error }}</p>
    <button class="btn btn--ghost adm-btn-sm" @click="emit('retry')">
      <i class="fa-solid fa-rotate-right"></i>
      {{ adminCopy.retry }}
    </button>
  </div>

  <div v-else-if="empty" class="state">
    <i :class="[emptyIcon || 'fa-regular fa-folder-open', 'state__icon']"></i>
    <p>{{ emptyText }}</p>
    <slot name="empty-action" />
  </div>

  <slot v-else />
</template>

<style scoped lang="scss">
.state {
  @include card;
  @include flex(column, center, center, 0.8rem);
  text-align: center;
  padding: 2.5rem 1.25rem;
  font-size: $text-sm;
  color: $ink-soft;

  &__icon {
    font-size: 1.6rem;
    color: $ink-muted;
  }

  &--error &__icon {
    color: $danger;
  }
}
</style>
