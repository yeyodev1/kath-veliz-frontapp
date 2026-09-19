<script setup lang="ts">
import { nextTick, ref } from 'vue'
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

// Colapsado por defecto: la mayoría no tiene cupón y un campo vacío a la vista
// invita a salir a buscar uno. Quien sí lo tiene lo encuentra en un toque.
const open = ref(false)

function toggle() {
  open.value = !open.value
  if (open.value) nextTick(() => document.getElementById('coupon-code')?.focus())
}
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

    <button
      v-else-if="!locked"
      type="button"
      class="coupon__toggle"
      :aria-expanded="open"
      aria-controls="coupon-form"
      @click="toggle"
    >
      <i class="fa-solid fa-tag" aria-hidden="true"></i>
      <span>{{ copy.label }}</span>
      <i
        class="fa-solid"
        :class="open ? 'fa-chevron-up' : 'fa-chevron-down'"
        aria-hidden="true"
      ></i>
    </button>

    <form
      v-if="!applied && !locked && open"
      id="coupon-form"
      class="coupon__form"
      @submit.prevent="$emit('apply')"
    >
      <label class="visually-hidden" for="coupon-code">{{ copy.codeLabel }}</label>
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
  &__toggle {
    @include flex(row, center, flex-start, 0.5rem);
    width: 100%;
    min-height: 2.75rem;
    font-size: $text-sm;
    font-weight: 600;
    text-align: left;
    color: $accent-deep;

    span {
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    i:last-child {
      font-size: 0.7em;
    }
  }

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
