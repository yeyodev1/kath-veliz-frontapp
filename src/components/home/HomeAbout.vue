<script setup lang="ts">
import { site } from '@/config/site'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BrandPhoto from '@/components/ui/BrandPhoto.vue'
import { vReveal } from '@/composables/useReveal'

const about = site.home.about
</script>

<template>
  <section id="sobre-mi" class="about">
    <div class="about__inner">
      <div v-reveal class="about__media">
        <BrandPhoto :src="site.images.about" :alt="about.photoAlt" tone="clay" />
      </div>

      <div class="about__copy">
        <SectionHeading v-reveal :eyebrow="about.eyebrow" :title="about.title" />
        <p v-reveal class="about__lead">{{ about.lead }}</p>
        <p v-for="paragraph in about.paragraphs" :key="paragraph" v-reveal class="about__text">
          {{ paragraph }}
        </p>

        <div v-reveal class="about__bio">
          <h3 class="about__bio-title">{{ about.bioTitle }}</h3>
          <p>{{ about.bio }}</p>
        </div>

        <ul class="about__facts">
          <li
            v-for="(fact, i) in about.facts"
            :key="fact.label"
            v-reveal="i + 1"
            class="about__fact"
          >
            <strong>{{ fact.value }}</strong>
            <span>{{ fact.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about {
  background: $sand;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: $space-section;

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: clamp(2.5rem, 6vw, 6rem);
    }
  }

  &__media {
    flex: 0.8 1 0;
    width: 100%;
    max-width: 24rem;

    @include from('md') {
      position: sticky;
      top: calc(var(--header-h) + 2rem);
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.2rem);
    flex: 1.2 1 0;
  }

  &__lead {
    font-family: $font-display;
    font-style: italic;
    font-size: $text-xl;
    line-height: 1.25;
    color: $accent;
    max-width: 34rem;
  }

  &__text {
    color: $ink-soft;
    max-width: 36rem;
  }

  &__bio {
    border-left: 2px solid $clay;
    padding-left: 1.2rem;
    margin-top: 0.6rem;
    max-width: 36rem;
  }

  &__bio-title {
    @include display($text-xl, 600);
    margin-bottom: 0.4rem;
  }

  &__facts {
    @include flex-cards(150px, 1rem);
    width: 100%;
    list-style: none;
    margin-top: 1rem;
  }

  &__fact {
    @include flex(column, flex-start, flex-start, 0.2rem);
    padding-top: 0.9rem;
    border-top: 1px solid rgba($ink, 0.25);

    strong {
      font-family: $font-display;
      font-size: 2.1rem;
      font-weight: 600;
      line-height: 1;
      color: $accent;
    }

    span {
      font-size: $text-sm;
      color: $ink-soft;
    }
  }
}
</style>
