<script setup lang="ts">
import { adminUploadsService } from '@/services/adminUploads.service'
import { useFileUpload } from '@/composables/admin/useFileUpload'
import type { UploadedImage } from '@/types/admin'

const image = defineModel<UploadedImage | null>({ required: true })
defineProps<{ label: string; hint?: string }>()

const { uploading, progress, upload } = useFileUpload((file, onProgress) =>
  adminUploadsService.image(file, onProgress),
)

async function onPick(event: Event) {
  const result = await upload(event, 10)
  if (result) image.value = result
}
</script>

<template>
  <div class="image-upload">
    <span class="image-upload__label">{{ label }}</span>

    <div class="image-upload__row">
      <div class="image-upload__preview">
        <img v-if="image" :src="image.url" alt="Vista previa de la portada" />
        <i v-else class="fa-regular fa-image"></i>
      </div>

      <div class="image-upload__side">
        <label class="btn btn--ghost adm-btn-sm image-upload__pick" :class="{ 'image-upload__pick--busy': uploading }">
          <i class="fa-solid fa-arrow-up-from-bracket"></i>
          {{ image ? 'Cambiar imagen' : 'Subir imagen' }}
          <input type="file" accept="image/*" class="visually-hidden" :disabled="uploading" @change="onPick" />
        </label>
        <button v-if="image && !uploading" type="button" class="image-upload__remove" @click="image = null">
          Quitar
        </button>
        <p v-if="hint" class="adm-field__hint">{{ hint }}</p>
      </div>
    </div>

    <div v-if="uploading" class="adm-progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
      <div class="adm-progress__bar" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-upload {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
  }

  &__row {
    @include flex(row, center, flex-start, 1rem);
    flex-wrap: wrap;
  }

  &__preview {
    @include flex(row, center, center);
    flex: 0 0 140px;
    width: 140px;
    aspect-ratio: 4 / 3;
    border-radius: $radius-sm;
    border: 1px dashed $line;
    background: $sand;
    color: $ink-muted;
    font-size: 1.6rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__side {
    @include flex(column, flex-start, flex-start, 0.3rem);
    flex: 1 1 150px;
  }

  &__pick {
    margin: 0;
    cursor: pointer;
    color: $ink;

    &--busy {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__remove {
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $danger;
  }
}
</style>
