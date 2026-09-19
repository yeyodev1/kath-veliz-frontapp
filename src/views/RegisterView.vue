<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { useNextRoute } from '@/composables/useNextRoute'
import { isEmail } from '@/utils/validate'
import AuthShell from '@/components/ui/AuthShell.vue'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormMessage from '@/components/ui/FormMessage.vue'
import type { ApiError } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const { nextQuery, isCheckout, destination } = useNextRoute()

const copy = site.auth.register
const form = reactive({ name: '', email: '', phone: '', password: '' })
const errors = reactive({ name: '', email: '', password: '' })
const loading = ref(false)
const failure = ref('')

function validate(): boolean {
  errors.name = form.name.trim() ? '' : site.forms.required
  errors.email = isEmail(form.email) ? '' : site.forms.invalidEmail
  errors.password = form.password.length >= 8 ? '' : site.forms.shortPassword
  return !errors.name && !errors.email && !errors.password
}

async function submit() {
  failure.value = ''
  if (!validate()) return
  loading.value = true
  try {
    const user = await userStore.register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      phone: form.phone.trim() || undefined,
    })
    toast.success(`${site.auth.welcome}, ${user.name || user.email}`)
    router.replace(destination())
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
    :title="copy.title"
    :text="isCheckout ? site.auth.login.forCheckout : copy.text"
  >
    <form class="form" novalidate @submit.prevent="submit">
      <BaseField
        id="register-name"
        v-model="form.name"
        :label="site.forms.name"
        autocomplete="name"
        required
        :error="errors.name"
      />
      <BaseField
        id="register-email"
        v-model="form.email"
        :label="site.forms.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        required
        :error="errors.email"
      />
      <BaseField
        id="register-phone"
        v-model="form.phone"
        :label="site.forms.phoneOptional"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        :placeholder="site.forms.phonePlaceholder"
      />
      <BaseField
        id="register-password"
        v-model="form.password"
        :label="site.forms.password"
        type="password"
        autocomplete="new-password"
        required
        :hint="site.forms.passwordHint"
        :error="errors.password"
      />

      <FormMessage v-if="failure">{{ failure }}</FormMessage>

      <BaseButton type="submit" :loading="loading" block>
        {{ loading ? copy.loading : copy.cta }}
      </BaseButton>

      <p class="form__switch">
        {{ copy.hasAccount }}
        <RouterLink :to="{ name: 'Login', query: nextQuery }" class="link">{{
          copy.login
        }}</RouterLink>
      </p>
    </form>
  </AuthShell>
</template>

<style scoped lang="scss">
.form {
  @include flex(column, stretch, flex-start, 1rem);

  &__switch {
    font-size: $text-sm;
    color: $ink-soft;
    text-align: center;
  }
}
</style>
