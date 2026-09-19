<script setup lang="ts">
import { nextTick, ref } from 'vue'

// Lista editable de textos cortos (qué vas a recibir, para quién es, opciones…).
const items = defineModel<string[]>({ required: true })
defineProps<{ label: string; hint?: string; placeholder?: string; addLabel?: string }>()

const root = ref<HTMLElement | null>(null)

async function add() {
  items.value.push('')
  await nextTick()
  const inputs = root.value?.querySelectorAll('input')
  inputs?.[inputs.length - 1]?.focus()
}
</script>

<template>
  <div ref="root" class="string-list">
    <span class="string-list__label">{{ label }}</span>
    <p v-if="hint" class="adm-field__hint string-list__hint">{{ hint }}</p>

    <div v-for="(_, index) in items" :key="index" class="string-list__item">
      <input
        v-model="items[index]"
        type="text"
        :placeholder="placeholder"
        :aria-label="`${label} ${index + 1}`"
        @keydown.enter.prevent="add"
      />
      <button
        type="button"
        class="adm-icon-btn adm-icon-btn--danger"
        :aria-label="`Quitar ${index + 1}`"
        @click="items.splice(index, 1)"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <button type="button" class="btn btn--ghost adm-btn-sm string-list__add" @click="add">
      <i class="fa-solid fa-plus"></i>
      {{ addLabel || 'Agregar' }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.string-list {
  @include flex(column, stretch, flex-start, 0.5rem);
  min-width: 0;

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
  }

  &__hint {
    margin-top: -0.3rem;
  }

  &__item {
    @include flex(row, center, flex-start, 0.5rem);

    input {
      flex: 1;
      min-width: 0;
    }
  }

  &__add {
    align-self: flex-start;
  }
}
</style>
