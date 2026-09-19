<script setup lang="ts">
import { onMounted } from 'vue'
import StateBlock from '@/components/student/StateBlock.vue'
import CheckoutSummary from '@/components/checkout/CheckoutSummary.vue'
import CheckoutCoupon from '@/components/checkout/CheckoutCoupon.vue'
import CheckoutIdentity from '@/components/checkout/CheckoutIdentity.vue'
import CheckoutSteps from '@/components/checkout/CheckoutSteps.vue'
import CheckoutTrust from '@/components/checkout/CheckoutTrust.vue'
import CheckoutPayBox from '@/components/checkout/CheckoutPayBox.vue'
import { CHECKOUT_MAIN_ID, useCheckout } from '@/composables/useCheckout'
import { studentCopy } from '@/config/student'
import { formatCents } from '@/utils/money'

const copy = studentCopy.checkout
const {
  slug,
  identity,
  product,
  loading,
  loadError,
  requestInvalid,
  purchasable,
  step,
  creating,
  error,
  alreadyOwned,
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

    <StateBlock
      v-else-if="requestInvalid"
      icon="fa-link-slash"
      tone="warning"
      :title="copy.requestInvalid.title"
      :text="copy.requestInvalid.text"
    >
      <template #actions>
        <RouterLink class="btn btn--primary" :to="`/p/${slug}`">{{
          copy.backToProduct
        }}</RouterLink>
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
        <CheckoutSteps :current="step === 'paying' ? 2 : 1" />
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

        <div :id="CHECKOUT_MAIN_ID" class="checkout__main">
          <form v-if="step === 'form'" class="checkout__form" novalidate @submit.prevent="confirm">
            <CheckoutIdentity
              v-model="identity.form"
              :mode="identity.mode.value"
              :errors="identity.errors"
              :user="identity.user.value"
              :request="identity.request.value"
              :mismatch="identity.mismatch.value"
              :notice="identity.notice.value"
              :failure="identity.failure.value"
              :disabled="creating"
              @touch="identity.touch"
              @switch="identity.switchTo"
              @edit="identity.startEdit"
              @switch-account="identity.switchAccount"
            />

            <p v-if="error" class="checkout__error" role="alert">
              <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
            </p>

            <button
              class="btn btn--primary checkout__submit"
              type="submit"
              :disabled="creating || identity.mismatch.value"
            >
              <i v-if="creating" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
              <template v-if="creating">
                {{ identity.busy.value ? copy.signingIn : copy.creating }}
              </template>
              <template v-else-if="totalCents === 0">{{ copy.confirmFree }}</template>
              <template v-else>{{ copy.confirm }} · {{ formatCents(totalCents) }}</template>
            </button>

            <CheckoutTrust :type="product.type" />
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
  padding-block: $space-md $space-xl;

  @include from('md') {
    padding-block: $space-lg $space-xl;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__head {
    @include flex(column, stretch, flex-start, 0.85rem);
  }

  // En 360 px el título compite con el resumen y el formulario: va más contenido.
  &__title {
    @include display($text-xl, 600);
    margin-top: -0.45rem;

    @include from('md') {
      font-size: $display-sm;
    }
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
    // Al pasar al pago se hace scroll hasta acá; que el header fijo no lo tape.
    scroll-margin-top: calc(var(--header-h, 4.5rem) + 1rem);
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

  // Un solo botón principal por paso: ancho completo y 52 px de alto para el pulgar.
  &__submit {
    width: 100%;
    min-height: 3.25rem;
    padding-block: 1rem;
    font-size: 1rem;
  }
}
</style>
