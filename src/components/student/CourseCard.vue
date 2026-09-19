<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/student/ProgressBar.vue'
import { studentCopy } from '@/config/student'
import { formatLongDate } from '@/utils/learnFormat'
import type { MyProduct } from '@/types/student'

const props = defineProps<{ item: MyProduct; downloading: boolean }>()
defineEmits<{ download: [slug: string] }>()

const copy = studentCopy.myCourses

const locked = computed(() => props.item.access.status !== 'vigente')
const hasLessons = computed(() => props.item.progress.totalLessons > 0)
const learnTo = computed(() => `/aprender/${props.item.product.slug}`)
// Si está a la venta va directo al pago; con lista de espera o cerrado, a la landing.
const rebuyTo = computed(() => {
  const { slug, saleMode, type } = props.item.product
  return saleMode === 'open' && type !== 'service' ? `/checkout/${slug}` : `/p/${slug}`
})

// Vigente sin fecha = no vence: no se muestra nada, no hay nada que avisar.
const accessNote = computed(() => {
  const { status, expiresAt } = props.item.access
  if (status === 'revocado') return copy.revoked
  if (status === 'vencido')
    return expiresAt ? copy.expired(formatLongDate(expiresAt)) : copy.expiredNoDate
  return expiresAt ? copy.availableUntil(formatLongDate(expiresAt)) : ''
})

const learnLabel = computed(() => {
  const { percent, completedLessons } = props.item.progress
  if (percent >= 100) return copy.review
  return completedLessons > 0 || props.item.progress.lastLessonId ? copy.resume : copy.start
})
</script>

<template>
  <article class="course" :class="{ 'course--locked': locked }">
    <div class="course__cover">
      <img v-if="item.product.cover" :src="item.product.cover.url" :alt="''" loading="lazy" />
      <i v-else class="fa-solid fa-book-open course__placeholder" aria-hidden="true"></i>
      <span v-if="locked" class="course__badge">
        <i class="fa-solid fa-lock" aria-hidden="true"></i> {{ copy.locked }}
      </span>
    </div>

    <div class="course__body">
      <p class="course__type">{{ studentCopy.checkout.types[item.product.type] }}</p>
      <h2 class="course__title">{{ item.product.title }}</h2>

      <p v-if="accessNote" class="course__access" :class="{ 'course__access--locked': locked }">
        <i
          class="fa-regular"
          :class="locked ? 'fa-circle-xmark' : 'fa-calendar'"
          aria-hidden="true"
        ></i>
        {{ accessNote }}
      </p>

      <ProgressBar
        v-if="hasLessons && !locked"
        :percent="item.progress.percent"
        :label="copy.progress(item.progress.completedLessons, item.progress.totalLessons)"
      />
      <p v-else-if="item.product.type === 'service' && !locked" class="course__note">
        {{ copy.serviceNote }}
      </p>
      <p v-else-if="item.product.type === 'course' && !locked" class="course__note">
        {{ copy.comingSoon }}
      </p>

      <div class="course__actions">
        <RouterLink v-if="locked" class="btn btn--dark" :to="rebuyTo">
          {{ copy.rebuy }}
        </RouterLink>

        <template v-else-if="item.product.type === 'download'">
          <button
            class="btn btn--primary"
            type="button"
            :disabled="downloading"
            @click="$emit('download', item.product.slug)"
          >
            <i
              class="fa-solid"
              :class="downloading ? 'fa-spinner fa-spin' : 'fa-download'"
              aria-hidden="true"
            ></i>
            {{ downloading ? copy.downloading : copy.download }}
          </button>
          <RouterLink v-if="hasLessons" class="btn btn--ghost" :to="learnTo">
            <i class="fa-solid fa-play" aria-hidden="true"></i> {{ copy.tutorial }}
          </RouterLink>
        </template>

        <RouterLink v-else-if="hasLessons" class="btn btn--primary" :to="learnTo">
          <i class="fa-solid fa-play" aria-hidden="true"></i> {{ learnLabel }}
        </RouterLink>

        <!-- Curso todavía sin clases: igual se entra, ahí están las clases en vivo. -->
        <RouterLink v-else-if="item.product.type === 'course'" class="btn btn--ghost" :to="learnTo">
          {{ copy.enter }}
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.course {
  @include card;
  @include flex(column, stretch, flex-start);
  overflow: hidden;
  box-shadow: $shadow-sm;

  &__cover {
    position: relative;
    @include flex(row, center, center);
    width: 100%;
    aspect-ratio: 16 / 9;
    background: $sand;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__placeholder {
    font-size: 2rem;
    color: $ink-muted;
  }

  // Bloqueado se nota, pero el curso sigue reconocible: no debe parecer que desapareció.
  &--locked &__cover img {
    filter: grayscale(1);
    opacity: 0.55;
  }

  &__badge {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    @include flex(row, center, flex-start, 0.4rem);
    padding: 0.3rem 0.7rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    color: $surface;
    background: $ink;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.7rem);
    flex: 1;
    padding: 1.15rem 1.15rem 1.3rem;
  }

  &__type {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__title {
    font-size: $text-lg;
    line-height: 1.2;
    margin-top: -0.35rem;
  }

  &__access,
  &__note {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__access--locked {
    color: $danger;
  }

  &__actions {
    @include flex(row, stretch, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-top: auto;
    padding-top: 0.4rem;

    .btn {
      flex: 1 1 auto;
      padding-inline: 1.2rem;
    }
  }
}
</style>
