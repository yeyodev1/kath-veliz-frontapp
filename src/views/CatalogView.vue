<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import { vReveal } from '@/composables/useReveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { ProductType } from '@/types/catalog'

// /cursos y /recursos usan esta misma vista: la ruta trae `meta.catalog`.
// El router las declara como registros distintos, así que al pasar de una a
// otra el componente se vuelve a montar y no hace falta observar la ruta.
const route = useRoute()
const kind = route.meta.catalog === 'recursos' ? 'recursos' : 'cursos'
const copy = site.catalog[kind]

const types: ProductType[] = kind === 'recursos' ? ['free'] : ['course', 'download', 'service']
const { products, loading, error, load } = useCatalog(types)

const isEmpty = computed(() => !loading.value && !error.value && products.value.length === 0)

onMounted(load)
</script>

<template>
  <section class="catalog">
    <div class="catalog__inner">
      <SectionHeading :eyebrow="copy.eyebrow" :title="copy.title" :text="copy.text" :level="1" />

      <div v-if="loading" class="catalog__list" aria-busy="true">
        <div v-for="n in 3" :key="n" class="catalog__skeleton"></div>
      </div>

      <div v-else-if="error" class="catalog__state" role="alert">
        <p>{{ site.catalog.error }}</p>
        <BaseButton variant="ghost" icon="fa-solid fa-rotate-right" @click="load">
          {{ site.catalog.retry }}
        </BaseButton>
      </div>

      <div v-else-if="isEmpty" class="catalog__state">
        <p>{{ copy.empty }}</p>
        <BaseButton :href="site.social.community" icon="fa-brands fa-whatsapp">
          {{ site.home.community.cta }}
        </BaseButton>
      </div>

      <div v-else class="catalog__list">
        <ProductCard
          v-for="(product, i) in products"
          :key="product.id || product.slug"
          v-reveal="i + 1"
          :product="product"
          :index="i"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.catalog {
  flex: 1;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: 2.5rem $space-section;

    @include from('md') {
      padding-top: 4rem;
    }
  }

  &__list {
    @include flex-cards(280px, 1.25rem);

    // Columnas de ancho fijo desde tablet: una tarjeta huérfana en la última
    // fila no debe estirarse más que las demás.
    @include from('md') {
      > * {
        flex: 0 1 calc((100% - 1.25rem) / 2);
      }
    }

    @include from('lg') {
      > * {
        flex: 0 1 calc((100% - 2.5rem) / 3);
      }
    }
  }

  &__skeleton {
    height: 24rem;
    border-radius: $radius-md;
    background: $sand;
    animation: catalog-pulse 1.4s ease-in-out infinite alternate;
  }

  &__state {
    @include flex(column, flex-start, flex-start, 1.2rem);
    background: $sand;
    border-radius: $radius-md;
    padding: 2rem 1.6rem;
    color: $ink-soft;
    max-width: 40rem;
  }
}

@keyframes catalog-pulse {
  to {
    opacity: 0.45;
  }
}
</style>
