<script setup lang="ts">
import { computed, ref } from 'vue'
import { site } from '@/config/site'
import { formatDuration } from '@/utils/format'
import type { ProductDetail } from '@/types/catalog'

const props = defineProps<{ product: ProductDetail }>()

const labels = site.product
const coverFailed = ref(false)

const catalogLink = computed(() =>
  props.product.type === 'free'
    ? { to: '/recursos', label: site.catalog.recursos.eyebrow }
    : { to: '/cursos', label: site.catalog.cursos.eyebrow },
)

const badge = computed(() => {
  if (props.product.saleMode === 'waitlist') return labels.badges.waitlist
  if (props.product.saleMode === 'closed') return labels.badges.closed
  return ''
})

// Solo datos que el API realmente trae; nada de cifras de adorno.
const facts = computed(() => {
  const p = props.product
  const items: { icon: string; text: string }[] = []
  if (p.lessonCount > 0) {
    const word = p.lessonCount === 1 ? labels.meta.lesson : labels.meta.lessons
    items.push({ icon: 'fa-regular fa-circle-play', text: `${p.lessonCount} ${word}` })
  }
  if (p.totalDurationSeconds > 0) {
    items.push({ icon: 'fa-regular fa-clock', text: formatDuration(p.totalDurationSeconds, true) })
  }
  if (p.type === 'course' || p.type === 'download') {
    items.push({
      icon: 'fa-regular fa-calendar-check',
      text: p.accessDurationDays
        ? `${accessLabel(p.accessDurationDays)} ${labels.meta.accessDays}`
        : labels.meta.lifetime,
    })
  }
  return items
})

function accessLabel(days: number): string {
  if (days % 365 === 0) return days === 365 ? '1 año' : `${days / 365} años`
  if (days % 30 === 0) return days === 30 ? '1 mes' : `${days / 30} meses`
  return `${days} días`
}
</script>

<template>
  <header class="phero">
    <div class="phero__inner">
      <div class="phero__copy">
        <nav class="phero__crumbs" aria-label="Ruta">
          <RouterLink :to="catalogLink.to">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ catalogLink.label }}
          </RouterLink>
        </nav>

        <p class="phero__type">
          {{ labels.typeLabels[product.type] }}
          <span v-if="badge" class="phero__badge">{{ badge }}</span>
        </p>
        <h1 class="phero__title">{{ product.title }}</h1>
        <p v-if="product.subtitle" class="phero__subtitle">{{ product.subtitle }}</p>

        <ul v-if="facts.length" class="phero__facts">
          <li v-for="fact in facts" :key="fact.text">
            <i :class="fact.icon" aria-hidden="true"></i> {{ fact.text }}
          </li>
        </ul>
      </div>

      <div v-if="product.cover?.url && !coverFailed" class="phero__cover">
        <img :src="product.cover.url" :alt="product.title" decoding="async" @error="coverFailed = true" />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.phero {
  background: $sand;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2rem);
    padding-block: 1.5rem 2.5rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: clamp(2rem, 5vw, 4.5rem);
      padding-block: 2.5rem 4rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1rem);
    flex: 1.3 1 0;
  }

  &__crumbs a {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $ink-soft;
    padding: 0.4rem 0;
    @include transition(color);

    &:hover {
      color: $accent;
    }
  }

  &__type {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.7rem);
    flex-wrap: wrap;
    color: $clay-deep;
  }

  &__badge {
    background: $butter;
    color: $accent-deep;
    letter-spacing: 0.14em;
    padding: 0.25rem 0.65rem;
    border-radius: $radius-pill;
  }

  &__title {
    @include display($display-lg);
    font-size: clamp(2.6rem, 1.6rem + 4.4vw, 4.8rem);
  }

  &__subtitle {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 36rem;
  }

  &__facts {
    @include flex(row, center, flex-start, 0.5rem 1.4rem);
    flex-wrap: wrap;
    list-style: none;
    margin-top: 0.4rem;
    font-size: $text-sm;
    font-weight: 500;

    i {
      color: $sage;
      margin-right: 0.3rem;
    }
  }

  &__cover {
    flex: 1 1 0;
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: $shadow-md;

    img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }
  }
}
</style>
