<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import { site } from '@/config/site'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useSiteNav } from '@/composables/useSiteNav'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { links, userLinks, logout, userStore } = useSiteNav()
const closeButton = ref<HTMLButtonElement | null>(null)

useBodyScroll(toRef(props, 'open'))

// Al abrir, el foco entra al panel; Escape lo cierra.
watch(
  () => props.open,
  async (open) => {
    if (!open) return
    await nextTick()
    closeButton.value?.focus()
  },
)

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close')
}

function signOut() {
  emit('close')
  logout()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="drawer" @click.self="emit('close')">
        <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menú">
          <div class="drawer__top">
            <img :src="site.logo.full" :alt="site.logo.alt" class="drawer__logo" />
            <button
              ref="closeButton"
              type="button"
              class="drawer__close"
              :aria-label="site.navUser.closeMenu"
              @click="emit('close')"
            >
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <nav class="drawer__nav" aria-label="Menú móvil">
            <RouterLink
              v-for="(link, i) in links"
              :key="link.to"
              :to="link.to"
              class="drawer__link"
              :style="{ '--i': i }"
            >
              <span class="drawer__num" aria-hidden="true">0{{ i + 1 }}</span>
              {{ link.label }}
            </RouterLink>
          </nav>

          <div class="drawer__user">
            <template v-if="userStore.isAuthenticated">
              <RouterLink
                v-for="link in userLinks"
                :key="link.to"
                :to="link.to"
                class="drawer__user-link"
              >
                <i :class="link.icon" aria-hidden="true"></i> {{ link.label }}
              </RouterLink>
              <button type="button" class="drawer__user-link" @click="signOut">
                <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
                {{ site.navUser.logout }}
              </button>
            </template>
            <RouterLink v-else to="/login" class="btn btn--primary btn--block">
              {{ site.navUser.login }}
            </RouterLink>
          </div>

          <div class="drawer__social">
            <a :href="site.social.instagram" target="_blank" rel="noopener" aria-label="Instagram">
              <i class="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
            <a :href="site.social.tiktok" target="_blank" rel="noopener" aria-label="TikTok">
              <i class="fa-brands fa-tiktok" aria-hidden="true"></i>
            </a>
            <a
              :href="site.social.community"
              target="_blank"
              rel="noopener"
              :aria-label="site.footer.community"
            >
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.drawer {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: $overlay;
  display: flex;
  justify-content: flex-end;

  &__panel {
    @include flex(column, stretch, flex-start, 1.5rem);
    width: min(88vw, 380px);
    height: 100%;
    overflow-y: auto;
    background: $paper;
    padding: 0.6rem 1.4rem 2rem;
    box-shadow: $shadow-lg;
  }

  &__top {
    @include flex(row, center, space-between);
    height: var(--header-h);
  }

  &__logo {
    height: 46px;
    width: auto;
  }

  &__close {
    width: 2.75rem;
    height: 2.75rem;
    margin-right: -0.6rem;
    font-size: 1.3rem;
    border-radius: $radius-sm;
  }

  &__nav {
    @include flex(column, stretch, flex-start);
  }

  &__link {
    @include flex(row, baseline, flex-start, 0.9rem);
    @include display(2.1rem, 500);
    padding: 0.85rem 0;
    border-bottom: 1px solid $line;
    animation: drawer-link 0.5s $ease both;
    animation-delay: calc(var(--i) * 60ms + 120ms);

    &.router-link-exact-active {
      font-style: italic;
      color: $accent;
    }
  }

  &__num {
    font-family: $font-condensed;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: $clay-deep;
  }

  &__user {
    @include flex(column, stretch, flex-start, 0.2rem);
    margin-top: auto;
  }

  &__user-link {
    @include flex(row, center, flex-start, 0.75rem);
    font-weight: 500;
    padding: 0.75rem 0;
    text-align: left;

    i {
      width: 1.2rem;
      color: $sage;
    }
  }

  &__social {
    @include flex(row, center, flex-start, 0.6rem);

    a {
      @include flex(row, center, center);
      width: 2.75rem;
      height: 2.75rem;
      border: 1px solid $line;
      border-radius: 50%;
      font-size: 1.05rem;
      @include transition;

      &:hover {
        background: $accent;
        border-color: $accent;
        color: $paper;
      }
    }
  }
}

@keyframes drawer-link {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;

  .drawer__panel {
    transition: transform 0.4s $ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .drawer__panel {
    transform: translateX(100%);
  }
}
</style>
