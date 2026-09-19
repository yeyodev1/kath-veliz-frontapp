<script setup lang="ts">
import { ref, watch } from 'vue'
import AdminSheet from './AdminSheet.vue'
import LessonVideoUploader from './LessonVideoUploader.vue'
import LessonAttachments from './LessonAttachments.vue'
import { useToastStore } from '@/stores/toast'
import type { LessonFormState } from '@/composables/admin/useProductContent'

// `form` es el estado reactivo de useProductContent: los campos escriben directo en él.
const props = defineProps<{ form: LessonFormState; saving: boolean }>()
const emit = defineEmits<{ close: []; save: []; videoReady: [durationSeconds: number] }>()

const toast = useToastStore()
const uploading = ref(false)

// Al cerrarse la hoja el cargador se desmonta y ya no avisa: se limpia a mano.
watch(
  () => props.form.open,
  (open) => {
    if (!open) uploading.value = false
  },
)

// Un toque fuera de la hoja no debe tumbar una subida de varios minutos.
function close() {
  if (uploading.value) toast.info('El video se está subiendo. Espera a que termine o ponlo en pausa.')
  else emit('close')
}
</script>

<template>
  <AdminSheet :open="form.open" :title="form.id ? 'Editar lección' : 'Nueva lección'" @close="close">
    <form id="lesson-form" class="adm-form" @submit.prevent="emit('save')">
      <div class="adm-field">
        <label for="lesson-title">Título de la lección</label>
        <input id="lesson-title" v-model="form.title" type="text" required />
      </div>

      <div class="adm-field">
        <label for="lesson-description">Descripción (opcional)</label>
        <textarea id="lesson-description" v-model="form.description" rows="3"></textarea>
      </div>

      <!-- `key` reinicia el cargador al cambiar de lección -->
      <LessonVideoUploader
        v-if="form.id"
        :key="form.id"
        :lesson-id="form.id"
        :title="form.title"
        :has-video="Boolean(form.bunnyVideoId)"
        :duration-seconds="form.durationSeconds"
        @ready="emit('videoReady', $event)"
        @uploading="uploading = $event"
      />
      <p v-else class="lesson__pending">
        <i class="fa-solid fa-circle-info"></i>
        Primero guarda la lección; enseguida vas a poder subir el video aquí mismo.
      </p>

      <LessonAttachments v-model="form.attachments" />

      <label class="adm-check">
        <input v-model="form.isPublished" type="checkbox" />
        <span>
          Publicada
          <small>Si la desmarcas, los alumnos no la ven.</small>
        </span>
      </label>

      <label class="adm-check">
        <input v-model="form.isFreePreview" type="checkbox" />
        <span>
          Vista previa gratis
          <small>Cualquiera puede verla sin comprar, desde la página del curso.</small>
        </span>
      </label>
    </form>

    <template #footer>
      <button type="button" class="btn btn--ghost" @click="close">Cerrar</button>
      <button type="submit" form="lesson-form" class="btn btn--primary" :disabled="saving || uploading || !form.title.trim()">
        {{ saving ? 'Guardando…' : form.id ? 'Guardar lección' : 'Crear lección' }}
      </button>
    </template>
  </AdminSheet>
</template>

<style scoped lang="scss">
.lesson__pending {
  @include flex(row, flex-start, flex-start, 0.6rem);
  padding: 0.9rem;
  border-radius: $radius-sm;
  background: $sand;
  font-size: $text-sm;
  color: $ink-soft;

  i {
    margin-top: 0.25rem;
  }
}
</style>
