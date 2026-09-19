<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import '@/components/admin/admin.scss'
import AdminNavList from '@/components/admin/AdminNavList.vue'
import AdminBottomBar from '@/components/admin/AdminBottomBar.vue'
import { adminCopy } from '@/config/admin'
import { useAdminNav } from '@/composables/admin/useAdminNav'
import { useBodyScroll } from '@/composables/useBodyScroll'

const route = useRoute()
const { current, userStore } = useAdminNav()
const drawerOpen = ref(false)
const scroller = ref<HTMLElement | null>(null)

// El panel cubre toda la pantalla (tapa el header y el footer públicos sin
// tocar App.vue), así que el scroll del documento de atrás se congela.
useBodyScroll(ref(true))

// El scroll vive dentro del panel: el scrollBehavior del router no lo alcanza.
watch(
  () => route.path,
  () => {
    drawerOpen.value = false
    scroller.value?.scrollTo({ top: 0 })
  },
)
</script>

<template>
  <div class="admin">
    <aside class="admin__sidebar">
      <RouterLink to="/admin" class="admin__brand">{{ adminCopy.brand }}</RouterLink>
      <p class="admin__user">{{ userStore.user?.name || userStore.user?.email }}</p>
      <AdminNavList />
    </aside>

    <div class="admin__main">
      <header class="admin__topbar">
        <RouterLink to="/admin" class="admin__brand">{{ adminCopy.brand }}</RouterLink>
        <span class="admin__section">{{ current?.short }}</span>
      </header>

      <div ref="scroller" class="admin__content">
        <RouterView />
      </div>

      <AdminBottomBar @more="drawerOpen = true" />
    </div>

    <Transition name="fade">
      <div v-if="drawerOpen" class="admin__overlay" @click.self="drawerOpen = false">
        <div class="admin__drawer" role="dialog" aria-modal="true" aria-label="Todas las secciones">
          <header class="admin__drawer-head">
            <span class="admin__brand">{{ adminCopy.brand }}</span>
            <button class="adm-icon-btn" aria-label="Cerrar" @click="drawerOpen = false">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <AdminNavList @navigate="drawerOpen = false" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.admin {
  position: fixed;
  inset: 0;
  // Por encima del header público (100) y por debajo de modales (200) y toasts (300).
  z-index: 150;
  @include flex(row, stretch, flex-start);
  background: $paper;

  &__sidebar {
    display: none;

    @include from('md') {
      @include flex(column, stretch, flex-start, 0.4rem);
      flex: 0 0 250px;
      padding: 1.5rem 1rem;
      background: $surface;
      border-right: 1px solid $line;
      overflow-y: auto;
    }
  }

  &__brand {
    @include display($text-lg, 600);
    color: $ink;
  }

  &__user {
    font-size: $text-xs;
    color: $ink-muted;
    margin-bottom: 1rem;
    overflow-wrap: anywhere;
  }

  &__main {
    @include flex(column, stretch, flex-start);
    flex: 1;
    min-width: 0;
  }

  &__topbar {
    @include flex(row, center, space-between, 1rem);
    flex: 0 0 auto;
    min-height: 54px;
    padding: 0 1rem;
    background: $surface;
    border-bottom: 1px solid $line;

    @include from('md') {
      display: none;
    }
  }

  &__section {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $accent-deep;
  }

  &__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 1.25rem 1rem 2.5rem;

    @include from('md') {
      padding: 2.25rem 2.5rem 4rem;
    }
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 170;
    background: $overlay;
    @include flex(row, stretch, flex-end);

    @include from('md') {
      display: none;
    }
  }

  &__drawer {
    @include flex(column, stretch, flex-start, 0.8rem);
    width: min(86vw, 320px);
    padding: 1rem 0.9rem calc(1rem + env(safe-area-inset-bottom));
    background: $surface;
    overflow-y: auto;
  }

  &__drawer-head {
    @include flex(row, center, space-between, 1rem);
    padding-left: 0.5rem;
  }
}
</style>
