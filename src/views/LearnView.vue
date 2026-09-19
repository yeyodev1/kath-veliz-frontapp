<script setup lang="ts">
import { onMounted } from 'vue'
import StateBlock from '@/components/student/StateBlock.vue'
import ProgressBar from '@/components/student/ProgressBar.vue'
import LessonPlayer from '@/components/student/LessonPlayer.vue'
import LessonDetails from '@/components/student/LessonDetails.vue'
import CourseSyllabus from '@/components/student/CourseSyllabus.vue'
import LiveSessions from '@/components/student/LiveSessions.vue'
import { useLearn } from '@/composables/useLearn'
import { useProductDownload } from '@/composables/useProductDownload'
import { studentCopy } from '@/config/student'

const copy = studentCopy.learn
const {
  slug,
  course,
  state,
  errorMessage,
  marking,
  lessons,
  completedCount,
  percent,
  currentLesson,
  currentLessonId,
  currentModuleId,
  nextLesson,
  load,
  setCompleted,
  setPosition,
  canResume,
  markCurrentCompleted,
  goToLesson,
  goNext,
} = useLearn()
const { downloadingSlug, download } = useProductDownload()

onMounted(load)
</script>

<template>
  <section class="learn">
    <StateBlock v-if="state === 'loading'" loading :text="copy.loading" />

    <StateBlock
      v-else-if="state === 'blocked'"
      icon="fa-lock"
      tone="warning"
      :title="copy.blockedTitle"
      :text="copy.blockedText"
    >
      <template #actions>
        <RouterLink class="btn btn--primary" :to="`/p/${slug}`">{{ copy.blockedCta }}</RouterLink>
        <RouterLink class="btn btn--ghost" to="/mis-cursos">{{ copy.back }}</RouterLink>
      </template>
    </StateBlock>

    <StateBlock
      v-else-if="state !== 'ready' || !course"
      icon="fa-triangle-exclamation"
      tone="danger"
      :title="state === 'notFound' ? copy.notFoundTitle : copy.errorTitle"
      :text="state === 'notFound' ? '' : errorMessage"
    >
      <template #actions>
        <button v-if="state === 'error'" class="btn btn--primary" type="button" @click="load">
          {{ copy.retry }}
        </button>
        <RouterLink class="btn btn--ghost" to="/mis-cursos">{{ copy.back }}</RouterLink>
      </template>
    </StateBlock>

    <template v-else>
      <header class="learn__head">
        <RouterLink class="learn__back" to="/mis-cursos">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ copy.back }}
        </RouterLink>
        <p class="learn__course">{{ course.product.title }}</p>
      </header>

      <div class="learn__layout">
        <div class="learn__main">
          <!-- En móvil el video va de borde a borde: en 360 px cada píxel de ancho cuenta. -->
          <div v-if="currentLesson" class="learn__video">
            <LessonPlayer
              :lesson-id="currentLessonId"
              :title="currentLesson.title"
              :can-resume="canResume"
              @completed="setCompleted"
              @position="setPosition"
            />
          </div>

          <LessonDetails
            v-if="currentLesson"
            :lesson="currentLesson"
            :has-next="!!nextLesson"
            :marking="marking"
            @complete="markCurrentCompleted"
            @next="goNext"
          />

          <StateBlock
            v-else
            icon="fa-hourglass-half"
            compact
            :title="copy.emptyTitle"
            :text="copy.emptyText"
          />

          <button
            v-if="course.hasDownload"
            class="btn btn--dark learn__download"
            type="button"
            :disabled="!!downloadingSlug"
            @click="download(slug)"
          >
            <i
              class="fa-solid"
              :class="downloadingSlug ? 'fa-spinner fa-spin' : 'fa-download'"
              aria-hidden="true"
            ></i>
            {{ copy.download }}
          </button>
        </div>

        <aside class="learn__side">
          <ProgressBar
            v-if="lessons.length"
            :percent="percent"
            :label="studentCopy.myCourses.progress(completedCount, lessons.length)"
          />
          <CourseSyllabus
            v-if="lessons.length"
            :modules="course.modules"
            :current-lesson-id="currentLessonId"
            :current-module-id="currentModuleId"
            @select="goToLesson"
          />
          <LiveSessions
            v-if="course.liveSessions?.length"
            :sessions="course.liveSessions"
            :slug="slug"
          />
        </aside>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
// Gutter propio (y no el mixin container) porque el video lo cancela con un
// margen negativo: tiene que ser un valor que esta vista controle.
$learn-gutter: 1rem;

.learn {
  @include flex(column, stretch, flex-start, 1rem);
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding: 1rem $learn-gutter $space-xl;

  @include from('md') {
    padding: $space-md 2rem $space-xl;
  }

  &__head {
    @include flex(row, baseline, flex-start, 0.4rem 1rem);
    flex-wrap: wrap;
  }

  &__back {
    @include flex(row, center, flex-start, 0.45rem);
    min-height: 2.75rem;
    padding-block: 0.4rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    @include transition(color);

    &:hover {
      color: $accent-deep;
    }
  }

  &__course {
    font-size: $text-sm;
    color: $ink-muted;
  }

  // Móvil: video, datos de la clase y debajo el temario. Desde lg el temario
  // pasa a columna lateral fija (flex, sin grid).
  &__layout {
    @include flex(column, stretch, flex-start, $space-md);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: $space-lg;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1.25rem);
    flex: 1;
    min-width: 0;
  }

  // Cancela el padding del contenedor para que el video toque los bordes.
  &__video {
    margin-inline: -$learn-gutter;

    @include from('md') {
      margin-inline: 0;
    }
  }

  &__download {
    align-self: stretch;

    @include from('sm') {
      align-self: flex-start;
    }
  }

  &__side {
    @include flex(column, stretch, flex-start, $space-md);
    min-width: 0;

    @include from('lg') {
      flex: 0 0 360px;
      position: sticky;
      top: 5.5rem;
      max-height: calc(100vh - 6.5rem);
      overflow-y: auto;
      padding-right: 0.25rem;
    }
  }
}
</style>
