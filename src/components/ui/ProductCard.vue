<script setup lang="ts">
import { computed, ref } from 'vue'
import { site } from '@/config/site'
import { formatPrice } from '@/utils/format'
import type { ProductCard } from '@/types/catalog'

const props = defineProps<{ product: ProductCard; index?: number }>()

const coverFailed = ref(false)
const labels = site.product

// En lista de espera o cerrado el precio puede no estar definido aún: $0 ahí no es "gratis".
const notOnSale = computed(() => props.product.saleMode !== 'open' && !props.product.priceCents)
const isFree = computed(
  () => props.product.type === 'free' || (props.product.priceCents === 0 && !notOnSale.value),
)
const badge = computed(() => {
  if (props.product.saleMode === 'waitlist') return labels.badges.waitlist
  if (props.product.saleMode === 'closed') return labels.badges.closed
  return ''
})
// Sin portada, cada tarjeta alterna un tono de marca para que la fila no sea monótona.
const tone = computed(() => ['forest', 'clay', 'sand'][(props.index ?? 0) % 3])
const number = computed(() => String((props.index ?? 0) + 1).padStart(2, '0'))
</script>

<template>
  <article class="card">
    <RouterLink :to="`/p/${product.slug}`" class="card__link" :aria-label="product.title">
      <div class="card__cover" :class="`card__cover--${tone}`">
        <img
          v-if="product.cover?.url && !coverFailed"
          :src="product.cover.url"
          alt=""
          loading="lazy"
          decoding="async"
          @error="coverFailed = true"
        />
        <span v-else class="card__number" aria-hidden="true">{{ number }}</span>
        <span v-if="badge" class="card__badge">{{ badge }}</span>
      </div>

      <div class="card__body">
        <p class="card__type">{{ labels.typeLabels[product.type] }}</p>
        <h3 class="card__title">{{ product.title }}</h3>
        <p v-if="product.subtitle" class="card__subtitle">{{ product.subtitle }}</p>

        <div class="card__foot">
          <p class="card__price">
            <template v-if="isFree">{{ labels.badges.free }}</template>
            <template v-else-if="notOnSale">
              {{ product.saleMode === 'waitlist' ? labels.badges.waitlistPerk : '' }}
            </template>
            <template v-else-if="product.type !== 'service' || product.priceCents">
              <s v-if="product.compareAtPriceCents" class="card__compare">
                <span class="visually-hidden">Antes </span
                >{{ formatPrice(product.compareAtPriceCents) }}
              </s>
              {{ formatPrice(product.priceCents) }}
            </template>
          </p>
          <span class="card__cta">
            {{ labels.cardCta[product.type] }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
.card {
  display: flex;

  &__link {
    @include flex(column, stretch, flex-start);
    width: 100%;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-md;
    overflow: hidden;
    @include transition;

    &:hover {
      border-color: $accent;
      box-shadow: $shadow-md;
      transform: translateY(-4px);
    }

    &:hover .card__cta i {
      transform: translateX(4px);
    }
  }

  &__cover {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    @include flex(row, flex-end, flex-start);

    &--forest {
      background: $accent;
      color: rgba($paper, 0.9);
    }

    &--clay {
      background: $clay-soft;
      color: $clay-deep;
    }

    &--sand {
      background: $sand;
      color: $accent;
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__number {
    font-family: $font-display;
    font-style: italic;
    font-size: 4.5rem;
    line-height: 0.8;
    padding: 0 0 1rem 1.2rem;
    opacity: 0.85;
  }

  &__badge {
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    font-family: $font-condensed;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: $butter;
    color: $accent-deep;
    padding: 0.3rem 0.65rem;
    border-radius: $radius-pill;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.5rem);
    flex: 1;
    padding: 1.3rem 1.3rem 1.2rem;
  }

  &__type {
    @include eyebrow;
    color: $clay-deep;
  }

  &__title {
    @include display($text-xl, 600);
    line-height: 1.08;
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__foot {
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid $line;
  }

  &__price {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1;
  }

  &__compare {
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 400;
    color: $ink-muted;
    margin-right: 0.3rem;
  }

  &__cta {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;

    i {
      font-size: 0.8em;
      @include transition(transform);
    }
  }
}
</style>
