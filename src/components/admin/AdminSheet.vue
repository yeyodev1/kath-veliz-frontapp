<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

// Contenedor de formularios: en el celular sube desde abajo y ocupa casi toda
// la pantalla (los botones quedan al alcance del pulgar); en desktop es un
// cuadro centrado.
const props = defineProps<{ open: boolean; title: string; subtitle?: string }>()
const emit = defineEmits<{ close: [] }>()

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (open) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  },
  { immediate: true },
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet" @click.self="emit('close')">
        <section class="sheet__box" role="dialog" aria-modal="true" :aria-label="title">
          <header class="sheet__head">
            <div class="sheet__titles">
              <h2 class="sheet__title">{{ title }}</h2>
              <p v-if="subtitle" class="sheet__subtitle">{{ subtitle }}</p>
            </div>
            <button class="adm-icon-btn" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <div class="sheet__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="sheet__footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.sheet {
  position: fixed;
  inset: 0;
  z-index: 180;
  background: $overlay;
  @include flex(column, stretch, flex-end);

  @include from('md') {
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  &__box {
    @include flex(column, stretch, flex-start);
    background: $paper;
    width: 100%;
    max-height: 92dvh;
    border-radius: $radius-md $radius-md 0 0;
    box-shadow: $shadow-lg;
    overflow: hidden;

    @include from('md') {
      max-width: 600px;
      max-height: 88vh;
      border-radius: $radius-md;
    }
  }

  &__head {
    @include flex(row, flex-start, space-between, 1rem);
    padding: 1.1rem 1.1rem 0.9rem;
    border-bottom: 1px solid $line;
    background: $surface;
  }

  &__titles {
    flex: 1;
    min-width: 0;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.25rem;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 1.1rem;
  }

  &__footer {
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
    padding: 0.9rem 1.1rem calc(0.9rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;
    background: $surface;

    :deep(.btn) {
      flex: 1 1 140px;
      min-height: 48px;
    }
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;

  .sheet__box {
    transition: transform 0.3s $ease;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__box {
    transform: translateY(24px);
  }
}
</style>
