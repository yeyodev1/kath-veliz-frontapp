<script setup lang="ts">
import { computed, ref } from 'vue'

// Label, control y mensaje de error siempre juntos y enlazados por id:
// así ningún formulario se queda sin etiqueta ni sin aria-describedby.
const props = withDefaults(
  defineProps<{
    id: string
    label: string
    type?: string
    as?: 'input' | 'textarea' | 'select'
    options?: readonly string[]
    placeholder?: string
    autocomplete?: string
    inputmode?: 'text' | 'email' | 'tel' | 'numeric'
    required?: boolean
    disabled?: boolean
    error?: string
    hint?: string
    hideLabel?: boolean
  }>(),
  { type: 'text', as: 'input' },
)

const model = defineModel<string>({ default: '' })

const revealed = ref(false)
const isPassword = computed(() => props.type === 'password')
const inputType = computed(() => (isPassword.value && revealed.value ? 'text' : props.type))
const describedBy = computed(() =>
  props.error ? `${props.id}-error` : props.hint ? `${props.id}-hint` : undefined,
)
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label :for="id" :class="{ 'visually-hidden': hideLabel }">
      {{ label }}<span v-if="required" class="field__req" aria-hidden="true"> *</span>
    </label>

    <textarea
      v-if="as === 'textarea'"
      :id="id"
      v-model="model"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
    ></textarea>

    <select
      v-else-if="as === 'select'"
      :id="id"
      v-model="model"
      :required="required"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>

    <div v-else class="field__control">
      <input
        :id="id"
        v-model="model"
        :type="inputType"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :required="required"
        :disabled="disabled"
        :aria-invalid="Boolean(error)"
        :aria-describedby="describedBy"
      />
      <button
        v-if="isPassword"
        type="button"
        class="field__toggle"
        :aria-label="revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        :aria-pressed="revealed"
        @click="revealed = !revealed"
      >
        <i
          :class="revealed ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"
          aria-hidden="true"
        ></i>
      </button>
    </div>

    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start);
  width: 100%;

  &__req {
    color: $clay-deep;
  }

  &__control {
    position: relative;
    display: flex;
  }

  &__toggle {
    position: absolute;
    right: 0.2rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2.6rem;
    height: 2.6rem;
    color: $ink-muted;
    border-radius: $radius-sm;
    @include flex(row, center, center);

    &:hover {
      color: $ink;
    }
  }

  &__control input {
    // Deja sitio al ojo de la contraseña.
    padding-right: 2.8rem;
  }

  &--error {
    input,
    select,
    textarea {
      border-color: $danger;
    }
  }

  &__error,
  &__hint {
    font-size: $text-xs;
    margin-top: 0.35rem;
  }

  &__error {
    color: $danger;
  }

  &__hint {
    color: $ink-muted;
  }
}
</style>
