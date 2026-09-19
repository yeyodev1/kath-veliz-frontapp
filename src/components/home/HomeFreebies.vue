<script setup lang="ts">
import { site } from '@/config/site'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { vReveal } from '@/composables/useReveal'
import type { ProductCard } from '@/types/catalog'

// Solo se monta si hay recursos gratuitos publicados (lo decide HomeView).
defineProps<{ products: ProductCard[] }>()

const copy = site.home.freebies
</script>

<template>
  <section id="recursos" class="freebies">
    <div class="freebies__inner">
      <SectionHeading
        v-reveal
        :eyebrow="copy.eyebrow"
        :title="copy.title"
        :text="copy.text"
        on-dark
      />

      <ul class="freebies__list">
        <li v-for="(product, i) in products" :key="product.slug" v-reveal="i + 1">
          <RouterLink :to="`/p/${product.slug}`" class="freebie">
            <span class="freebie__icon" aria-hidden="true"
              ><i class="fa-regular fa-file-lines"></i
            ></span>
            <span class="freebie__body">
              <strong class="freebie__title">{{ product.title }}</strong>
              <span v-if="product.subtitle" class="freebie__text">{{ product.subtitle }}</span>
            </span>
            <span class="freebie__cta">
              {{ site.product.cardCta.free }}
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </span>
          </RouterLink>
        </li>
      </ul>

      <BaseButton :to="copy.all.to" variant="light">{{ copy.all.label }}</BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.freebies {
  background: $accent;
  color: $paper;
  background-image: repeating-linear-gradient(
    135deg,
    rgba($paper, 0.04) 0 1px,
    transparent 1px 16px
  );

  &__inner {
    @include container;
    @include flex(column, flex-start, flex-start, 2.2rem);
    padding-block: $space-section;
  }

  &__list {
    @include flex(column, stretch, flex-start);
    width: 100%;
    list-style: none;
    border-top: 1px solid rgba($paper, 0.25);
  }
}

.freebie {
  @include flex(row, center, flex-start, 1rem);
  flex-wrap: wrap;
  padding: 1.3rem 0.25rem;
  border-bottom: 1px solid rgba($paper, 0.25);
  @include transition(padding);
  @include focus-ring($butter);

  &:hover {
    padding-left: 0.9rem;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: rgba($paper, 0.12);
    color: $butter;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1 1 200px;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 600;
    line-height: 1.1;
  }

  &__text {
    font-size: $text-sm;
    color: rgba($paper, 0.8);
  }

  &__cta {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $butter;

    i {
      font-size: 0.8em;
    }
  }
}
</style>
