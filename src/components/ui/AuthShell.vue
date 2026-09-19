<script setup lang="ts">
import { site } from '@/config/site'

// Marco común de ingresar, registrarse, recuperar y restablecer: el formulario
// a la izquierda y, desde tablet, un panel verde con una frase de Kath.
defineProps<{ eyebrow: string; title: string; text?: string }>()
</script>

<template>
  <section class="auth">
    <div class="auth__main">
      <div class="auth__box">
        <p class="auth__eyebrow">{{ eyebrow }}</p>
        <h1 class="auth__title">{{ title }}</h1>
        <p v-if="text" class="auth__text">{{ text }}</p>
        <slot />
      </div>
    </div>

    <aside class="auth__aside" aria-hidden="true">
      <img :src="site.logo.mark" alt="" class="auth__mark" />
      <blockquote class="auth__quote">
        <p>{{ site.auth.aside.quote }}</p>
        <footer>{{ site.auth.aside.author }}</footer>
      </blockquote>
    </aside>
  </section>
</template>

<style scoped lang="scss">
.auth {
  display: flex;
  flex: 1;

  &__main {
    @include flex(column, center, center);
    flex: 1 1 54%;
    padding: $space-lg 1.25rem $space-xl;
  }

  &__box {
    @include flex(column, stretch, flex-start, 0.9rem);
    width: 100%;
    max-width: 26rem;
  }

  &__eyebrow {
    @include eyebrow;
    color: $clay-deep;
  }

  &__title {
    @include display($display-sm, 600);
  }

  &__text {
    color: $ink-soft;
    margin-bottom: 0.6rem;
  }

  &__aside {
    display: none;

    @include from('md') {
      @include flex(column, flex-start, space-between, 2rem);
      flex: 1 1 46%;
      background: $accent;
      color: $paper;
      padding: clamp(2rem, 5vw, 4.5rem);
      background-image: repeating-linear-gradient(
        135deg,
        rgba($paper, 0.05) 0 1px,
        transparent 1px 16px
      );
    }
  }

  &__mark {
    width: 4.5rem;
    border-radius: 50%;
  }

  &__quote {
    p {
      @include display($display-sm, 500);
      font-style: italic;
      line-height: 1.12;
      max-width: 22ch;
    }

    footer {
      @include eyebrow;
      color: $butter;
      margin-top: 1.4rem;
    }
  }
}
</style>
