<script setup lang="ts">
import { studentCopy } from '@/config/student'
import type { BuyerData } from '@/types/student'

defineProps<{
  email: string
  errors: BuyerData
  disabled: boolean
}>()

const buyer = defineModel<BuyerData>({ required: true })
const copy = studentCopy.checkout.buyer
</script>

<template>
  <fieldset class="buyer" :disabled="disabled">
    <legend class="buyer__title">{{ copy.title }}</legend>
    <p class="buyer__hint">{{ copy.hint }}</p>

    <div class="buyer__field">
      <label for="buyer-email">{{ copy.email }}</label>
      <input id="buyer-email" :value="email" type="email" readonly />
    </div>

    <div class="buyer__pair">
      <div class="buyer__field">
        <label for="buyer-phone">{{ copy.phone }}</label>
        <input
          id="buyer-phone"
          v-model="buyer.phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          required
          :placeholder="copy.phonePlaceholder"
          :aria-invalid="!!errors.phone"
          aria-describedby="buyer-phone-error"
        />
        <p v-if="errors.phone" id="buyer-phone-error" class="buyer__error" role="alert">
          {{ errors.phone }}
        </p>
      </div>

      <div class="buyer__field">
        <label for="buyer-document">{{ copy.documentId }}</label>
        <input
          id="buyer-document"
          v-model="buyer.documentId"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          required
          :placeholder="copy.documentPlaceholder"
          :aria-invalid="!!errors.documentId"
          aria-describedby="buyer-document-error"
        />
        <p v-if="errors.documentId" id="buyer-document-error" class="buyer__error" role="alert">
          {{ errors.documentId }}
        </p>
      </div>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.buyer {
  @include flex(column, stretch, flex-start, 1rem);
  border: none;
  min-width: 0;

  &__title {
    @include display($text-xl, 600);
    padding: 0;
    margin-bottom: 0.35rem;
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__pair {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('sm') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__field {
    flex: 1;
    min-width: 0;

    input[readonly] {
      color: $ink-soft;
      background: $sand;
      border-color: transparent;
    }
  }

  &__error {
    margin-top: 0.4rem;
    font-size: $text-sm;
    color: $danger;
  }
}
</style>
