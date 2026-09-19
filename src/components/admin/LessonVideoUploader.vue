<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useVideoUpload } from '@/composables/admin/useVideoUpload'
import { adminCopy } from '@/config/admin'
import { formatDuration } from '@/utils/adminFormat'

const props = defineProps<{
  lessonId: string
  title: string
  hasVideo: boolean
  durationSeconds: number
}>()
const emit = defineEmits<{ ready: [durationSeconds: number]; uploading: [active: boolean] }>()

const copy = adminCopy.content
const { phase, progress, message, fileName, start, pause, resume, checkExisting } = useVideoUpload(
  () => props.lessonId,
  (duration) => emit('ready', duration),
)

const busy = computed(() => ['preparing', 'uploading', 'paused', 'processing'].includes(phase.value))

// Quien contiene este componente no debe cerrarse a mitad de una subida.
watch(phase, (next) => emit('uploading', next === 'preparing' || next === 'uploading'))

function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (file) start(file, props.title)
}

onMounted(() => {
  if (props.hasVideo) checkExisting()
})
</script>

<template>
  <div class="video">
    <span class="video__label">Video de la lección</span>

    <p v-if="phase === 'ready'" class="video__status video__status--ok">
      <i class="fa-solid fa-circle-check"></i>
      {{ copy.videoReady }}
      <template v-if="durationSeconds">· {{ formatDuration(durationSeconds) }}</template>
    </p>

    <div v-if="phase === 'preparing'" class="video__status">
      <i class="fa-solid fa-spinner fa-spin"></i>
      Preparando la subida…
    </div>

    <div v-if="phase === 'uploading' || phase === 'paused'" class="video__upload">
      <p class="video__file">{{ fileName }}</p>
      <div class="adm-progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
        <div class="adm-progress__bar" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="video__row">
        <strong>{{ phase === 'paused' ? 'En pausa' : 'Subiendo' }} · {{ progress }}%</strong>
        <button v-if="phase === 'uploading'" type="button" class="btn btn--ghost adm-btn-sm" @click="pause">
          <i class="fa-solid fa-pause"></i>
          Pausar
        </button>
        <button v-else type="button" class="btn btn--primary adm-btn-sm" @click="resume">
          <i class="fa-solid fa-play"></i>
          Continuar
        </button>
      </div>
      <p class="adm-field__hint">{{ copy.videoKeepOpen }}</p>
    </div>

    <div v-if="phase === 'processing'" class="video__status">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>
        <strong>{{ copy.videoProcessing }}</strong>
        <small>{{ copy.videoProcessingHint }}</small>
      </span>
    </div>

    <div v-if="phase === 'error'" class="video__status video__status--error" role="alert">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span>{{ message }}</span>
    </div>
    <p v-else-if="message" class="adm-field__hint">{{ message }}</p>

    <div v-if="!busy" class="adm-actions">
      <button v-if="phase === 'error'" type="button" class="btn btn--primary adm-btn-sm" @click="resume">
        <i class="fa-solid fa-rotate-right"></i>
        Continuar
      </button>
      <label class="btn btn--ghost adm-btn-sm video__pick">
        <i class="fa-solid fa-arrow-up-from-bracket"></i>
        {{ phase === 'ready' || hasVideo ? 'Reemplazar video' : 'Subir video' }}
        <input type="file" accept="video/*" class="visually-hidden" @change="onPick" />
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
.video {
  @include flex(column, stretch, flex-start, 0.7rem);
  padding: 0.9rem;
  border-radius: $radius-sm;
  background: $sand;

  &__label {
    font-size: 0.82rem;
    font-weight: 600;
    color: $ink-soft;
  }

  &__status {
    @include flex(row, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;
    color: $ink;

    i {
      margin-top: 0.2rem;
    }

    small {
      display: block;
      font-size: $text-xs;
      color: $ink-muted;
    }

    &--ok {
      color: darken($success, 15);
      font-weight: 600;
    }

    &--error {
      color: $danger;
    }
  }

  &__upload {
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__file {
    font-size: $text-xs;
    color: $ink-muted;
    overflow-wrap: anywhere;
  }

  &__row {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
    font-size: $text-sm;
  }

  &__pick {
    position: relative;
    margin: 0;
    cursor: pointer;
    color: $ink;
  }
}
</style>
