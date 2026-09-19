<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { useProductDetail } from '@/composables/useProductDetail'
import { vReveal } from '@/composables/useReveal'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductHero from '@/components/product/ProductHero.vue'
import ProductAction from '@/components/product/ProductAction.vue'
import ProductChecklist from '@/components/product/ProductChecklist.vue'
import ProductSyllabus from '@/components/product/ProductSyllabus.vue'
import ProductExtras from '@/components/product/ProductExtras.vue'
import ServiceSteps from '@/components/product/ServiceSteps.vue'
import PreviewModal from '@/components/product/PreviewModal.vue'
import type { LessonPreview } from '@/types/catalog'

// Una sola plantilla para todo el catálogo. Lo que cambia según `type` y
// `saleMode` está encapsulado en ProductAction; acá solo se decide qué
// secciones tienen datos para pintarse.
const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const { product, loading, error, notFound, reload } = useProductDetail(slug)

const previewLesson = ref<LessonPreview | null>(null)
const labels = site.product
const hasLessons = computed(() => product.value?.modules.some((m) => m.lessons.length > 0) ?? false)
</script>

<template>
  <div class="product">
    <div v-if="loading" class="product__state" aria-busy="true">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
      <span class="visually-hidden">Cargando</span>
    </div>

    <div v-else-if="!product" class="product__state">
      <h1 class="product__state-title">
        {{ notFound ? labels.notFound.title : site.catalog.error }}
      </h1>
      <p v-if="notFound">{{ labels.notFound.text }}</p>
      <p v-else-if="error">{{ error }}</p>
      <div class="product__state-actions">
        <BaseButton
          v-if="!notFound"
          variant="ghost"
          icon="fa-solid fa-rotate-right"
          @click="reload"
        >
          {{ site.catalog.retry }}
        </BaseButton>
        <BaseButton to="/cursos">{{ labels.notFound.cta }}</BaseButton>
      </div>
    </div>

    <template v-else>
      <ProductHero :product="product" />

      <div
        class="product__layout"
        :class="{ 'product__layout--service': product.type === 'service' }"
      >
        <div
          class="product__aside"
          :class="{ 'product__aside--sticky': product.type !== 'service' }"
        >
          <ProductAction :key="product.slug" :product="product" />
        </div>

        <div class="product__content">
          <p v-if="product.description" v-reveal class="product__description">
            {{ product.description }}
          </p>

          <ServiceSteps v-if="product.type === 'service'" />
          <a
            v-if="product.type === 'service' && product.saleMode !== 'closed'"
            href="#accion"
            class="btn btn--primary product__jump"
          >
            {{ labels.service.anchor }} <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
          </a>

          <ProductChecklist
            v-if="product.highlights.length"
            :title="labels.sections.highlights"
            :items="product.highlights"
          />
          <ProductChecklist
            v-if="product.audience.length"
            :title="labels.sections.audience"
            :items="product.audience"
            variant="star"
          />
          <ProductSyllabus
            v-if="hasLessons"
            :modules="product.modules"
            @preview="previewLesson = $event"
          />
          <ProductExtras :sessions="product.nextLiveSessions" :faqs="product.faqs" />
        </div>
      </div>

      <PreviewModal :lesson="previewLesson" @close="previewLesson = null" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.product {
  @include flex(column, stretch, flex-start);
  flex: 1;

  &__state {
    @include container(640px);
    @include flex(column, center, center, 0.9rem);
    flex: 1;
    min-height: 50vh;
    padding-block: $space-section;
    text-align: center;
    color: $ink-soft;

    > i {
      font-size: 1.6rem;
      color: $accent;
    }
  }

  &__state-title {
    @include display($display-sm);
    color: $ink;
  }

  &__state-actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }

  &__layout {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: 2rem $space-section;

    @include from('lg') {
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: clamp(2.5rem, 5vw, 5rem);
      padding-top: 3.5rem;
    }
  }

  // La asesoría es la excepción: primero se explica y la encuesta (larga) va al final.
  &__layout--service {
    @include until('lg') {
      flex-direction: column-reverse;
    }
  }

  &__jump {
    align-self: flex-start;
    margin-top: -1.5rem;

    @include from('lg') {
      display: none;
    }
  }

  // En móvil la tarjeta de acción va primero: precio y botón a la vista sin scroll largo.
  &__aside {
    width: 100%;

    @include from('lg') {
      flex: 0 0 24rem;

      &--sticky {
        position: sticky;
        top: calc(var(--header-h) + 1.5rem);
      }
    }
  }

  &__content {
    @include flex(column, stretch, flex-start, $space-xl);
    flex: 1;
    min-width: 0;
  }

  &__description {
    font-size: $text-lg;
    line-height: 1.7;
    color: $ink-soft;
    white-space: pre-line;
    max-width: 42rem;

    // La primera línea del texto largo entra como un titular pequeño.
    &::first-line {
      font-family: $font-display;
      font-size: 1.35em;
      color: $ink;
    }
  }
}
</style>
