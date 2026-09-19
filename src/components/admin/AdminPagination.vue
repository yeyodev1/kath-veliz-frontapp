<script setup lang="ts">
defineProps<{ page: number; pages: number; total?: number }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav v-if="pages > 1" class="pagination" aria-label="Paginación">
    <button
      class="adm-icon-btn"
      :disabled="page <= 1"
      aria-label="Página anterior"
      @click="emit('change', page - 1)"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <span class="pagination__label">
      Página {{ page }} de {{ pages }}
      <small v-if="total !== undefined">{{ total }} en total</small>
    </span>
    <button
      class="adm-icon-btn"
      :disabled="page >= pages"
      aria-label="Página siguiente"
      @click="emit('change', page + 1)"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
  @include flex(row, center, center, 1rem);
  padding-block: 0.5rem;

  &__label {
    @include flex(column, center, center);
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;

    small {
      font-size: $text-xs;
      font-weight: 400;
      color: $ink-muted;
    }
  }
}
</style>
