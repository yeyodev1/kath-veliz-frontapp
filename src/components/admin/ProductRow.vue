<script setup lang="ts">
import { computed } from 'vue'
import AdminBadge from './AdminBadge.vue'
import { adminCopy, productTypeLabels, saleModeLabels } from '@/config/admin'
import { formatCents } from '@/utils/adminFormat'
import type { AdminProduct } from '@/types/admin'

const props = defineProps<{ product: AdminProduct }>()
const emit = defineEmits<{ togglePublish: []; remove: [] }>()

// Solo cursos y descargables tienen lecciones (el descargable, su video tutorial).
const hasContent = computed(() => ['course', 'download'].includes(props.product.type))

const duration = computed(() =>
  props.product.accessDurationDays
    ? `${props.product.accessDurationDays} días de acceso`
    : adminCopy.products.lifetime,
)
</script>

<template>
  <article class="product-row" :class="{ 'product-row--draft': !product.isPublished }">
    <div class="product-row__main">
      <div class="product-row__cover">
        <img v-if="product.cover" :src="product.cover.url" alt="" loading="lazy" />
        <i v-else class="fa-regular fa-image"></i>
      </div>
      <div class="product-row__info">
        <h2 class="product-row__title">{{ product.title }}</h2>
        <p class="product-row__price">
          {{ product.type === 'free' ? 'Gratis' : formatCents(product.priceCents) }}
          <span v-if="product.type !== 'free'">· {{ duration }}</span>
        </p>
        <div class="product-row__badges">
          <AdminBadge :tone="product.isPublished ? 'success' : 'neutral'">
            {{ product.isPublished ? 'Publicado' : 'Borrador' }}
          </AdminBadge>
          <AdminBadge tone="info">{{ productTypeLabels[product.type] || product.type }}</AdminBadge>
          <AdminBadge v-if="product.saleMode !== 'open'" tone="warning">
            {{ saleModeLabels[product.saleMode] }}
          </AdminBadge>
        </div>
      </div>
    </div>

    <footer class="product-row__actions">
      <RouterLink
        :to="{ name: 'AdminProductEdit', params: { id: product.id } }"
        class="btn btn--ghost adm-btn-sm"
      >
        <i class="fa-solid fa-pen"></i>
        Editar
      </RouterLink>
      <RouterLink
        v-if="hasContent"
        :to="{ name: 'AdminProductEdit', params: { id: product.id }, query: { tab: 'contenido' } }"
        class="btn btn--ghost adm-btn-sm"
      >
        <i class="fa-solid fa-layer-group"></i>
        Contenido
      </RouterLink>
      <button class="btn btn--ghost adm-btn-sm" @click="emit('togglePublish')">
        <i :class="product.isPublished ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
        {{ product.isPublished ? 'Despublicar' : 'Publicar' }}
      </button>
      <button
        class="adm-icon-btn adm-icon-btn--danger"
        aria-label="Borrar producto"
        @click="emit('remove')"
      >
        <i class="fa-solid fa-trash"></i>
      </button>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.product-row {
  @include card;
  @include flex(column, stretch, flex-start, 0.9rem);
  padding: 1rem;

  &--draft {
    background: $paper;
  }

  &__main {
    @include flex(row, flex-start, flex-start, 0.9rem);
  }

  &__cover {
    @include flex(row, center, center);
    flex: 0 0 84px;
    width: 84px;
    aspect-ratio: 4 / 3;
    border-radius: $radius-sm;
    background: $sand;
    color: $ink-muted;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.35rem);
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 700;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  &__price {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;

    span {
      font-weight: 400;
      color: $ink-muted;
    }
  }

  &__badges {
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    padding-top: 0.9rem;
    border-top: 1px solid $line;
  }
}
</style>
