<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseField from '@/components/ui/BaseField.vue'
import FormMessage from '@/components/ui/FormMessage.vue'
import CheckoutIdentitySummary from '@/components/checkout/CheckoutIdentitySummary.vue'
import { studentCopy } from '@/config/student'
import {
  identityFieldId,
  type IdentityField,
  type IdentityMode,
} from '@/composables/useCheckoutIdentity'
import type { BuyerUser, ServiceRequestPrefill } from '@/types/student'

const props = defineProps<{
  mode: IdentityMode
  errors: Record<IdentityField, string>
  user: BuyerUser | null
  request: ServiceRequestPrefill | null
  mismatch: boolean
  notice: string
  failure: string
  disabled: boolean
}>()

const emit = defineEmits<{
  touch: [field: IdentityField]
  switch: [mode: 'register' | 'login']
  edit: []
  switchAccount: []
}>()

const form = defineModel<Record<IdentityField, string>>({ required: true })
const copy = studentCopy.checkout.identity

// La cédula se escribe con teclado numérico; el pasaporte lleva letras.
const passport = ref(false)

const hint = computed(() => {
  if (props.mode === 'login') return copy.loginHint
  return props.mode === 'profile' ? copy.profileHint : copy.registerHint
})
const emailHint = computed(() =>
  props.request && props.mode !== 'profile'
    ? copy.requestHint(props.request.email)
    : copy.emailHint,
)

/** Valida al salir del campo; pasar del input al ojo de la contraseña no cuenta como salir. */
function leave(field: IdentityField, event: FocusEvent) {
  const wrapper = event.currentTarget as HTMLElement
  if (event.relatedTarget instanceof Node && wrapper.contains(event.relatedTarget)) return
  emit('touch', field)
}
</script>

<template>
  <section class="identity" aria-labelledby="identity-title">
    <FormMessage v-if="mismatch && request" type="error">
      {{ copy.requestMismatch(request.email) }}
      <button type="button" class="identity__link" @click="$emit('switchAccount')">
        {{ copy.requestSwitch }}
      </button>
    </FormMessage>

    <CheckoutIdentitySummary
      v-if="mode === 'summary' && user"
      :user="user"
      :disabled="disabled"
      @edit="$emit('edit')"
    />

    <fieldset v-else class="identity__fields" :disabled="disabled">
      <legend id="identity-title" class="identity__title">
        {{ mode === 'login' ? copy.loginTitle : copy.title }}
      </legend>
      <p class="identity__hint">{{ hint }}</p>

      <FormMessage v-if="notice" type="info">{{ notice }}</FormMessage>

      <p v-if="mode === 'profile' && user" class="identity__account">
        <i class="fa-regular fa-envelope" aria-hidden="true"></i> {{ user.email }}
      </p>

      <BaseField
        v-if="mode === 'register' || mode === 'profile'"
        :id="identityFieldId('name')"
        v-model="form.name"
        :label="copy.name"
        autocomplete="name"
        :error="errors.name"
        @focusout="leave('name', $event)"
      />

      <BaseField
        v-if="mode === 'register' || mode === 'login'"
        :id="identityFieldId('email')"
        v-model="form.email"
        :label="copy.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        :hint="mode === 'register' ? emailHint : undefined"
        :error="errors.email"
        @focusout="leave('email', $event)"
      />

      <div v-if="mode !== 'login'" class="identity__pair">
        <BaseField
          :id="identityFieldId('phone')"
          v-model="form.phone"
          :label="copy.phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          :placeholder="copy.phonePlaceholder"
          :error="errors.phone"
          @focusout="leave('phone', $event)"
        />
        <div class="identity__document">
          <BaseField
            :id="identityFieldId('documentId')"
            v-model="form.documentId"
            :label="copy.documentId"
            :inputmode="passport ? 'text' : 'numeric'"
            autocomplete="off"
            :placeholder="passport ? '' : copy.documentPlaceholder"
            :hint="copy.documentHint"
            :error="errors.documentId"
            @focusout="leave('documentId', $event)"
          />
          <button
            v-if="!passport"
            type="button"
            class="identity__link identity__link--small"
            @click="passport = true"
          >
            {{ copy.usePassport }}
          </button>
        </div>
      </div>

      <BaseField
        v-if="mode === 'register' || mode === 'login'"
        :id="identityFieldId('password')"
        v-model="form.password"
        :label="mode === 'register' ? copy.newPassword : copy.password"
        type="password"
        :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
        :hint="mode === 'register' ? copy.newPasswordHint : undefined"
        :error="errors.password"
        @focusout="leave('password', $event)"
      />

      <FormMessage v-if="failure">{{ failure }}</FormMessage>

      <p v-if="mode === 'register'" class="identity__switch">
        <button type="button" class="identity__link" @click="$emit('switch', 'login')">
          {{ copy.haveAccount }}
        </button>
      </p>
      <p v-else-if="mode === 'login'" class="identity__switch">
        <RouterLink class="identity__link" to="/recuperar">{{ copy.forgot }}</RouterLink>
        <button type="button" class="identity__link" @click="$emit('switch', 'register')">
          {{ copy.noAccount }}
        </button>
      </p>
    </fieldset>
  </section>
</template>

<style scoped lang="scss">
.identity {
  @include flex(column, stretch, flex-start, 1rem);
  min-width: 0;

  &__fields {
    @include flex(column, stretch, flex-start, 1rem);
    border: none;
    min-width: 0;
  }

  &__title {
    @include display($text-xl, 600);
    padding: 0;
    margin-bottom: 0.35rem;
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__account {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    overflow-wrap: anywhere;

    i {
      margin-right: 0.3rem;
      color: $ink-muted;
    }
  }

  &__pair {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('sm') {
      flex-direction: row;
      align-items: flex-start;

      > * {
        flex: 1;
        min-width: 0;
      }
    }
  }

  &__document {
    @include flex(column, flex-start, flex-start);
  }

  &__switch {
    @include flex(row, center, space-between, 0.25rem 1rem);
    flex-wrap: wrap;
  }

  // Enlaces discretos, pero con 44 px de alto para el dedo.
  &__link {
    @include flex(row, center, flex-start);
    display: inline-flex;
    min-height: 2.75rem;
    font-size: $text-sm;
    font-weight: 600;
    text-align: left;
    text-decoration: underline;
    text-underline-offset: 3px;
    color: $accent-deep;

    &:hover {
      color: $ink;
    }

    &--small {
      font-size: $text-xs;
      font-weight: 500;
      color: $ink-soft;
    }
  }
}
</style>
