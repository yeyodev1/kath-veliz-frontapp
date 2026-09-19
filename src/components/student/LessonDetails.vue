<script setup lang="ts">
import { studentCopy } from '@/config/student'
import type { LearnLesson } from '@/types/student'

defineProps<{
  lesson: LearnLesson
  hasNext: boolean
  marking: boolean
}>()

defineEmits<{ complete: []; next: [] }>()

const copy = studentCopy.learn
</script>

<template>
  <section class="lesson">
    <h1 class="lesson__title">{{ lesson.title }}</h1>

    <div class="lesson__actions">
      <button
        class="btn"
        :class="lesson.completed ? 'lesson__done' : 'btn--ghost'"
        type="button"
        :disabled="lesson.completed || marking"
        @click="$emit('complete')"
      >
        <i
          class="fa-solid"
          :class="
            marking ? 'fa-spinner fa-spin' : lesson.completed ? 'fa-circle-check' : 'fa-check'
          "
          aria-hidden="true"
        ></i>
        {{ lesson.completed ? copy.done : copy.markDone }}
      </button>

      <button v-if="hasNext" class="btn btn--primary" type="button" @click="$emit('next')">
        {{ copy.next }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>

    <p v-if="!hasNext && lesson.completed" class="lesson__finished">
      <i class="fa-solid fa-trophy" aria-hidden="true"></i> {{ copy.finished }}
    </p>

    <p v-if="lesson.description" class="lesson__description">{{ lesson.description }}</p>

    <div v-if="lesson.attachments?.length" class="lesson__files">
      <h2 class="lesson__subtitle">{{ copy.attachments }}</h2>
      <ul class="lesson__list">
        <li v-for="file in lesson.attachments" :key="file.url">
          <a class="lesson__file" :href="file.url" target="_blank" rel="noopener" download>
            <i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>
            <span>{{ file.name }}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.lesson {
  @include flex(column, stretch, flex-start, 1rem);

  &__title {
    @include display($text-xl, 600);
    line-height: 1.2;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .btn {
      padding-inline: 1.3rem;
    }
  }

  // "Clase vista" es un estado, no una acción: se ve resuelto aunque esté deshabilitado.
  &__done {
    color: $success;
    background: $success-bg;

    &:disabled {
      opacity: 1;
    }
  }

  &__finished {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    background: $success-bg;

    i {
      color: $success;
    }
  }

  &__description {
    color: $ink-soft;
    // La descripción llega como texto plano con saltos de línea.
    white-space: pre-line;
  }

  &__subtitle {
    @include eyebrow;
    margin-bottom: 0.6rem;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.5rem);
    list-style: none;
  }

  &__file {
    @include flex(row, center, flex-start, 0.7rem);
    padding: 0.8rem 0.95rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-weight: 500;
    background: $surface;
    @include transition(border-color);

    i {
      color: $accent;
    }

    span {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    &:hover {
      border-color: $accent;
    }
  }
}
</style>
