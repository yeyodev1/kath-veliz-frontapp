<script setup lang="ts">
import { computed } from 'vue'
import StateBlock from '@/components/student/StateBlock.vue'
import { studentCopy } from '@/config/student'
import { PAYPHONE_CONTAINER_ID, type PayphoneBoxStatus } from '@/composables/usePayphoneBox'

const props = defineProps<{
  status: PayphoneBoxStatus
  timeLeft: string
  secondsLeft: number
  retrying: boolean
  error: string
}>()

defineEmits<{ retry: []; edit: [] }>()

const copy = studentCopy.checkout.pay
// El último minuto se marca: es cuando conviene avisar que hay que apurarse.
const urgent = computed(() => props.secondsLeft <= 60)
</script>

<template>
  <section class="paybox" aria-labelledby="paybox-title">
    <header class="paybox__head">
      <h2 id="paybox-title" class="paybox__title">{{ copy.title }}</h2>
      <p class="paybox__secure">
        <i class="fa-solid fa-lock" aria-hidden="true"></i> {{ copy.secure }}
      </p>
    </header>

    <p
      v-if="status === 'ready'"
      class="paybox__timer"
      :class="{ 'paybox__timer--urgent': urgent }"
      role="timer"
    >
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      <span>{{ copy.timer }}</span>
      <strong>{{ timeLeft }}</strong>
    </p>

    <StateBlock v-if="status === 'loading' || retrying" loading compact :text="copy.loadingBox" />

    <StateBlock
      v-else-if="status === 'expired'"
      icon="fa-hourglass-end"
      tone="warning"
      compact
      :title="copy.expiredTitle"
      :text="copy.expiredText"
    >
      <template #actions>
        <button class="btn btn--primary" type="button" @click="$emit('retry')">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.retry }}
        </button>
      </template>
    </StateBlock>

    <StateBlock
      v-else-if="status === 'error'"
      icon="fa-triangle-exclamation"
      tone="danger"
      compact
      :title="copy.errorTitle"
      :text="copy.errorText"
    >
      <template #actions>
        <button class="btn btn--primary" type="button" @click="$emit('retry')">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.retry }}
        </button>
      </template>
    </StateBlock>

    <p v-if="error" class="paybox__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
    </p>

    <!-- Siempre en el DOM mientras dure este paso: Payphone renderiza acá por id.
         Vue no le pone hijos, así que lo que inserte Payphone no se pisa. -->
    <div
      v-show="status === 'ready' && !retrying"
      :id="PAYPHONE_CONTAINER_ID"
      class="paybox__box"
    ></div>

    <button v-if="!retrying" class="paybox__edit" type="button" @click="$emit('edit')">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ copy.edit }}
    </button>
  </section>
</template>

<style scoped lang="scss">
.paybox {
  @include flex(column, stretch, flex-start, 1rem);
  min-width: 0;

  &__title {
    @include display($text-xl, 600);
  }

  &__secure {
    margin-top: 0.4rem;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $success;
      margin-right: 0.25rem;
    }
  }

  &__timer {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    padding: 0.65rem 0.85rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    color: $ink;
    background: $info-bg;

    strong {
      margin-left: auto;
      font-size: $text-base;
      font-variant-numeric: tabular-nums;
    }

    &--urgent {
      background: $warning-bg;
    }
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
  }

  &__box {
    width: 100%;
    min-width: 0;
    min-height: 12rem;
  }

  &__edit {
    align-self: flex-start;
    padding: 0.5rem 0;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    @include transition(color);

    &:hover {
      color: $accent-deep;
    }
  }
}
</style>
