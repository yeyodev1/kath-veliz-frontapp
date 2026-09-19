<script setup lang="ts">
import AdminSheet from './AdminSheet.vue'

interface LiveFormState {
  open: boolean
  id: string
  title: string
  description: string
  startsAt: string
  meetUrl: string
  recordingLesson: string
}

// `form` es el estado reactivo del composable: los campos escriben directo en él.
defineProps<{
  form: LiveFormState
  lessons: { id: string; label: string }[]
  saving: boolean
  canSave: boolean
}>()
const emit = defineEmits<{ close: []; save: [] }>()
</script>

<template>
  <AdminSheet
    :open="form.open"
    :title="form.id ? 'Editar clase en vivo' : 'Nueva clase en vivo'"
    @close="emit('close')"
  >
    <form id="live-form" class="adm-form" @submit.prevent="emit('save')">
      <div class="adm-field">
        <label for="live-title">Título de la clase</label>
        <input
          id="live-title"
          v-model="form.title"
          type="text"
          placeholder="Ej.: Clase 1 — Tu presupuesto"
          required
        />
      </div>

      <div class="adm-field">
        <label for="live-starts">Fecha y hora</label>
        <input id="live-starts" v-model="form.startsAt" type="datetime-local" required />
        <p class="adm-field__hint">Hora de Ecuador.</p>
      </div>

      <div class="adm-field">
        <label for="live-meet">Enlace de Google Meet</label>
        <input
          id="live-meet"
          v-model="form.meetUrl"
          type="url"
          inputmode="url"
          autocapitalize="none"
          placeholder="https://meet.google.com/…"
          required
        />
      </div>

      <div class="adm-field">
        <label for="live-description">Descripción (opcional)</label>
        <textarea id="live-description" v-model="form.description" rows="3"></textarea>
      </div>

      <div class="adm-field">
        <label for="live-recording">Grabación (opcional)</label>
        <select id="live-recording" v-model="form.recordingLesson">
          <option value="">Todavía no hay grabación</option>
          <option v-for="lesson in lessons" :key="lesson.id" :value="lesson.id">
            {{ lesson.label }}
          </option>
        </select>
        <p class="adm-field__hint">
          Después de la clase, sube la grabación como una lección del curso y elígela aquí.
        </p>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn--ghost" @click="emit('close')">Cancelar</button>
      <button type="submit" form="live-form" class="btn btn--primary" :disabled="!canSave">
        {{ saving ? 'Guardando…' : 'Guardar clase' }}
      </button>
    </template>
  </AdminSheet>
</template>
