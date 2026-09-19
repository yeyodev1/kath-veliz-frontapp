<script setup lang="ts">
import { onMounted } from 'vue'
import StateBlock from '@/components/student/StateBlock.vue'
import CheckoutSummary from '@/components/checkout/CheckoutSummary.vue'
import CheckoutCoupon from '@/components/checkout/CheckoutCoupon.vue'
import CheckoutBuyer from '@/components/checkout/CheckoutBuyer.vue'
import CheckoutPayBox from '@/components/checkout/CheckoutPayBox.vue'
import { useCheckout } from '@/composables/useCheckout'
import { studentCopy } from '@/config/student'
import { formatCents } from '@/utils/money'

const copy = studentCopy.checkout
const {
  slug,
  user,
  product,
  loading,
  loadError,
  purchasable,
  step,
  creating,
  error,
  alreadyOwned,
  buyer,
  buyerErrors,
  couponCode,
  coupon,
  couponError,
  couponLoading,
  subtotalCents,
  discountCents,
  totalCents,
  boxStatus,
  timeLeft,
  secondsLeft,
  load,
  applyCoupon,
  removeCoupon,
  confirm,
  edit,
} = useCheckout()

onMounted(load)
</script>

<template>
  <section class="checkout">
    <StateBlock v-if="loading" loading :text="copy.loading" />

    <StateBlock
      v-else-if="loadError || !product"
      icon="fa-triangle-exclamation"
      tone="danger"
      :title="loadError === 'notFound' ? copy.notFound : studentCopy.learn.errorTitle"
    >
      <template #actions>
        <button v-if="loadError === 'error'" class="btn btn--primary" type="button" @click="load">
          {{ studentCopy.learn.retry }}
        </button>
        <RouterLink class="btn btn--ghost" to="/cursos">{{
          studentCopy.response.courses
        }}</RouterLink>
      </template>
    </StateBlock>

    <StateBlock
      v-else-if="alreadyOwned"
      icon="fa-circle-check"
      tone="success"
      :title="copy.owned.title"
      :text="copy.owned.text"
    >
      <template #actions>
        <RouterLink class="btn btn--primary" to="/mis-cursos">{{ copy.owned.cta }}</RouterLink>
      </template>
    </StateBlock>

    <StateBlock v-else-if="!purchasable" icon="fa-store-slash" :title="copy.notAvailable">
      <template #actions>
        <RouterLink class="btn btn--primary" :to="`/p/${slug}`">{{
          copy.backToProduct
        }}</RouterLink>
      </template>
    </StateBlock>

    <template v-else>
      <header class="checkout__head">
        <p class="checkout__eyebrow">
          <i class="fa-solid fa-lock" aria-hidden="true"></i> {{ copy.eyebrow }}
        </p>
        <h1 class="checkout__title">{{ copy.title }}</h1>
      </header>

      <div class="checkout__layout">
        <div class="checkout__aside">
          <CheckoutSummary
            :product="product"
            :subtotal-cents="subtotalCents"
            :discount-cents="discountCents"
            :total-cents="totalCents"
          >
            <CheckoutCoupon
              v-model="couponCode"
              :applied="coupon"
              :error="couponError"
              :loading="couponLoading"
              :locked="step === 'paying' || creating"
              @apply="applyCoupon"
              @remove="removeCoupon"
            />
          </CheckoutSummary>
        </div>

        <div class="checkout__main">
          <form v-if="step === 'form'" class="checkout__form" novalidate @submit.prevent="confirm">
            <CheckoutBuyer
              v-model="buyer"
              :email="user?.email || ''"
              :errors="buyerErrors"
              :disabled="creating"
            />

            <p v-if="error" class="checkout__error" role="alert">
              <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
            </p>

            <button class="btn btn--primary checkout__submit" type="submit" :disabled="creating">
              <i v-if="creating" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
              <template v-if="creating">{{ copy.creating }}</template>
              <template v-else-if="totalCents === 0">{{ copy.confirmFree }}</template>
              <template v-else>{{ copy.confirm }} · {{ formatCents(totalCents) }}</template>
            </button>
          </form>

          <CheckoutPayBox
            v-else
            :status="boxStatus"
            :time-left="timeLeft"
            :seconds-left="secondsLeft"
            :retrying="creating"
            :error="error"
            @retry="confirm"
            @edit="edit"
          />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.checkout {
  @include container(1040px);
  @include flex(column, stretch, flex-start, $space-md);
  flex: 1;
  padding-block: $space-lg $space-xl;

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 600);
    margin-top: 0.4rem;
  }

  // En móvil el resumen va primero (qué estoy pagando) y debajo el formulario;
  // en escritorio el resumen pasa a columna lateral derecha.
  &__layout {
    @include flex(column, stretch, flex-start, $space-md);

    @include from('md') {
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: $space-lg;
    }
  }

  &__aside {
    min-width: 0;

    @include from('md') {
      flex: 0 0 38%;
      max-width: 400px;
      position: sticky;
      top: 6rem;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1.25rem);
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
  }

  &__submit {
    width: 100%;
    padding-block: 1rem;

    @include from('sm') {
      align-self: flex-start;
      width: auto;
    }
  }
}
</style>
