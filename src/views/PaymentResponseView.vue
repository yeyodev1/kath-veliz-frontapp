<script setup lang="ts">
import { computed, onMounted } from 'vue'
import StateBlock from '@/components/student/StateBlock.vue'
import { usePaymentConfirmation } from '@/composables/usePaymentConfirmation'
import { useProductDownload } from '@/composables/useProductDownload'
import { studentCopy } from '@/config/student'
import { formatCents } from '@/utils/money'

const copy = studentCopy.response
const { state, result, errorMessage, loginTarget, confirm } = usePaymentConfirmation()

const product = computed(() => result.value?.product ?? null)
const { downloadingSlug, download } = useProductDownload()

// De vuelta al checkout: la sesión sigue abierta, así que los datos ya están cargados.
// Una asesoría necesita además el mismo ?solicitud= del enlace de pago.
const retryTo = computed(() => {
  if (!product.value) return '/cursos'
  const request = result.value?.order?.serviceRequest
  return {
    path: `/checkout/${product.value.slug}`,
    query: request ? { solicitud: request } : {},
  }
})
const paidText = computed(() =>
  product.value?.type === 'service'
    ? copy.paidServiceText
    : copy.paidText(product.value?.title || 'tu compra'),
)

// Se confirma apenas carga, sin clic: Payphone reversa el cobro a los 5 minutos.
onMounted(confirm)
</script>

<template>
  <section class="response">
    <StateBlock
      v-if="state === 'confirming'"
      loading
      :title="copy.confirmingTitle"
      :text="copy.confirmingText"
    />

    <StateBlock
      v-else-if="state === 'paid'"
      icon="fa-circle-check"
      tone="success"
      :eyebrow="copy.paidEyebrow"
      :title="copy.paidTitle"
      :text="paidText"
    >
      <p class="response__mail">
        <i class="fa-regular fa-envelope" aria-hidden="true"></i>
        {{ product?.type === 'service' ? copy.emailSentService : copy.emailSent }}
      </p>
      <p v-if="result?.order?.totalCents" class="response__total">
        {{ copy.orderTotal }}: <strong>{{ formatCents(result.order.totalCents) }}</strong>
      </p>
      <template #actions>
        <RouterLink
          v-if="product?.type === 'course'"
          class="btn btn--primary response__cta"
          :to="`/aprender/${product.slug}`"
        >
          <i class="fa-solid fa-play" aria-hidden="true"></i> {{ copy.paidCourseCta }}
        </RouterLink>
        <RouterLink
          v-else-if="product?.type === 'service'"
          class="btn btn--primary response__cta"
          to="/"
        >
          {{ copy.paidServiceCta }}
        </RouterLink>
        <template v-else-if="product">
          <button
            class="btn btn--primary response__cta"
            type="button"
            :disabled="!!downloadingSlug"
            @click="download(product.slug)"
          >
            <i
              class="fa-solid"
              :class="downloadingSlug ? 'fa-spinner fa-spin' : 'fa-download'"
              aria-hidden="true"
            ></i>
            {{ downloadingSlug ? copy.paidDownloading : copy.paidDownloadCta }}
          </button>
          <RouterLink class="btn btn--ghost response__cta" :to="`/aprender/${product.slug}`">
            <i class="fa-solid fa-play" aria-hidden="true"></i> {{ copy.paidTutorialCta }}
          </RouterLink>
        </template>
        <RouterLink v-else class="btn btn--primary response__cta" to="/mis-cursos">
          {{ copy.myCourses }}
        </RouterLink>
      </template>
    </StateBlock>

    <StateBlock
      v-else-if="state === 'canceled'"
      icon="fa-circle-xmark"
      tone="warning"
      :title="copy.canceledTitle"
      :text="copy.canceledText"
    >
      <template #actions>
        <RouterLink class="btn btn--primary response__cta" :to="retryTo">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.retry }}
        </RouterLink>
      </template>
    </StateBlock>

    <StateBlock
      v-else-if="state === 'login'"
      icon="fa-user-lock"
      tone="warning"
      :title="copy.loginTitle"
      :text="copy.loginText"
    >
      <template #actions>
        <RouterLink class="btn btn--primary" :to="loginTarget">{{ copy.loginCta }}</RouterLink>
      </template>
    </StateBlock>

    <StateBlock
      v-else-if="state === 'missing'"
      icon="fa-link-slash"
      :title="copy.missingTitle"
      :text="copy.missingText"
    >
      <template #actions>
        <RouterLink class="btn btn--primary" to="/mis-cursos">{{ copy.myCourses }}</RouterLink>
      </template>
    </StateBlock>

    <StateBlock
      v-else
      icon="fa-triangle-exclamation"
      tone="danger"
      :title="copy.failedTitle"
      :text="errorMessage || copy.failedText"
    >
      <p v-if="errorMessage" class="response__note">{{ copy.failedText }}</p>
      <template #actions>
        <!-- Sin respuesta del API no se sabe si el pago pasó: primero se reintenta confirmar. -->
        <button v-if="!product" class="btn btn--primary" type="button" @click="confirm">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.retry }}
        </button>
        <RouterLink v-else class="btn btn--primary response__cta" :to="retryTo">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.retry }}
        </RouterLink>
        <RouterLink class="btn btn--ghost" to="/mis-cursos">{{ copy.myCourses }}</RouterLink>
      </template>
    </StateBlock>
  </section>
</template>

<style scoped lang="scss">
.response {
  @include container(720px);
  @include flex(column, center, center);
  flex: 1;
  padding-block: $space-xl;

  &__mail {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;

    i {
      margin-right: 0.3rem;
      color: $success;
    }
  }

  // El siguiente paso es uno solo y se ve: ancho completo en móvil, 52 px de alto.
  &__cta {
    width: 100%;
    min-height: 3.25rem;

    @include from('sm') {
      width: auto;
      min-width: 16rem;
    }
  }

  &__total,
  &__note {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__total strong {
    color: $ink;
    font-variant-numeric: tabular-nums;
  }
}
</style>
