<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useLessonPlayer } from '@/composables/useLessonPlayer'
import { studentCopy } from '@/config/student'

const props = defineProps<{
  lessonId: string
  title: string
  canResume?: (lessonId: string, seconds: number) => boolean
}>()

const emit = defineEmits<{
  completed: [lessonId: string]
  position: [lessonId: string, seconds: number]
}>()

const copy = studentCopy.learn
const iframe = ref<HTMLIFrameElement | null>(null)

const { embedUrl, loading, error, reload } = useLessonPlayer({
  lessonId: toRef(props, 'lessonId'),
  iframe,
  onCompleted: (id) => emit('completed', id),
  onPosition: (id, seconds) => emit('position', id, seconds),
  canResume: (id, seconds) => props.canResume?.(id, seconds) ?? true,
})
</script>

<template>
  <div class="player">
    <!-- :key por clase: un iframe nuevo cada vez, así player.js nunca queda atado al video anterior. -->
    <iframe
      v-if="embedUrl"
      :key="lessonId"
      ref="iframe"
      class="player__frame"
      :src="embedUrl"
      :title="title"
      loading="lazy"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
    ></iframe>

    <div v-else class="player__state" role="status" aria-live="polite">
      <template v-if="error">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <p>{{ error || copy.videoError }}</p>
        <button class="btn btn--primary" type="button" @click="reload">{{ copy.retry }}</button>
      </template>
      <template v-else-if="loading">
        <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
        <p>{{ copy.videoLoading }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: $ink;

  @include from('md') {
    border-radius: $radius-md;
  }

  &__frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  &__state {
    position: absolute;
    inset: 0;
    @include flex(column, center, center, 0.75rem);
    padding: 1rem;
    text-align: center;
    font-size: $text-sm;
    color: $surface;

    i {
      font-size: 1.5rem;
    }
  }
}
</style>
