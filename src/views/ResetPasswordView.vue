<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import AuthShell from '@/components/ui/AuthShell.vue'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormMessage from '@/components/ui/FormMessage.vue'
import type { ApiError } from '@/types'

// Sirve para "olvidé mi contraseña" y para "define tu contraseña" (cuando el
// admin crea la cuenta al dar un acceso manual): los dos correos traen ?token=.
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const copy = site.auth.reset

const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const form = reactive({ password: '', confirm: '' })
const errors = reactive({ password: '', confirm: '' })
const loading = ref(false)
const failure = ref('')

async function submit() {
  failure.value = ''
  errors.password = form.password.length >= 8 ? '' : site.forms.shortPassword
  errors.confirm = form.password === form.confirm ? '' : site.forms.passwordMismatch
  if (errors.password || errors.confirm) return

  loading.value = true
  try {
    const user = await userStore.reset(token.value, form.password)
    toast.success(copy.success)
    router.replace(user.accountType === 'admin' ? '/admin' : '/mis-cursos')
  } catch (e) {
    failure.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell :eyebrow="copy.eyebrow" :title="copy.title" :text="token ? copy.text : undefined">
    <div v-if="!token" class="form">
      <FormMessage>{{ copy.missingToken }}</FormMessage>
      <BaseButton to="/recuperar" block>{{ copy.requestNew }}</BaseButton>
    </div>

    <form v-else class="form" novalidate @submit.prevent="submit">
      <BaseField
        id="reset-password"
        v-model="form.password"
        :label="site.forms.password"
        type="password"
        autocomplete="new-password"
        required
        :hint="site.forms.passwordHint"
        :error="errors.password"
      />
      <BaseField
        id="reset-confirm"
        v-model="form.confirm"
        :label="site.forms.passwordConfirm"
        type="password"
        autocomplete="new-password"
        required
        :error="errors.confirm"
      />

      <FormMessage v-if="failure">
        {{ failure }}
        <RouterLink to="/recuperar" class="link">{{ copy.requestNew }}</RouterLink>
      </FormMessage>

      <BaseButton type="submit" :loading="loading" block>
        {{ loading ? site.forms.sending : copy.cta }}
      </BaseButton>
    </form>
  </AuthShell>
</template>

<style scoped lang="scss">
.form {
  @include flex(column, stretch, flex-start, 1rem);
}
</style>
