<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { adminCopy } from '@/config/admin'
import type { ExpiryChoice } from '@/types/admin'

// Dos opciones, ninguna marcada al abrir. Es a propósito: Kath tiene que
// decidir cada vez si el acceso vence o no.
const choice = defineModel<ExpiryChoice>({ required: true })
defineProps<{ minDate: string; name: string }>()

const dateInput = ref<HTMLInputElement | null>(null)
const copy = adminCopy.access

async function pickDate() {
  choice.value.mode = 'date'
  await nextTick()
  dateInput.value?.focus()
}
</script>

<template>
  <fieldset class="expiry">
    <legend class="expiry__legend">{{ copy.expiryLegend }}</legend>

    <label class="adm-choice" :class="{ 'adm-choice--active': choice.mode === 'date' }">
      <input
        type="radio"
        :name="name"
        value="date"
        :checked="choice.mode === 'date'"
        @change="pickDate"
      />
      <span>
        {{ copy.expiryDate }}
        <small>{{ copy.expiryDateHint }}</small>
      </span>
    </label>

    <div v-if="choice.mode === 'date'" class="expiry__date">
      <label :for="`${name}-date`">Fecha en que se revoca</label>
      <input
        :id="`${name}-date`"
        ref="dateInput"
        v-model="choice.date"
        type="date"
        :min="minDate"
        required
      />
      <p v-if="choice.date && choice.date < minDate" class="adm-field__error">
        La fecha tiene que ser a partir de mañana.
      </p>
    </div>

    <label class="adm-choice" :class="{ 'adm-choice--active': choice.mode === 'never' }">
      <input
        type="radio"
        :name="name"
        value="never"
        :checked="choice.mode === 'never'"
        @change="choice.mode = 'never'"
      />
      <span>
        {{ copy.expiryNever }}
        <small>{{ copy.expiryNeverHint }}</small>
      </span>
    </label>

    <p v-if="choice.mode === null" class="expiry__required">
      <i class="fa-solid fa-circle-info"></i>
      {{ copy.expiryRequired }}
    </p>
  </fieldset>
</template>

<style scoped lang="scss">
.expiry {
  @include flex(column, stretch, flex-start, 0.6rem);
  border: none;
  min-width: 0;

  &__legend {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
    margin-bottom: 0.5rem;
  }

  &__date {
    padding-left: 0.5rem;
    border-left: 2px solid $accent;
    margin-left: 0.5rem;
  }

  &__required {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>
