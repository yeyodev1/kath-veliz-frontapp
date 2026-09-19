<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { vReveal } from '@/composables/useReveal'
import type { ProductCard as Product } from '@/types/catalog'

// `products` viene del API. Si falló o llegó vacío, se pintan los servicios
// de site.ts: el Home nunca se queda sin oferta que mostrar.
const props = defineProps<{ products: Product[]; loading: boolean }>()

const copy = site.home.offerings
const useFallback = computed(() => !props.loading && props.products.length === 0)
</script>

<template>
  <section id="servicios" class="offerings">
    <div class="offerings__inner">
      <SectionHeading v-reveal :eyebrow="copy.eyebrow" :title="copy.title" :text="copy.text" />

      <div v-if="loading" class="offerings__list" aria-busy="true">
        <div v-for="n in 3" :key="n" class="offerings__skeleton"></div>
      </div>

      <div v-else-if="useFallback" class="offerings__list">
        <RouterLink
          v-for="(item, i) in copy.fallback"
          :key="item.slug"
          v-reveal="i + 1"
          :to="`/p/${item.slug}`"
          class="offering"
        >
          <span class="offering__num" aria-hidden="true">0{{ i + 1 }}</span>
          <p class="offering__kicker">{{ item.kicker }}</p>
          <h3 class="offering__title">{{ item.title }}</h3>
          <p class="offering__text">{{ item.text }}</p>
          <span class="offering__cta">
            {{ item.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </span>
        </RouterLink>
      </div>

      <div v-else class="offerings__list">
        <ProductCard
          v-for="(product, i) in products"
          :key="product.id || product.slug"
          v-reveal="i + 1"
          :product="product"
          :index="i"
        />
      </div>

      <BaseButton :to="copy.all.to" variant="ghost" icon-right="fa-solid fa-arrow-right">
        {{ copy.all.label }}
      </BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.offerings {
  &__inner {
    @include container;
    @include flex(column, flex-start, flex-start, 2.5rem);
    padding-block: $space-section;
  }

  &__list {
    @include flex-cards(270px, 1.25rem);
    width: 100%;
  }

  &__skeleton {
    height: 22rem;
    border-radius: $radius-md;
    background: $sand;
    animation: offerings-pulse 1.4s ease-in-out infinite alternate;
  }
}

.offering {
  position: relative;
  @include flex(column, flex-start, flex-start, 0.6rem);
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-md;
  padding: 1.6rem 1.4rem 1.4rem;
  @include transition;

  &:hover {
    border-color: $accent;
    box-shadow: $shadow-md;
    transform: translateY(-4px);
  }

  &__num {
    font-family: $font-display;
    font-style: italic;
    font-size: 3rem;
    line-height: 0.9;
    color: $clay;
  }

  &__kicker {
    @include eyebrow;
    color: $clay-deep;
    margin-top: 0.6rem;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__cta {
    @include flex(row, center, flex-start, 0.45rem);
    margin-top: auto;
    padding-top: 1rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;

    i {
      font-size: 0.8em;
    }
  }
}

@keyframes offerings-pulse {
  to {
    opacity: 0.45;
  }
}
</style>
