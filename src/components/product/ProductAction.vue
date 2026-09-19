<script setup lang="ts">
import { computed, ref } from 'vue'
import { site } from '@/config/site'
import { formatPrice } from '@/utils/format'
import { useOwnedProduct } from '@/composables/useOwnedProduct'
import BaseButton from '@/components/ui/BaseButton.vue'
import LeadForm from '@/components/ui/LeadForm.vue'
import ServiceSurveyForm from './ServiceSurveyForm.vue'
import ProductBuyBar from './ProductBuyBar.vue'
import type { ProductDetail } from '@/types/catalog'

// La tarjeta de acción es lo único que cambia de verdad entre productos:
// cerrado → aviso; gratis → nombre+correo; asesoría → encuesta;
// lista de espera → correo con cupón; abierto → comprar; ya comprado → entrar.
const props = defineProps<{ product: ProductDetail }>()

const copy = site.product
const { owned } = useOwnedProduct(props.product.slug)
// El botón principal: cuando sale de pantalla aparece la barra fija de compra.
const cta = ref<HTMLElement | null>(null)

const mode = computed<'owned' | 'closed' | 'free' | 'service' | 'waitlist' | 'buy'>(() => {
  const p = props.product
  if (owned.value && (p.type === 'course' || p.type === 'download')) return 'owned'
  if (p.saleMode === 'closed') return 'closed'
  if (p.type === 'free') return 'free'
  if (p.type === 'service') return 'service'
  if (p.saleMode === 'waitlist') return 'waitlist'
  return 'buy'
})

const showPrice = computed(
  () => mode.value !== 'free' && mode.value !== 'owned' && props.product.priceCents > 0,
)
const heading = computed(() => {
  if (mode.value === 'buy') return ''
  return mode.value === 'owned' ? copy.buy.ownedTitle : copy[mode.value].title
})
const text = computed(() => {
  if (mode.value === 'buy') return ''
  return mode.value === 'owned' ? copy.buy.ownedText : copy[mode.value].text
})
const ownedTo = computed(() =>
  props.product.type === 'course' ? `/aprender/${props.product.slug}` : '/mis-cursos',
)
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

    <BaseButton v-if="mode === 'owned'" :to="ownedTo" block icon="fa-solid fa-play">
      {{ product.type === 'course' ? copy.buy.ownedCourse : copy.buy.ownedDownload }}
    </BaseButton>

    <template v-else-if="mode === 'buy'">
      <div ref="cta" class="action__cta">
        <BaseButton :to="`/checkout/${product.slug}`" block icon-right="fa-solid fa-arrow-right">
          {{ copy.buy.ctaNow }} · {{ formatPrice(product.priceCents) }}
        </BaseButton>
      </div>
      <p class="action__note">
        <i class="fa-solid fa-lock" aria-hidden="true"></i> {{ copy.buy.note }}
      </p>
      <p class="action__note">{{ copy.buy.steps }}</p>
      <ProductBuyBar :product="product" :target="cta" />
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

  // Botón principal de 52 px: es el toque más importante de la página.
  &__cta :deep(.btn) {
    min-height: 3.25rem;
    font-size: 1rem;
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
