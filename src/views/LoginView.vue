<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { useNextRoute } from '@/composables/useNextRoute'
import AuthShell from '@/components/ui/AuthShell.vue'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormMessage from '@/components/ui/FormMessage.vue'
import type { ApiError } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const { nextQuery, isCheckout, destination } = useNextRoute()

const copy = site.auth.login
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const user = await userStore.login(email.value.trim().toLowerCase(), password.value)
    toast.success(`${site.auth.welcome}, ${user.name || user.email}`)
    router.replace(destination())
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell
    :eyebrow="copy.eyebrow"
    :title="copy.title"
    :text="isCheckout ? copy.forCheckout : copy.text"
  >
    <form class="form" @submit.prevent="submit">
      <BaseField
        id="login-email"
        v-model="email"
        :label="site.forms.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        required
      />
      <BaseField
        id="login-password"
        v-model="password"
        :label="site.forms.password"
        type="password"
        autocomplete="current-password"
        required
      />
      <RouterLink to="/recuperar" class="link form__forgot">{{ copy.forgot }}</RouterLink>

      <FormMessage v-if="error">{{ error }}</FormMessage>

      <BaseButton type="submit" :loading="loading" block>
        {{ loading ? copy.loading : copy.cta }}
      </BaseButton>

      <p class="form__switch">
        {{ copy.noAccount }}
        <RouterLink :to="{ name: 'Register', query: nextQuery }" class="link">{{
          copy.register
        }}</RouterLink>
      </p>
    </form>
  </AuthShell>
</template>

<style scoped lang="scss">
.form {
  @include flex(column, stretch, flex-start, 1rem);

  &__forgot {
    align-self: flex-end;
    font-size: $text-sm;
    margin-top: -0.4rem;
  }

  &__switch {
    font-size: $text-sm;
    color: $ink-soft;
    text-align: center;
  }
}
</style>
