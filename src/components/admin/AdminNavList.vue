<script setup lang="ts">
import { adminCopy } from '@/config/admin'
import { useAdminNav } from '@/composables/admin/useAdminNav'

// La misma lista sirve a la barra lateral (desktop) y al cajón "Más" (celular).
const emit = defineEmits<{ navigate: [] }>()
const { items, isActive, logout } = useAdminNav()
</script>

<template>
  <nav class="nav-list" aria-label="Secciones del panel">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="nav-list__link"
      :class="{ 'nav-list__link--active': isActive(item) }"
      @click="emit('navigate')"
    >
      <i :class="item.icon"></i>
      <span>{{ item.label }}</span>
    </RouterLink>

    <div class="nav-list__foot">
      <RouterLink to="/" class="nav-list__link" @click="emit('navigate')">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
        <span>{{ adminCopy.backToSite }}</span>
      </RouterLink>
      <button class="nav-list__link" @click="logout">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>{{ adminCopy.logout }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.nav-list {
  @include flex(column, stretch, flex-start, 0.2rem);
  flex: 1;

  &__link {
    @include flex(row, center, flex-start, 0.85rem);
    min-height: 48px;
    padding: 0 0.9rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    text-align: left;
    @include transition;

    i {
      flex: 0 0 20px;
      text-align: center;
      color: $ink-muted;
    }

    &:hover {
      background: $sand;
      color: $ink;
    }

    &--active {
      background: $accent-soft;
      color: $accent-deep;

      i {
        color: $accent-deep;
      }
    }
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.2rem);
    margin-top: auto;
    padding-top: 0.8rem;
    border-top: 1px solid $line;
  }
}
</style>
