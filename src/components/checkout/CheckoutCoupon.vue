<script setup lang="ts">
import { studentCopy } from '@/config/student'
import type { CouponResult } from '@/types/student'

defineProps<{
  applied: CouponResult | null
  error: string
  loading: boolean
  // Con la Cajita ya montada el monto no puede cambiar: el cupón se bloquea.
  locked: boolean
}>()

defineEmits<{ apply: []; remove: [] }>()

const code = defineModel<string>({ required: true })
const copy = studentCopy.checkout.coupon
</script>

<template>
  <div class="coupon">
    <p v-if="applied" class="coupon__applied">
      <i class="fa-solid fa-tag" aria-hidden="true"></i>
      <span>{{ copy.applied(applied.code, applied.percentOff) }}</span>
      <button v-if="!locked" type="button" class="coupon__remove" @click="$emit('remove')">
        {{ copy.remove }}
      </button>
    </p>

    <form v-else-if="!locked" class="coupon__form" @submit.prevent="$emit('apply')">
      <label for="coupon-code">{{ copy.label }}</label>
      <div class="coupon__row">
        <input
          id="coupon-code"
          v-model="code"
          type="text"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          :placeholder="copy.placeholder"
          :aria-invalid="!!error"
          aria-describedby="coupon-error"
        />
        <button
          class="btn btn--ghost coupon__apply"
          type="submit"
          :disabled="loading || !code.trim()"
        >
          <i v-if="loading" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
          {{ copy.apply }}
        </button>
      </div>
      <p v-if="error" id="coupon-error" class="coupon__error" role="alert">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped lang="scss">
.coupon {
  &__row {
    @include flex(row, stretch, flex-start, 0.5rem);

    input {
      flex: 1;
      min-width: 0;
      text-transform: uppercase;
    }
  }

  &__apply {
    flex: 0 0 auto;
    padding-inline: 1.1rem;
  }

  &__error {
    margin-top: 0.4rem;
    font-size: $text-sm;
    color: $danger;
  }

  &__applied {
    @include flex(row, center, flex-start, 0.55rem);
    flex-wrap: wrap;
    padding: 0.65rem 0.85rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    color: $ink;
    background: $success-bg;

    i {
      color: $success;
    }

    span {
      flex: 1;
      min-width: 0;
    }
  }

  &__remove {
    font-size: $text-sm;
    font-weight: 600;
    text-decoration: underline;
    color: $ink-soft;
    // Área táctil cómoda sin agrandar la fila.
    padding: 0.4rem 0.2rem;
    margin: -0.4rem 0;
  }
}
</style>
