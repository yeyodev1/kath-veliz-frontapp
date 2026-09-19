<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

// El panel admin trae su propio layout. Cualquier otra ruta que quiera la
// pantalla entera (p. ej. el reproductor) puede pedirlo con `meta.bare`.
const bare = computed(() => route.meta.bare === true || route.path.startsWith('/admin'))

// El guard solo restaura la sesión en rutas protegidas; el header la necesita
// también en las públicas para mostrar "Mis cursos".
onMounted(() => {
  if (userStore.hasToken) userStore.restore()
})
</script>

<template>
  <div class="app">
    <a href="#contenido" class="app__skip">{{ site.navUser.skip }}</a>
    <TheHeader v-if="!bare" />
    <main id="contenido" class="app__main" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter v-if="!bare" />
    <ToastList />
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    outline: none;
  }

  // Visible solo al recibir foco con teclado.
  &__skip {
    position: absolute;
    left: 1rem;
    top: -4rem;
    z-index: 400;
    background: $ink;
    color: $paper;
    font-size: $text-sm;
    font-weight: 600;
    padding: 0.7rem 1rem;
    border-radius: $radius-sm;

    &:focus {
      top: 0.6rem;
    }
  }
}
</style>
