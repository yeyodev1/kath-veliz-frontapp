<script setup lang="ts">
import { site } from '@/config/site'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { vReveal } from '@/composables/useReveal'

// Se alimenta de site.home.testimonials.items. Hoy está vacío a propósito:
// no se inventan testimonios, y HomeView no monta la sección sin datos reales.
const copy = site.home.testimonials
</script>

<template>
  <section id="testimonios" class="testimonials">
    <div class="testimonials__inner">
      <SectionHeading v-reveal :eyebrow="copy.eyebrow" :title="copy.title" />

      <div class="testimonials__list">
        <figure v-for="(item, i) in copy.items" :key="item.name" v-reveal="i + 1" class="testimonial">
          <i class="fa-solid fa-quote-left testimonial__mark" aria-hidden="true"></i>
          <blockquote class="testimonial__quote">{{ item.quote }}</blockquote>
          <figcaption class="testimonial__author">
            <img v-if="item.photo" :src="item.photo" alt="" loading="lazy" />
            <span>
              <strong>{{ item.name }}</strong>
              <small v-if="item.role">{{ item.role }}</small>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.testimonials {
  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: $space-section;
  }

  &__list {
    @include flex-cards(280px, 1.25rem);
  }
}

.testimonial {
  @include flex(column, flex-start, flex-start, 1rem);
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-md;
  padding: 1.8rem 1.6rem;

  &__mark {
    font-size: 1.4rem;
    color: $clay;
  }

  &__quote {
    font-family: $font-display;
    font-size: $text-xl;
    font-style: italic;
    line-height: 1.25;
  }

  &__author {
    @include flex(row, center, flex-start, 0.8rem);
    margin-top: auto;
    font-size: $text-sm;

    img {
      width: 2.8rem;
      height: 2.8rem;
      border-radius: 50%;
      object-fit: cover;
    }

    span {
      @include flex(column, flex-start, flex-start);
    }

    small {
      color: $ink-muted;
    }
  }
}
</style>
