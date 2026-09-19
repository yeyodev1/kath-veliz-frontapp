<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { useSiteNav } from '@/composables/useSiteNav'
import HeaderDrawer from './HeaderDrawer.vue'

const route = useRoute()
const { links, userLinks, userStore } = useSiteNav()

const drawerOpen = ref(false)
const scrolled = ref(false)

// Al navegar se cierra el drawer.
watch(
  () => route.fullPath,
  () => (drawerOpen.value = false),
)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" :aria-label="`${site.name}, inicio`">
        <img :src="site.logo.full" :alt="site.logo.alt" width="107" height="60" />
      </RouterLink>

      <nav class="header__nav" aria-label="Principal">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="header__link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__user">
        <template v-if="userStore.isAuthenticated">
          <RouterLink
            v-for="link in userLinks"
            :key="link.to"
            :to="link.to"
            class="header__link header__link--user"
          >
            <i :class="link.icon" aria-hidden="true"></i> {{ link.label }}
          </RouterLink>
        </template>
        <RouterLink v-else to="/login" class="btn btn--primary header__cta">
          {{ site.navUser.login }}
        </RouterLink>
      </div>

      <button
        type="button"
        class="header__burger"
        :aria-label="site.navUser.openMenu"
        aria-haspopup="dialog"
        :aria-expanded="drawerOpen"
        @click="drawerOpen = true"
      >
        <span></span><span></span>
      </button>
    </div>

    <HeaderDrawer :open="drawerOpen" @close="drawerOpen = false" />
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba($paper, 0.94);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  @include transition(border-color);

  &--scrolled {
    border-color: $line;
  }

  &__inner {
    @include container;
    @include flex(row, center, space-between, 1rem);
    height: var(--header-h);
  }

  &__logo {
    flex-shrink: 0;
    border-radius: $radius-sm;

    img {
      height: 50px;
      width: auto;
    }
  }

  &__nav,
  &__user {
    display: none;

    @include from('lg') {
      @include flex(row, center, flex-start, 1.9rem);
    }
  }

  &__nav {
    margin-inline: auto;
  }

  &__user {
    gap: 1.3rem;
  }

  &__link {
    position: relative;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    padding: 0.5rem 0;
    @include transition(color);

    // Subrayado que crece desde la izquierda.
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.2rem;
      height: 1px;
      background: $clay;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.35s $ease;
    }

    &:hover,
    &.router-link-exact-active {
      color: $ink;

      &::after {
        transform: scaleX(1);
      }
    }

    &--user i {
      color: $sage;
      margin-right: 0.25rem;
    }
  }

  &__cta {
    min-height: 2.5rem;
    padding: 0.55rem 1.4rem;
  }

  &__burger {
    @include flex(column, center, center, 6px);
    width: 2.75rem;
    height: 2.75rem;
    margin-right: -0.5rem;
    border-radius: $radius-sm;

    span {
      display: block;
      width: 1.5rem;
      height: 1.5px;
      background: $ink;
    }

    @include from('lg') {
      display: none;
    }
  }
}
</style>
