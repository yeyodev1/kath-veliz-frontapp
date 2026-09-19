<script setup lang="ts">
import { adminUploadsService } from '@/services/adminUploads.service'
import { useFileUpload } from '@/composables/admin/useFileUpload'
import type { UploadedFile } from '@/types/admin'

// `private` = descargable de pago: el backend lo guarda autenticado y solo lo
// entrega con una URL firmada a quien tenga acceso.
const file = defineModel<UploadedFile | null>({ required: true })
const props = defineProps<{ label: string; hint?: string; accept?: string; private?: boolean }>()

const { uploading, progress, upload } = useFileUpload((picked, onProgress) =>
  adminUploadsService.file(picked, Boolean(props.private), onProgress),
)

async function onPick(event: Event) {
  const result = await upload(event, 100)
  if (result) file.value = result
}
</script>

<template>
  <div class="file-upload">
    <span class="file-upload__label">{{ label }}</span>

    <div v-if="file" class="file-upload__current">
      <i class="fa-solid fa-file-circle-check"></i>
      <span class="file-upload__name">{{ file.filename || 'Archivo subido' }}</span>
      <button
        type="button"
        class="adm-icon-btn adm-icon-btn--danger"
        aria-label="Quitar archivo"
        @click="file = null"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <label
      class="btn btn--ghost adm-btn-sm file-upload__pick"
      :class="{ 'file-upload__pick--busy': uploading }"
    >
      <i class="fa-solid fa-arrow-up-from-bracket"></i>
      {{ uploading ? `Subiendo… ${progress}%` : file ? 'Reemplazar archivo' : 'Subir archivo' }}
      <input
        type="file"
        :accept="accept"
        class="visually-hidden"
        :disabled="uploading"
        @change="onPick"
      />
    </label>

    <div
      v-if="uploading"
      class="adm-progress"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="adm-progress__bar" :style="{ width: `${progress}%` }"></div>
    </div>

    <p v-if="hint" class="adm-field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.file-upload {
  @include flex(column, stretch, flex-start, 0.6rem);
  min-width: 0;

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
  }

  &__current {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0.4rem 0.4rem 0.4rem 0.9rem;
    border-radius: $radius-sm;
    background: $success-bg;
    color: $ink;
    font-size: $text-sm;
  }

  &__name {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  &__pick {
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
