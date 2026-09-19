<script setup lang="ts">
import type { BadgeTone } from '@/types/admin'

defineProps<{ tone?: BadgeTone; icon?: string }>()
</script>

<template>
  <span class="badge" :class="`badge--${tone || 'neutral'}`">
    <i v-if="icon" :class="icon"></i>
    <slot />
  </span>
</template>

<style scoped lang="scss">
.badge {
  @include flex(row, center, center, 0.35rem);
  display: inline-flex;
  padding: 0.25rem 0.7rem;
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
  background: $sand;
  color: $ink-soft;

  &--success {
    background: $success-bg;
    color: darken($success, 18);
  }

  &--warning {
    background: $warning-bg;
    color: darken($warning, 22);
  }

  &--danger {
    background: $danger-bg;
    color: darken($danger, 10);
  }

  &--info {
    background: $info-bg;
    color: darken($info, 18);
  }
}
</style>
