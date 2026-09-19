<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { site } from '@/config/site'
import { productService } from '@/services/product.service'
import { useBodyScroll } from '@/composables/useBodyScroll'
import type { LessonPreview } from '@/types/catalog'
import type { ApiError } from '@/types'

// Reproduce una lección con vista previa gratuita. La URL del video nunca
// viene en el producto: se pide a /lessons/:id/playback al abrir.
const props = defineProps<{ lesson: LessonPreview | null }>()
const emit = defineEmits<{ close: [] }>()

const open = computed(() => Boolean(props.lesson))
const embedUrl = ref('')
const error = ref('')
const closeButton = ref<HTMLButtonElement | null>(null)
const labels = site.product.meta

useBodyScroll(open)

watch(
  () => props.lesson,
  async (lesson) => {
    embedUrl.value = ''
    error.value = ''
    if (!lesson) return
    await nextTick()
    closeButton.value?.focus()
    try {
      const playback = await productService.playback(lesson.id)
      if (props.lesson?.id === lesson.id) embedUrl.value = playback.embedUrl
    } catch (e) {
      error.value = (e as ApiError).message || labels.previewError
    }
  },
)

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) emit('close')
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="lesson" class="preview" @click.self="emit('close')">
        <div class="preview__box" role="dialog" aria-modal="true" :aria-label="lesson.title">
          <div class="preview__top">
            <p>
              <span class="preview__eyebrow">{{ labels.previewTitle }}</span>
              <strong>{{ lesson.title }}</strong>
            </p>
            <button
              ref="closeButton"
              type="button"
              class="preview__close"
              :aria-label="labels.close"
              @click="emit('close')"
            >
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <div class="preview__frame">
            <iframe
              v-if="embedUrl"
              :src="embedUrl"
              :title="lesson.title"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowfullscreen
            ></iframe>
            <p v-else-if="error" class="preview__state" role="alert">{{ error }}</p>
            <p v-else class="preview__state">
              <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.preview {
  position: fixed;
  inset: 0;
  z-index: 200;
  @include flex(row, center, center);
  padding: 1rem;
  background: $overlay;

  &__box {
    width: 100%;
    max-width: 880px;
    background: $ink;
    color: $paper;
    border-radius: $radius-md;
    overflow: hidden;
    box-shadow: $shadow-lg;
  }

  &__top {
    @include flex(row, center, space-between, 1rem);
    padding: 0.7rem 0.7rem 0.7rem 1.2rem;

    p {
      @include flex(column, flex-start, flex-start);
      font-size: $text-sm;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $butter;
  }

  &__close {
    width: 2.75rem;
    height: 2.75rem;
    font-size: 1.2rem;
    border-radius: $radius-sm;
    @include focus-ring($butter);
  }

  &__frame {
    position: relative;
    aspect-ratio: 16 / 9;
    background: #000;

    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  &__state {
    @include flex(row, center, center);
    height: 100%;
    padding: 1rem;
    text-align: center;
    font-size: $text-sm;
  }
}
</style>
