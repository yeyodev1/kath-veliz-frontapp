<script setup lang="ts">
import { site } from '@/config/site'
import BaseButton from '@/components/ui/BaseButton.vue'
import BrandPhoto from '@/components/ui/BrandPhoto.vue'

const hero = site.home.hero
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">{{ hero.eyebrow }}</p>
        <h1 class="hero__title">
          {{ hero.title.before }}<em>{{ hero.title.em }}</em
          >{{ hero.title.after }}
        </h1>
        <p class="hero__text">{{ hero.text }}</p>
        <div class="hero__actions">
          <BaseButton :to="hero.primary.to" icon-right="fa-solid fa-arrow-right">
            {{ hero.primary.label }}
          </BaseButton>
          <BaseButton :to="hero.secondary.to" variant="ghost">{{
            hero.secondary.label
          }}</BaseButton>
        </div>
      </div>

      <div class="hero__media">
        <BrandPhoto
          :src="site.images.hero"
          :src-mobile="site.images.heroMobile"
          :alt="hero.photoAlt"
          tone="forest"
          eager
        />
        <p class="hero__stamp" aria-hidden="true">
          <span>{{ hero.stamp }}</span>
        </p>
        <a :href="site.social.instagram" target="_blank" rel="noopener" class="hero__handle">
          <i class="fa-brands fa-instagram" aria-hidden="true"></i> {{ site.handle }}
        </a>
      </div>
    </div>

    <!-- La segunda tanda es copia visual para el bucle: el lector de pantalla lee solo la primera. -->
    <div class="hero__tape">
      <ul v-for="n in 2" :key="n" class="hero__topics" :aria-hidden="n === 2">
        <li v-for="topic in hero.topics" :key="topic">{{ topic }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  overflow: hidden;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: 2rem 3rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: clamp(2rem, 5vw, 5rem);
      padding-block: 3.5rem 4.5rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.3rem);
    flex: 1.25 1 0;
    animation: hero-in 0.9s $ease both;
  }

  &__eyebrow {
    @include eyebrow;
    color: $clay-deep;
  }

  &__title {
    @include display($display-lg);
    // Sin balance: el titular es largo y se quiere la cascada natural.
    text-wrap: pretty;
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 34rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }

  &__media {
    position: relative;
    flex: 1 1 0;
    width: 100%;
    max-width: 26rem;
    margin-inline: auto;
    animation: hero-in 0.9s 0.15s $ease both;
  }

  // Sello redondo que pisa la esquina de la foto, como una etiqueta pegada.
  &__stamp {
    position: absolute;
    left: -0.75rem;
    bottom: 2.2rem;
    @include flex(row, center, center);
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 50%;
    background: $butter;
    color: $accent-deep;
    text-align: center;
    transform: rotate(-12deg);
    box-shadow: $shadow-md;

    span {
      font-family: $font-condensed;
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0.16em;
      line-height: 1.35;
      text-transform: uppercase;
      max-width: 5rem;
    }

    @include from('md') {
      left: -2.2rem;
      width: 7.6rem;
      height: 7.6rem;

      span {
        font-size: 0.8rem;
      }
    }
  }

  &__handle {
    position: absolute;
    right: 0.9rem;
    top: 0.9rem;
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-xs;
    font-weight: 600;
    background: $paper;
    color: $ink;
    padding: 0.45rem 0.8rem;
    border-radius: $radius-pill;
    @include transition;

    &:hover {
      background: $ink;
      color: $paper;
    }
  }

  &__tape {
    display: flex;
    background: $accent;
    color: $paper;
    padding-block: 0.9rem;
    overflow: hidden;
  }

  &__topics {
    @include flex(row, center, flex-start);
    flex-shrink: 0;
    list-style: none;
    animation: hero-tape 36s linear infinite;

    li {
      @include flex(row, center, flex-start);
      font-family: $font-display;
      font-style: italic;
      font-size: 1.35rem;
      white-space: nowrap;

      &::after {
        content: '';
        width: 6px;
        height: 6px;
        margin-inline: 1.4rem;
        border-radius: 50%;
        background: $butter;
      }
    }
  }

  @include reduced-motion {
    &__topics {
      animation: none;
    }
  }
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
}

@keyframes hero-tape {
  to {
    transform: translateX(-100%);
  }
}
</style>
