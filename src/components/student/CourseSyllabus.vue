<script setup lang="ts">
import { ref, watch } from 'vue'
import { studentCopy } from '@/config/student'
import { formatDuration } from '@/utils/learnFormat'
import type { LearnModule } from '@/types/student'

const props = defineProps<{
  modules: LearnModule[]
  currentLessonId: string
  currentModuleId: string
}>()

defineEmits<{ select: [lessonId: string] }>()

const copy = studentCopy.learn
const open = ref<Set<string>>(new Set())

// El módulo de la clase actual siempre queda abierto; los demás, como los dejó la alumna.
watch(
  () => props.currentModuleId,
  (id) => {
    if (id) open.value = new Set(open.value).add(id)
  },
  { immediate: true },
)

function toggle(id: string) {
  const next = new Set(open.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  open.value = next
}

function doneCount(module: LearnModule): number {
  return module.lessons.filter((l) => l.completed).length
}
</script>

<template>
  <nav class="syllabus" :aria-label="copy.syllabus">
    <h2 class="syllabus__heading">{{ copy.syllabus }}</h2>

    <div v-for="(module, index) in modules" :key="module.id" class="syllabus__module">
      <button
        class="syllabus__toggle"
        type="button"
        :aria-expanded="open.has(module.id)"
        :aria-controls="`module-${module.id}`"
        @click="toggle(module.id)"
      >
        <span class="syllabus__number">{{ index + 1 }}</span>
        <span class="syllabus__name">{{ module.title }}</span>
        <span class="syllabus__count">{{
          copy.lessonsCount(doneCount(module), module.lessons.length)
        }}</span>
        <i
          class="fa-solid fa-chevron-down syllabus__chevron"
          :class="{ 'syllabus__chevron--open': open.has(module.id) }"
          aria-hidden="true"
        ></i>
      </button>

      <ol v-show="open.has(module.id)" :id="`module-${module.id}`" class="syllabus__lessons">
        <li v-for="lesson in module.lessons" :key="lesson.id">
          <button
            class="syllabus__lesson"
            :class="{ 'syllabus__lesson--current': lesson.id === currentLessonId }"
            type="button"
            :aria-current="lesson.id === currentLessonId ? 'true' : undefined"
            @click="$emit('select', lesson.id)"
          >
            <i
              class="syllabus__check"
              :class="
                lesson.completed
                  ? 'fa-solid fa-circle-check syllabus__check--done'
                  : lesson.id === currentLessonId
                    ? 'fa-solid fa-circle-play'
                    : 'fa-regular fa-circle'
              "
              aria-hidden="true"
            ></i>
            <span class="syllabus__title">
              {{ lesson.title }}
              <span v-if="lesson.completed" class="visually-hidden">({{ copy.done }})</span>
            </span>
            <span v-if="lesson.durationSeconds" class="syllabus__duration">
              {{ formatDuration(lesson.durationSeconds) }}
            </span>
          </button>
        </li>
      </ol>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.syllabus {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__heading {
    @include eyebrow;
    margin-bottom: 0.2rem;
  }

  &__module {
    @include card;
    overflow: hidden;
  }

  &__toggle {
    @include flex(row, center, flex-start, 0.7rem);
    width: 100%;
    min-height: 3.25rem;
    padding: 0.8rem 0.95rem;
    text-align: left;
  }

  &__number {
    @include flex(row, center, center);
    flex: 0 0 1.6rem;
    height: 1.6rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    color: $accent-deep;
    background: $accent-soft;
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;
  }

  &__count {
    font-size: $text-xs;
    color: $ink-muted;
    font-variant-numeric: tabular-nums;
  }

  &__chevron {
    font-size: 0.7rem;
    color: $ink-muted;
    @include transition(transform);

    &--open {
      transform: rotate(180deg);
    }
  }

  &__lessons {
    @include flex(column, stretch, flex-start);
    list-style: none;
    border-top: 1px solid $line;
  }

  &__lesson {
    @include flex(row, flex-start, flex-start, 0.7rem);
    width: 100%;
    min-height: 2.9rem;
    padding: 0.75rem 0.95rem;
    text-align: left;
    font-size: $text-sm;
    line-height: 1.35;
    color: $ink-soft;
    @include transition(background-color);

    &:hover {
      background: $sand;
    }

    &--current {
      font-weight: 600;
      color: $ink;
      background: $accent-soft;

      &:hover {
        background: $accent-soft;
      }
    }
  }

  &__check {
    flex: 0 0 auto;
    margin-top: 0.15rem;
    color: $ink-muted;

    &--done {
      color: $success;
    }
  }

  &__lesson--current &__check:not(&__check--done) {
    color: $accent;
  }

  &__title {
    flex: 1;
    min-width: 0;
  }

  &__duration {
    flex: 0 0 auto;
    font-size: $text-xs;
    font-weight: 400;
    color: $ink-muted;
    font-variant-numeric: tabular-nums;
  }
}
</style>
