<script setup lang="ts">
import { computed } from 'vue'
import { studentCopy } from '@/config/student'
import type { ProductType } from '@/types/student'

const props = defineProps<{ type: ProductType }>()

const copy = studentCopy.checkout.trust

// En una asesoría no hay nada que "abrir" al pagar: prometer acceso inmediato sería mentir.
const seals = computed(() => [
  { icon: 'fa-solid fa-lock', text: copy.secure },
  props.type === 'service'
    ? { icon: 'fa-regular fa-comment-dots', text: copy.service }
    : { icon: 'fa-solid fa-bolt', text: copy.instant },
])
</script>

<template>
  <div class="trust" role="group" :aria-label="copy.label">
    <ul class="trust__seals">
      <li v-for="seal in seals" :key="seal.text">
        <i :class="seal.icon" aria-hidden="true"></i> {{ seal.text }}
      </li>
    </ul>
    <p class="trust__methods">
      <i class="fa-regular fa-credit-card" aria-hidden="true"></i> {{ copy.methods }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.trust {
  @include flex(column, stretch, flex-start, 0.5rem);
  font-size: $text-xs;
  color: $ink-soft;

  &__seals {
    list-style: none;
    padding: 0;
    @include flex(row, center, flex-start, 0.4rem 1.1rem);
    flex-wrap: wrap;
    font-weight: 600;
    color: $ink;

    i {
      margin-right: 0.3rem;
      color: $success;
    }
  }

  &__methods i {
    margin-right: 0.3rem;
    color: $ink-muted;
  }
}
</style>
