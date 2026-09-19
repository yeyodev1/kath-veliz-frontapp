<script setup lang="ts">
import { site } from '@/config/site'
import { formatDuration } from '@/utils/format'
import BaseAccordion from '@/components/ui/BaseAccordion.vue'
import { vReveal } from '@/composables/useReveal'
import type { LessonPreview, ProductModule } from '@/types/catalog'

defineProps<{ modules: ProductModule[] }>()
const emit = defineEmits<{ preview: [lesson: LessonPreview] }>()

const labels = site.product

function moduleMeta(module: ProductModule): string {
  const count = module.lessons.length
  if (!count) return ''
  const seconds = module.lessons.reduce((sum, l) => sum + (l.durationSeconds || 0), 0)
  const word = count === 1 ? labels.meta.lesson : labels.meta.lessons
  return seconds ? `${count} ${word} · ${formatDuration(seconds, true)}` : `${count} ${word}`
}
</script>

<template>
  <section v-reveal class="syllabus">
    <h2 class="syllabus__title">{{ labels.sections.syllabus }}</h2>

    <div class="syllabus__modules">
      <BaseAccordion
        v-for="(module, i) in modules"
        :key="module.id || module.title"
        :title="module.title"
        :meta="moduleMeta(module)"
        :index="String(i + 1).padStart(2, '0')"
        :start-open="i === 0"
      >
        <p v-if="module.description" class="syllabus__description">{{ module.description }}</p>
        <ol class="syllabus__lessons">
          <li v-for="lesson in module.lessons" :key="lesson.id" class="lesson">
            <i
              :class="lesson.isFreePreview ? 'fa-solid fa-circle-play' : 'fa-solid fa-lock'"
              class="lesson__icon"
              aria-hidden="true"
            ></i>
            <span class="lesson__title">{{ lesson.title }}</span>
            <button
              v-if="lesson.isFreePreview"
              type="button"
              class="lesson__preview"
              @click="emit('preview', lesson)"
            >
              {{ labels.meta.preview }}
            </button>
            <span v-if="lesson.durationSeconds" class="lesson__time">
              {{ formatDuration(lesson.durationSeconds) }}
            </span>
          </li>
        </ol>
      </BaseAccordion>
    </div>
  </section>
</template>

<style scoped lang="scss">
.syllabus {
  &__title {
    @include display($display-sm);
    margin-bottom: 1.4rem;
  }

  &__description {
    font-size: $text-sm;
    color: $ink-soft;
    margin-bottom: 0.9rem;
    white-space: pre-line;
  }

  &__lessons {
    @include flex(column, stretch, flex-start);
    list-style: none;
  }
}

.lesson {
  @include flex(row, center, flex-start, 0.4rem 0.8rem);
  flex-wrap: wrap;
  padding: 0.7rem 0;
  font-size: $text-sm;
  border-top: 1px dashed $line;

  &__icon {
    width: 1rem;
    font-size: 0.8rem;
    color: $ink-muted;

    &.fa-circle-play {
      font-size: 0.95rem;
      color: $clay;
    }
  }

  &__title {
    flex: 1 1 160px;
  }

  &__preview {
    font-size: $text-xs;
    font-weight: 600;
    color: $clay-deep;
    padding: 0.35rem 0.75rem;
    border: 1px solid currentColor;
    border-radius: $radius-pill;
    @include transition;

    &:hover {
      background: $clay-deep;
      border-color: $clay-deep;
      color: $paper;
    }
  }

  &__time {
    font-variant-numeric: tabular-nums;
    color: $ink-muted;
    min-width: 3rem;
    text-align: right;
  }
}
</style>
