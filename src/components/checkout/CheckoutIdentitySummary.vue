<script setup lang="ts">
import { studentCopy } from '@/config/student'
import { displayPhone } from '@/utils/validate'
import type { BuyerUser } from '@/types/student'

// Con sesión y datos completos no se vuelve a preguntar nada: se muestran y ya.
defineProps<{ user: BuyerUser; disabled: boolean }>()
defineEmits<{ edit: [] }>()

const copy = studentCopy.checkout.identity
</script>

<template>
  <div class="who">
    <div class="who__head">
      <h2 id="identity-title" class="who__title">{{ copy.title }}</h2>
      <button type="button" class="who__edit" :disabled="disabled" @click="$emit('edit')">
        <i class="fa-solid fa-pen" aria-hidden="true"></i> {{ copy.edit }}
      </button>
    </div>

    <ul class="who__list">
      <li><i class="fa-regular fa-user" aria-hidden="true"></i> {{ user.name }}</li>
      <li><i class="fa-regular fa-envelope" aria-hidden="true"></i> {{ user.email }}</li>
      <li>
        <i class="fa-solid fa-mobile-screen" aria-hidden="true"></i>
        {{ displayPhone(user.phone) }}
      </li>
      <li><i class="fa-regular fa-id-card" aria-hidden="true"></i> {{ user.documentId }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.who {
  @include card;
  @include flex(column, stretch, flex-start, 0.5rem);
  padding: 1rem 1.1rem;

  &__head {
    @include flex(row, center, space-between, 1rem);
  }

  &__title {
    @include display($text-lg, 600);
  }

  &__edit {
    @include flex(row, center, center, 0.4rem);
    min-height: 2.75rem;
    padding-inline: 0.5rem;
    margin-right: -0.5rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;

    &:hover {
      color: $ink;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    @include flex(column, stretch, flex-start, 0.4rem);
    font-size: $text-sm;
    color: $ink-soft;

    li {
      @include flex(row, baseline, flex-start, 0.6rem);
      overflow-wrap: anywhere;
    }

    i {
      flex: 0 0 1rem;
      text-align: center;
      color: $ink-muted;
    }
  }
}
</style>
