<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'

// Las fotos profesionales aún no existen. Si la imagen no carga, queda un
// bloque de color de marca con el monograma: se ve intencional, no roto.
withDefaults(
  defineProps<{
    src: string
    /** Encuadre vertical para pantallas angostas (opcional). */
    srcMobile?: string
    alt: string
    tone?: 'forest' | 'sand' | 'clay'
    ratio?: 'portrait' | 'square' | 'wide'
    eager?: boolean
  }>(),
  { tone: 'forest', ratio: 'portrait' },
)

const failed = ref(false)
</script>

<template>
  <figure class="photo" :class="[`photo--${tone}`, `photo--${ratio}`]">
    <picture v-if="!failed && src">
      <source v-if="srcMobile" :srcset="srcMobile" media="(max-width: 767px)" />
      <img
        :src="src"
        :alt="alt"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : undefined"
        decoding="async"
        @error="failed = true"
      />
    </picture>
    <div v-else class="photo__fallback" role="img" :aria-label="alt">
      <img :src="site.logo.mark" alt="" class="photo__mark" />
    </div>
  </figure>
</template>

<style scoped lang="scss">
.photo {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: $radius-lg;
  background: $accent;

  &--portrait {
    aspect-ratio: 4 / 5;
  }

  &--square {
    aspect-ratio: 1;
  }

  &--wide {
    aspect-ratio: 16 / 10;
  }

  &--sand {
    background: $sand;
  }

  &--clay {
    background: $clay-soft;
  }

  picture,
  picture img {
    display: block;
    width: 100%;
    height: 100%;
  }

  picture img {
    object-fit: cover;
    // Las fotos son retratos: al recortar, que mande la cara y no la cintura.
    object-position: center 22%;
  }

  &__fallback {
    @include flex(row, center, center);
    width: 100%;
    height: 100%;
    // Trama de líneas finas para que el bloque no se vea plano.
    background-image: repeating-linear-gradient(
      135deg,
      rgba($paper, 0.06) 0 1px,
      transparent 1px 14px
    );
  }

  &__mark {
    width: 46%;
    max-width: 220px;
    border-radius: 50%;
    // La marca viene sobre crema: multiply la funde con el fondo claro y,
    // sobre verde, el filtro la deja en crema.
    mix-blend-mode: multiply;
  }

  &--forest &__mark {
    mix-blend-mode: normal;
    box-shadow: 0 0 0 10px rgba($paper, 0.08);
  }
}
</style>
