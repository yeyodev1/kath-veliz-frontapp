<script setup lang="ts">
import { computed } from 'vue'
import { studentCopy } from '@/config/student'
import { formatCents } from '@/utils/money'
import type { StudentProduct } from '@/types/student'

const props = defineProps<{
  product: StudentProduct
  subtotalCents: number
  discountCents: number
  totalCents: number
}>()

const copy = studentCopy.checkout

const accessNote = computed(() => {
  if (props.product.type === 'service') return ''
  const days = props.product.accessDurationDays
  return days ? copy.accessDays(days) : copy.lifetime
})
</script>

<template>
  <aside class="summary" aria-labelledby="summary-title">
    <h2 id="summary-title" class="summary__heading">{{ copy.summaryTitle }}</h2>

    <div class="summary__product">
      <div class="summary__cover">
        <img v-if="product.cover" :src="product.cover.url" :alt="''" loading="lazy" />
        <i v-else class="fa-solid fa-book-open" aria-hidden="true"></i>
      </div>
      <div class="summary__info">
        <p class="summary__type">{{ copy.types[product.type] }}</p>
        <p class="summary__title">{{ product.title }}</p>
        <p v-if="accessNote" class="summary__note">
          <i class="fa-regular fa-clock" aria-hidden="true"></i> {{ accessNote }}
        </p>
      </div>
    </div>

    <slot />

    <dl class="summary__lines">
      <div class="summary__line">
        <dt>{{ copy.subtotal }}</dt>
        <dd>{{ formatCents(subtotalCents) }}</dd>
      </div>
      <div v-if="discountCents > 0" class="summary__line summary__line--discount">
        <dt>{{ copy.discount }}</dt>
        <dd>−{{ formatCents(discountCents) }}</dd>
      </div>
      <div class="summary__line summary__line--total">
        <dt>{{ copy.total }}</dt>
        <dd>{{ formatCents(totalCents) }}</dd>
      </div>
    </dl>
  </aside>
</template>

<style scoped lang="scss">
.summary {
  @include card;
  @include flex(column, stretch, flex-start, 1.1rem);
  padding: 1.25rem;
  background: $sand;
  border-color: transparent;

  @include from('md') {
    padding: 1.6rem;
  }

  &__heading {
    @include eyebrow;
  }

  &__product {
    @include flex(row, center, flex-start, 0.9rem);
  }

  &__cover {
    @include flex(row, center, center);
    flex: 0 0 4.5rem;
    width: 4.5rem;
    height: 4.5rem;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $surface;
    color: $ink-muted;
    font-size: 1.3rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__type {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-lg;
    line-height: 1.2;
    color: $ink;
  }

  &__note {
    margin-top: 0.25rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__lines {
    @include flex(column, stretch, flex-start, 0.5rem);
    padding-top: 1rem;
    border-top: 1px solid $line;
  }

  &__line {
    @include flex(row, baseline, space-between, 1rem);
    font-size: $text-sm;
    color: $ink-soft;

    dd {
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    &--discount dd {
      color: $success;
      font-weight: 600;
    }

    &--total {
      margin-top: 0.35rem;
      padding-top: 0.75rem;
      border-top: 1px solid $line;
      font-size: $text-base;
      font-weight: 600;
      color: $ink;

      dd {
        font-family: $font-display;
        font-size: $text-xl;
      }
    }
  }
}
</style>
