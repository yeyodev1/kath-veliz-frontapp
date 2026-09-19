<script setup lang="ts">
import { ref, useId } from 'vue'

// Un ítem de acordeón: botón con aria-expanded + región enlazada. La altura
// se anima con hooks de Transition porque "height: auto" no transiciona.
const props = defineProps<{ title: string; meta?: string; index?: string; startOpen?: boolean }>()

const open = ref(Boolean(props.startOpen))
const uid = useId()

function enter(el: Element) {
  const node = el as HTMLElement
  node.style.height = '0'
  // Forzar reflow para que el navegador registre el 0 antes del valor final.
  void node.offsetHeight
  node.style.height = `${node.scrollHeight}px`
}
function afterEnter(el: Element) {
  ;(el as HTMLElement).style.height = ''
}
function leave(el: Element) {
  const node = el as HTMLElement
  node.style.height = `${node.scrollHeight}px`
  void node.offsetHeight
  node.style.height = '0'
}
</script>

<template>
  <div class="accordion" :class="{ 'accordion--open': open }">
    <h3 class="accordion__heading">
      <button
        :id="`${uid}-button`"
        type="button"
        class="accordion__button"
        :aria-expanded="open"
        :aria-controls="`${uid}-panel`"
        @click="open = !open"
      >
        <span v-if="index" class="accordion__index" aria-hidden="true">{{ index }}</span>
        <span class="accordion__title">{{ title }}</span>
        <span v-if="meta" class="accordion__meta">{{ meta }}</span>
        <i class="fa-solid fa-plus accordion__icon" aria-hidden="true"></i>
      </button>
    </h3>

    <Transition name="accordion" @enter="enter" @after-enter="afterEnter" @leave="leave">
      <div
        v-show="open"
        :id="`${uid}-panel`"
        class="accordion__panel"
        role="region"
        :aria-labelledby="`${uid}-button`"
      >
        <div class="accordion__content"><slot /></div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.accordion {
  border-bottom: 1px solid $line;

  &:first-child {
    border-top: 1px solid $line;
  }

  &__button {
    @include flex(row, center, flex-start, 0.9rem);
    width: 100%;
    text-align: left;
    padding: 1.15rem 0.25rem;
    @include transition(color);

    &:hover {
      color: $accent;
    }
  }

  &__index {
    font-family: $font-display;
    font-style: italic;
    font-size: 1.5rem;
    line-height: 1;
    color: $clay;
    min-width: 1.8rem;
  }

  &__title {
    flex: 1;
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 600;
    line-height: 1.12;
  }

  &__meta {
    display: none;
    font-family: $font-condensed;
    font-size: $text-xs;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $ink-muted;
    white-space: nowrap;

    @include from('sm') {
      display: block;
    }
  }

  &__icon {
    font-size: 0.85rem;
    color: $accent;
    transition: transform 0.35s $ease;
  }

  &--open &__icon {
    transform: rotate(45deg);
  }

  &__panel {
    overflow: hidden;
  }

  &__content {
    padding: 0 0.25rem 1.4rem;
  }
}

.accordion-enter-active,
.accordion-leave-active {
  transition:
    height 0.35s $ease,
    opacity 0.3s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
}
</style>
