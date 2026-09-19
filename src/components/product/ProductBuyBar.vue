<script setup lang="ts">
import { ref, toRef } from 'vue'
import { site } from '@/config/site'
import { formatPrice } from '@/utils/format'
import { useBuyBar } from '@/composables/useBuyBar'
import type { ProductDetail } from '@/types/catalog'

// Precio y botón siempre a mano en el celular: quien ya se decidió leyendo la
// página no tiene que volver a subir a buscar dónde se compra.
const props = defineProps<{ product: ProductDetail; target: HTMLElement | null }>()

const copy = site.product.buy
const bar = ref<HTMLElement | null>(null)
const { visible } = useBuyBar(toRef(props, 'target'), bar)
</script>

<template>
  <Teleport to="body">
    <Transition name="buybar">
      <div v-if="visible" ref="bar" class="buybar" role="region" :aria-label="copy.barLabel">
        <p class="buybar__price">
          <s v-if="product.compareAtPriceCents" class="buybar__compare">
            <span class="visually-hidden">Antes </span
            >{{ formatPrice(product.compareAtPriceCents) }}
          </s>
          <strong>{{ formatPrice(product.priceCents) }}</strong>
        </p>
        <RouterLink class="btn btn--primary buybar__cta" :to="`/checkout/${product.slug}`">
          {{ copy.ctaNow }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.buybar {
  @include flex(row, center, space-between, 0.9rem);
  position: fixed;
  inset: auto 0 0;
  // Debajo del header (100) y de los modales: nunca tapa un diálogo abierto.
  z-index: 90;
  padding: 0.65rem 1.25rem calc(0.65rem + env(safe-area-inset-bottom));
  background: $surface;
  border-top: 1px solid $line;
  box-shadow: 0 -6px 24px rgba($ink, 0.08);

  // En escritorio la tarjeta de compra es sticky: la barra sobra.
  @include from('lg') {
    display: none;
  }

  &__price {
    @include flex(column, flex-start, center);
    min-width: 0;
    line-height: 1.1;

    strong {
      font-family: $font-display;
      font-size: 1.7rem;
      font-weight: 600;
      color: $accent;
    }
  }

  &__compare {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__cta {
    flex: 1;
    max-width: 16rem;
    min-height: 3rem;
    padding-inline: 1rem;
    white-space: nowrap;
  }
}

.buybar-enter-active,
.buybar-leave-active {
  @include transition(transform);
}

.buybar-enter-from,
.buybar-leave-to {
  transform: translateY(100%);
}

// Sin deslizamiento para quien pidió menos movimiento: aparece y ya.
@include reduced-motion {
  .buybar-enter-active,
  .buybar-leave-active {
    transition: none;
  }
}
</style>
