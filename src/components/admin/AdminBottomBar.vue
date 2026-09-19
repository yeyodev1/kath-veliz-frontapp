<script setup lang="ts">
import { adminCopy } from '@/config/admin'
import { useAdminNav } from '@/composables/admin/useAdminNav'

// Barra inferior del celular: las cuatro secciones de todos los días a un
// toque del pulgar; el resto se abre con "Más".
const emit = defineEmits<{ more: [] }>()
const { primary, isActive, moreActive } = useAdminNav()
</script>

<template>
  <nav class="bottom-bar" aria-label="Secciones principales">
    <RouterLink
      v-for="item in primary"
      :key="item.to"
      :to="item.to"
      class="bottom-bar__item"
      :class="{ 'bottom-bar__item--active': isActive(item) }"
    >
      <i :class="item.icon"></i>
      <span>{{ item.short }}</span>
    </RouterLink>
    <button
      class="bottom-bar__item"
      :class="{ 'bottom-bar__item--active': moreActive }"
      @click="emit('more')"
    >
      <i class="fa-solid fa-ellipsis"></i>
      <span>{{ adminCopy.more }}</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.bottom-bar {
  @include flex(row, stretch, space-between);
  flex: 0 0 auto;
  background: $surface;
  border-top: 1px solid $line;
  padding-bottom: env(safe-area-inset-bottom);

  @include from('md') {
    display: none;
  }

  &__item {
    @include flex(column, center, center, 0.2rem);
    flex: 1 1 0;
    min-width: 0;
    min-height: 58px;
    padding: 0.4rem 0.15rem;
    font-size: 0.66rem;
    font-weight: 600;
    color: $ink-muted;

    i {
      font-size: 1.1rem;
    }

    span {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &--active {
      color: $accent-deep;
    }
  }
}
</style>
