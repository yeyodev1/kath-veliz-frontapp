<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { formatPrice } from '@/utils/format'
import BaseButton from '@/components/ui/BaseButton.vue'
import LeadForm from '@/components/ui/LeadForm.vue'
import ServiceSurveyForm from './ServiceSurveyForm.vue'
import type { ProductDetail } from '@/types/catalog'

// La tarjeta de acción es lo único que cambia de verdad entre productos:
// cerrado → aviso; gratis → nombre+correo; asesoría → encuesta;
// lista de espera → correo con cupón; abierto → comprar.
const props = defineProps<{ product: ProductDetail }>()

const copy = site.product

const mode = computed<'closed' | 'free' | 'service' | 'waitlist' | 'buy'>(() => {
  const p = props.product
  if (p.saleMode === 'closed') return 'closed'
  if (p.type === 'free') return 'free'
  if (p.type === 'service') return 'service'
  if (p.saleMode === 'waitlist') return 'waitlist'
  return 'buy'
})

const showPrice = computed(() => mode.value !== 'free' && props.product.priceCents > 0)
const heading = computed(() => {
  if (mode.value === 'buy') return ''
  return copy[mode.value].title
})
const text = computed(() => (mode.value === 'buy' ? '' : copy[mode.value].text))
</script>

<template>
  <aside
    id="accion"
    class="action"
    :class="`action--${mode}`"
    :aria-label="heading || copy.buy.cta"
  >
    <p v-if="showPrice" class="action__price">
      <s v-if="product.compareAtPriceCents" class="action__compare">
        <span class="visually-hidden">Antes </span>{{ formatPrice(product.compareAtPriceCents) }}
      </s>
      <strong>{{ formatPrice(product.priceCents) }}</strong>
      <span class="action__currency">USD</span>
    </p>

    <h2 v-if="heading" class="action__title">{{ heading }}</h2>
    <p v-if="text" class="action__text">{{ text }}</p>

    <template v-if="mode === 'buy'">
      <BaseButton :to="`/checkout/${product.slug}`" block icon-right="fa-solid fa-arrow-right">
        {{ copy.buy.cta }}
      </BaseButton>
      <p class="action__note">
        <i class="fa-solid fa-lock" aria-hidden="true"></i> {{ copy.buy.note }}
      </p>
    </template>

    <LeadForm
      v-else-if="mode === 'waitlist'"
      kind="waitlist"
      :source="product.slug"
      :product-slug="product.slug"
      :cta="copy.waitlist.cta"
      :success="copy.waitlist.success"
      id-prefix="waitlist"
    />

    <LeadForm
      v-else-if="mode === 'free'"
      kind="free-resource"
      :source="product.slug"
      :product-slug="product.slug"
      :cta="copy.free.cta"
      :success="copy.free.success"
      id-prefix="free"
    />

    <ServiceSurveyForm v-else-if="mode === 'service'" :product="product" />

    <BaseButton
      v-else
      :href="site.social.community"
      variant="ghost"
      block
      icon="fa-brands fa-whatsapp"
    >
      {{ site.home.community.cta }}
    </BaseButton>
  </aside>
</template>

<style scoped lang="scss">
.action {
  @include flex(column, stretch, flex-start, 0.9rem);
  background: $surface;
  border: 1px solid $line;
  border-top: 3px solid $accent;
  border-radius: $radius-md;
  padding: 1.6rem 1.4rem;
  box-shadow: $shadow-sm;

  @include from('md') {
    padding: 2rem 1.8rem;
  }

  &__price {
    @include flex(row, baseline, flex-start, 0.5rem);
    flex-wrap: wrap;

    strong {
      font-family: $font-display;
      font-size: 3.2rem;
      font-weight: 600;
      line-height: 0.95;
      color: $accent;
    }
  }

  &__compare {
    font-size: $text-lg;
    color: $ink-muted;
  }

  &__currency {
    @include eyebrow;
    color: $ink-muted;
  }

  &__title {
    @include display($text-xl, 600);
    line-height: 1.1;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;
    text-align: center;

    i {
      margin-right: 0.3rem;
    }
  }
}
</style>
