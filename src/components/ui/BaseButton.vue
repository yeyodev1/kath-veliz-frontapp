<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

// Una sola pieza para los tres casos (ruta interna, enlace externo, botón),
// así todos comparten estados de carga, foco y tamaño táctil.
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'dark' | 'ghost' | 'light'
    to?: RouteLocationRaw
    href?: string
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
    block?: boolean
    icon?: string
    iconRight?: string
  }>(),
  { variant: 'primary', type: 'button' },
)

const classes = computed(() => ['btn', `btn--${props.variant}`, { 'btn--block': props.block }])
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <i v-if="icon" :class="icon" aria-hidden="true"></i>
    <slot />
    <i v-if="iconRight" :class="iconRight" aria-hidden="true"></i>
  </RouterLink>

  <a v-else-if="href" :href="href" :class="classes" target="_blank" rel="noopener">
    <i v-if="icon" :class="icon" aria-hidden="true"></i>
    <slot />
    <i v-if="iconRight" :class="iconRight" aria-hidden="true"></i>
  </a>

  <button v-else :type="type" :class="classes" :disabled="disabled || loading" :aria-busy="loading">
    <i v-if="loading" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
    <i v-else-if="icon" :class="icon" aria-hidden="true"></i>
    <slot />
    <i v-if="iconRight && !loading" :class="iconRight" aria-hidden="true"></i>
  </button>
</template>
