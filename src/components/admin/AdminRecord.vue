<script setup lang="ts">
// Una "fila" del panel. En el celular es una tarjeta apilada; en pantallas
// anchas los datos se acomodan en línea. Nunca una tabla con scroll horizontal.
defineProps<{ muted?: boolean }>()
</script>

<template>
  <article class="record" :class="{ 'record--muted': muted }">
    <header class="record__head">
      <div class="record__title">
        <slot name="title" />
      </div>
      <div v-if="$slots.badge" class="record__badge">
        <slot name="badge" />
      </div>
    </header>

    <div v-if="$slots.default" class="record__data">
      <slot />
    </div>

    <footer v-if="$slots.actions" class="record__actions">
      <slot name="actions" />
    </footer>
  </article>
</template>

<style scoped lang="scss">
.record {
  @include card;
  @include flex(column, stretch, flex-start, 0.85rem);
  padding: 1rem;

  @include from('md') {
    padding: 1.1rem 1.35rem;
  }

  &--muted {
    background: $paper;
  }

  &__head {
    @include flex(row, flex-start, space-between, 0.75rem);
  }

  &__title {
    flex: 1;
    min-width: 0;
    font-weight: 700;
    color: $ink;
    line-height: 1.35;
    overflow-wrap: anywhere;

    :deep(small) {
      display: block;
      font-size: $text-sm;
      font-weight: 400;
      color: $ink-soft;
    }
  }

  &__data {
    @include flex(row, flex-start, flex-start, 0.75rem 1.5rem);
    flex-wrap: wrap;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    padding-top: 0.85rem;
    border-top: 1px solid $line;
  }
}
</style>
