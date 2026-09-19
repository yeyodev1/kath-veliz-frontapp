<script setup lang="ts">
// Aviso dentro de un formulario. role=alert/status para que el lector de
// pantalla lo anuncie apenas aparece.
withDefaults(defineProps<{ type?: 'error' | 'success' | 'info' }>(), { type: 'error' })

const icons = {
  error: 'fa-solid fa-circle-exclamation',
  success: 'fa-solid fa-circle-check',
  info: 'fa-solid fa-circle-info',
}
</script>

<template>
  <p class="message" :class="`message--${type}`" :role="type === 'error' ? 'alert' : 'status'">
    <i :class="icons[type]" aria-hidden="true"></i>
    <span><slot /></span>
  </p>
</template>

<style scoped lang="scss">
.message {
  @include flex(row, flex-start, flex-start, 0.6rem);
  font-size: $text-sm;
  line-height: 1.45;
  padding: 0.8rem 0.95rem;
  border-radius: $radius-sm;

  i {
    margin-top: 0.2em;
  }

  &--error {
    color: $danger;
    background: $danger-bg;
  }

  &--success {
    color: $success;
    background: $success-bg;
  }

  &--info {
    color: $ink-soft;
    background: $sand;
  }
}
</style>
