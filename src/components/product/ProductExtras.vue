<script setup lang="ts">
import { site } from '@/config/site'
import { formatDateTime } from '@/utils/format'
import BaseAccordion from '@/components/ui/BaseAccordion.vue'
import { vReveal } from '@/composables/useReveal'
import type { LiveSessionPreview, ProductFaq } from '@/types/catalog'

// Clases en vivo y preguntas frecuentes: las dos secciones opcionales del
// final de la landing. Cada una se pinta solo si trae datos.
defineProps<{ sessions: LiveSessionPreview[]; faqs: ProductFaq[] }>()

const labels = site.product.sections
</script>

<template>
  <section v-if="sessions.length" v-reveal class="extras">
    <h2 class="extras__title">{{ labels.live }}</h2>
    <ul class="extras__sessions">
      <li v-for="session in sessions" :key="session.id || session.startsAt" class="session">
        <i class="fa-solid fa-video session__icon" aria-hidden="true"></i>
        <div>
          <strong class="session__title">{{ session.title }}</strong>
          <time class="session__date" :datetime="session.startsAt">{{
            formatDateTime(session.startsAt)
          }}</time>
        </div>
      </li>
    </ul>
  </section>

  <section v-if="faqs.length" v-reveal class="extras">
    <h2 class="extras__title">{{ labels.faqs }}</h2>
    <div>
      <BaseAccordion v-for="faq in faqs" :key="faq.question" :title="faq.question">
        <p class="extras__answer">{{ faq.answer }}</p>
      </BaseAccordion>
    </div>
  </section>
</template>

<style scoped lang="scss">
.extras {
  &__title {
    @include display($display-sm);
    margin-bottom: 1.4rem;
  }

  &__sessions {
    @include flex(column, stretch, flex-start, 0.75rem);
    list-style: none;
  }

  &__answer {
    color: $ink-soft;
    white-space: pre-line;
    max-width: 40rem;
  }
}

.session {
  @include flex(row, center, flex-start, 1rem);
  background: $accent-soft;
  border-radius: $radius-md;
  padding: 1rem 1.2rem;

  &__icon {
    color: $accent;
  }

  &__title {
    display: block;
    font-weight: 600;
  }

  &__date {
    font-size: $text-sm;
    color: $ink-soft;

    &::first-letter {
      text-transform: uppercase;
    }
  }
}
</style>
