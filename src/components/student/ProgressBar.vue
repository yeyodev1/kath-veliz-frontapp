<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ percent: number; label: string }>()

const value = computed(() => Math.min(100, Math.max(0, Math.round(props.percent || 0))))
</script>

<template>
  <div class="progress">
    <div
      class="progress__track"
      role="progressbar"
      :aria-valuenow="value"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="label"
    >
      <!-- scaleX y no width: la barra se anima sin recalcular layout. -->
      <span class="progress__fill" :style="{ transform: `scaleX(${value / 100})` }"></span>
    </div>
    <p class="progress__meta">
      <span>{{ label }}</span>
      <strong>{{ value }}%</strong>
    </p>
  </div>
</template>

<style scoped lang="scss">
.progress {
  @include flex(column, stretch, flex-start, 0.4rem);

  &__track {
    height: 0.4rem;
    border-radius: $radius-pill;
    background: $sand;
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    border-radius: $radius-pill;
    background: $accent;
    transform-origin: left center;
    @include transition(transform);
  }

  &__meta {
    @include flex(row, baseline, space-between, 0.5rem);
    font-size: $text-xs;
    color: $ink-muted;

    strong {
      color: $ink-soft;
      font-variant-numeric: tabular-nums;
    }
  }
}
</style>
