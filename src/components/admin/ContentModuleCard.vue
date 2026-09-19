<script setup lang="ts">
import AdminBadge from './AdminBadge.vue'
import { adminCopy } from '@/config/admin'
import { formatDuration } from '@/utils/adminFormat'
import type { AdminLesson, AdminModule } from '@/types/admin'

defineProps<{ module: AdminModule; index: number; total: number; busy: boolean }>()
const emit = defineEmits<{
  move: [step: number]
  edit: []
  remove: []
  addLesson: []
  editLesson: [lesson: AdminLesson]
  removeLesson: [lesson: AdminLesson]
  moveLesson: [index: number, step: number]
}>()
</script>

<template>
  <article class="module">
    <header class="module__head">
      <div class="module__title">
        <span class="module__number">Módulo {{ index + 1 }}</span>
        <h3>{{ module.title }}</h3>
      </div>
      <div class="module__tools">
        <button
          class="adm-icon-btn"
          :disabled="busy || index === 0"
          aria-label="Subir módulo"
          @click="emit('move', -1)"
        >
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button
          class="adm-icon-btn"
          :disabled="busy || index === total - 1"
          aria-label="Bajar módulo"
          @click="emit('move', 1)"
        >
          <i class="fa-solid fa-arrow-down"></i>
        </button>
        <button class="adm-icon-btn" aria-label="Editar módulo" @click="emit('edit')">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button
          class="adm-icon-btn adm-icon-btn--danger"
          aria-label="Borrar módulo"
          @click="emit('remove')"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </header>

    <p v-if="!module.lessons.length" class="adm-muted">{{ adminCopy.content.emptyLessons }}</p>

    <ul class="module__lessons">
      <li v-for="(lesson, lessonIndex) in module.lessons" :key="lesson.id" class="module__lesson">
        <button class="module__lesson-main" @click="emit('editLesson', lesson)">
          <strong>{{ lessonIndex + 1 }}. {{ lesson.title }}</strong>
          <span class="module__badges">
            <AdminBadge v-if="lesson.bunnyVideoId" tone="success" icon="fa-solid fa-video">
              {{ formatDuration(lesson.durationSeconds) || 'Video' }}
            </AdminBadge>
            <AdminBadge v-else tone="warning">{{ adminCopy.content.videoNone }}</AdminBadge>
            <AdminBadge v-if="!lesson.isPublished" tone="neutral">Borrador</AdminBadge>
            <AdminBadge v-if="lesson.isFreePreview" tone="info">Vista previa gratis</AdminBadge>
            <AdminBadge
              v-if="lesson.attachments?.length"
              tone="neutral"
              icon="fa-solid fa-paperclip"
            >
              {{ lesson.attachments.length }}
            </AdminBadge>
          </span>
        </button>
        <div class="module__tools">
          <button
            class="adm-icon-btn"
            :disabled="busy || lessonIndex === 0"
            aria-label="Subir lección"
            @click="emit('moveLesson', lessonIndex, -1)"
          >
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button
            class="adm-icon-btn"
            :disabled="busy || lessonIndex === module.lessons.length - 1"
            aria-label="Bajar lección"
            @click="emit('moveLesson', lessonIndex, 1)"
          >
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <button
            class="adm-icon-btn adm-icon-btn--danger"
            aria-label="Borrar lección"
            @click="emit('removeLesson', lesson)"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>
    </ul>

    <button class="btn btn--ghost adm-btn-sm module__add" @click="emit('addLesson')">
      <i class="fa-solid fa-plus"></i>
      Agregar lección
    </button>
  </article>
</template>

<style scoped lang="scss">
.module {
  @include card;
  @include flex(column, stretch, flex-start, 0.85rem);
  padding: 1rem;

  &__head {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
  }

  &__title {
    flex: 1 1 180px;
    min-width: 0;

    h3 {
      font-family: $font-principal;
      font-size: $text-base;
      font-weight: 700;
      overflow-wrap: anywhere;
    }
  }

  &__number {
    @include eyebrow;
  }

  &__tools {
    @include flex(row, center, flex-end, 0.35rem);
  }

  &__lessons {
    @include flex(column, stretch, flex-start, 0.5rem);
    list-style: none;
  }

  &__lesson {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
    padding: 0.6rem 0.7rem;
    border-radius: $radius-sm;
    background: $paper;
    border: 1px solid $line;
  }

  &__lesson-main {
    @include flex(column, flex-start, center, 0.4rem);
    flex: 1 1 200px;
    min-width: 0;
    min-height: 44px;
    text-align: left;
    font-size: $text-sm;

    strong {
      overflow-wrap: anywhere;
    }
  }

  &__badges {
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
  }

  &__add {
    align-self: flex-start;
  }
}
</style>
