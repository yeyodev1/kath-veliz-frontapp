<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { isEmail } from '@/utils/validate'
import AuthShell from '@/components/ui/AuthShell.vue'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormMessage from '@/components/ui/FormMessage.vue'
import type { ApiError } from '@/types'

const userStore = useUserStore()
const copy = site.auth.forgot

const email = ref('')
const emailError = ref('')
const loading = ref(false)
const sent = ref(false)
const failure = ref('')

async function submit() {
  failure.value = ''
  emailError.value = isEmail(email.value) ? '' : site.forms.invalidEmail
  if (emailError.value) return
  loading.value = true
  try {
    await userStore.forgot(email.value.trim().toLowerCase())
    // El mismo mensaje exista o no la cuenta: no se revela quién está registrado.
    sent.value = true
  } catch (e) {
    failure.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell
    :eyebrow="copy.eyebrow"
    :title="sent ? copy.sentTitle : copy.title"
    :text="sent ? undefined : copy.text"
  >
    <div v-if="sent" class="form">
      <FormMessage type="success">{{ copy.sent }}</FormMessage>
      <BaseButton to="/login" variant="ghost" block>{{ copy.back }}</BaseButton>
    </div>

    <form v-else class="form" novalidate @submit.prevent="submit">
      <BaseField
        id="forgot-email"
        v-model="email"
        :label="site.forms.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        required
        :error="emailError"
      />
      <FormMessage v-if="failure">{{ failure }}</FormMessage>
      <BaseButton type="submit" :loading="loading" block>
        {{ loading ? site.forms.sending : copy.cta }}
      </BaseButton>
      <RouterLink to="/login" class="link form__back">{{ copy.back }}</RouterLink>
    </form>
  </AuthShell>
</template>

<style scoped lang="scss">
.form {
  @include flex(column, stretch, flex-start, 1rem);

  &__back {
    align-self: center;
    font-size: $text-sm;
  }
}
</style>
