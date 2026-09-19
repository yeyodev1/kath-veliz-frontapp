<script setup lang="ts">
import { adminUploadsService } from '@/services/adminUploads.service'
import { useFileUpload } from '@/composables/admin/useFileUpload'
import type { LessonAttachment } from '@/types/admin'

// Material de apoyo de la lección (PDF, Excel…). Se guarda junto con la lección.
const attachments = defineModel<LessonAttachment[]>({ required: true })

const { uploading, progress, upload } = useFileUpload((file, onProgress) =>
  adminUploadsService.file(file, false, onProgress),
)

async function onPick(event: Event) {
  const result = await upload(event, 100)
  if (!result) return
  attachments.value.push({ name: result.filename || 'Archivo', url: result.url, publicId: result.publicId })
}
</script>

<template>
  <div class="attachments">
    <span class="attachments__label">Archivos adjuntos</span>

    <div v-for="(file, index) in attachments" :key="file.publicId || index" class="attachments__item">
      <i class="fa-solid fa-paperclip"></i>
      <input v-model="file.name" type="text" :aria-label="`Nombre del adjunto ${index + 1}`" />
      <button
        type="button"
        class="adm-icon-btn adm-icon-btn--danger"
        :aria-label="`Quitar adjunto ${index + 1}`"
        @click="attachments.splice(index, 1)"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <label class="btn btn--ghost adm-btn-sm attachments__pick" :class="{ 'attachments__pick--busy': uploading }">
      <i class="fa-solid fa-plus"></i>
      {{ uploading ? `Subiendo… ${progress}%` : 'Agregar archivo' }}
      <input type="file" class="visually-hidden" :disabled="uploading" @change="onPick" />
    </label>
    <p class="adm-field__hint">El nombre es lo que ve el alumno. Guarda la lección para conservar los cambios.</p>
  </div>
</template>

<style scoped lang="scss">
.attachments {
  @include flex(column, stretch, flex-start, 0.5rem);

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
  }

  &__item {
    @include flex(row, center, flex-start, 0.5rem);
    color: $ink-muted;

    input {
      flex: 1;
      min-width: 0;
    }
  }

  &__pick {
    position: relative;
    align-self: flex-start;
    margin: 0;
    cursor: pointer;
    color: $ink;

    &--busy {
      opacity: 0.6;
      pointer-events: none;
    }
  }
}
</style>
