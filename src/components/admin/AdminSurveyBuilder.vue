<script setup lang="ts">
import AdminStringList from './AdminStringList.vue'
import { surveyTypeLabels } from '@/config/admin'
import type { SurveyQuestion } from '@/types/admin'

// Constructor simple de la encuesta de asesoría: qué se pregunta, cómo se
// responde y si es obligatoria.
const questions = defineModel<SurveyQuestion[]>({ required: true })

function move(index: number, step: number) {
  const target = index + step
  if (target < 0 || target >= questions.value.length) return
  const [item] = questions.value.splice(index, 1)
  if (item) questions.value.splice(target, 0, item)
}
</script>

<template>
  <div class="survey">
    <span class="survey__label">Preguntas de la encuesta</span>
    <p class="adm-field__hint survey__hint">
      El nombre, el correo y el teléfono ya se piden siempre: aquí van solo tus preguntas.
    </p>

    <div v-for="(question, index) in questions" :key="index" class="survey__item">
      <div class="survey__head">
        <strong>Pregunta {{ index + 1 }}</strong>
        <div class="survey__tools">
          <button
            type="button"
            class="adm-icon-btn"
            :disabled="index === 0"
            aria-label="Subir pregunta"
            @click="move(index, -1)"
          >
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button
            type="button"
            class="adm-icon-btn"
            :disabled="index === questions.length - 1"
            aria-label="Bajar pregunta"
            @click="move(index, 1)"
          >
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <button
            type="button"
            class="adm-icon-btn adm-icon-btn--danger"
            aria-label="Quitar pregunta"
            @click="questions.splice(index, 1)"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <input
        v-model="question.label"
        type="text"
        placeholder="Ej.: ¿Cuál es tu meta financiera este año?"
        :aria-label="`Texto de la pregunta ${index + 1}`"
      />

      <select v-model="question.type" :aria-label="`Tipo de respuesta ${index + 1}`">
        <option v-for="(label, value) in surveyTypeLabels" :key="value" :value="value">
          {{ label }}
        </option>
      </select>

      <AdminStringList
        v-if="question.type === 'select'"
        v-model="question.options"
        label="Opciones"
        placeholder="Una opción"
        add-label="Agregar opción"
      />

      <label class="adm-check">
        <input v-model="question.required" type="checkbox" />
        <span>Es obligatoria</span>
      </label>
    </div>

    <button
      type="button"
      class="btn btn--ghost adm-btn-sm survey__add"
      @click="questions.push({ label: '', type: 'text', options: [], required: true })"
    >
      <i class="fa-solid fa-plus"></i>
      Agregar pregunta
    </button>
  </div>
</template>

<style scoped lang="scss">
.survey {
  @include flex(column, stretch, flex-start, 0.6rem);
  min-width: 0;

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
  }

  &__hint {
    margin-top: -0.4rem;
  }

  &__item {
    @include flex(column, stretch, flex-start, 0.6rem);
    padding: 0.8rem;
    border-radius: $radius-sm;
    background: $sand;
  }

  &__head {
    @include flex(row, center, space-between, 0.5rem);
    font-size: $text-sm;
  }

  &__tools {
    @include flex(row, center, flex-end, 0.35rem);
  }

  &__add {
    align-self: flex-start;
  }
}
</style>
