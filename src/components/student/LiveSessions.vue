<script setup lang="ts">
import { computed } from 'vue'
import { studentCopy } from '@/config/student'
import { formatDateTime } from '@/utils/learnFormat'
import type { LiveSession } from '@/types/student'

const props = defineProps<{ sessions: LiveSession[]; slug: string }>()

const copy = studentCopy.learn.live
// Una clase se considera "en curso" hasta 3 horas después de empezar: el enlace
// de Meet sigue sirviendo para quien llega tarde.
const LIVE_WINDOW_MS = 3 * 60 * 60 * 1000

const items = computed(() => {
  const now = Date.now()
  return [...props.sessions]
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .map((session) => {
      const recording = session.recordingLesson
      const recordingId = typeof recording === 'string' ? recording : (recording?.id ?? '')
      return {
        ...session,
        when: formatDateTime(session.startsAt),
        past: new Date(session.startsAt).getTime() + LIVE_WINDOW_MS < now,
        recordingTo: recordingId ? `/aprender/${props.slug}/${recordingId}` : '',
      }
    })
})
</script>

<template>
  <section class="live" aria-labelledby="live-title">
    <h2 id="live-title" class="live__heading">
      <i class="fa-solid fa-video" aria-hidden="true"></i> {{ copy.title }}
    </h2>

    <ul class="live__list">
      <li
        v-for="session in items"
        :key="session.id"
        class="live__item"
        :class="{ 'live__item--past': session.past }"
      >
        <div class="live__info">
          <p class="live__when">
            <span class="live__tag">{{ session.past ? copy.past : copy.upcoming }}</span>
            <time :datetime="session.startsAt">{{ session.when }}</time>
          </p>
          <h3 class="live__title">{{ session.title }}</h3>
          <p v-if="session.description" class="live__text">{{ session.description }}</p>
        </div>

        <div class="live__actions">
          <RouterLink v-if="session.recordingTo" class="btn btn--ghost" :to="session.recordingTo">
            <i class="fa-solid fa-circle-play" aria-hidden="true"></i> {{ copy.recording }}
          </RouterLink>
          <a
            v-if="!session.past && session.meetUrl"
            class="btn btn--primary"
            :href="session.meetUrl"
            target="_blank"
            rel="noopener"
          >
            <i class="fa-solid fa-video" aria-hidden="true"></i> {{ copy.join }}
          </a>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.live {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__heading {
    @include eyebrow;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
    list-style: none;
  }

  &__item {
    @include card;
    @include flex(column, stretch, flex-start, 0.85rem);
    padding: 1rem;

    &--past {
      background: transparent;
    }
  }

  &__info {
    min-width: 0;
  }

  &__when {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__tag {
    padding: 0.1rem 0.55rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    color: $accent-deep;
    background: $accent-soft;
  }

  &__item--past &__tag {
    color: $ink-muted;
    background: $sand;
  }

  &__title {
    margin-top: 0.35rem;
    font-size: $text-lg;
    line-height: 1.25;
  }

  &__text {
    margin-top: 0.25rem;
    font-size: $text-sm;
    color: $ink-soft;
    white-space: pre-line;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.5rem);

    &:empty {
      display: none;
    }

    .btn {
      padding-inline: 1.2rem;
    }

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>
