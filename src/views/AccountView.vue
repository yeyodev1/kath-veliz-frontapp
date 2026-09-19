<script setup lang="ts">
import { site } from '@/config/site'
import { useAccount } from '@/composables/useAccount'
import { useSiteNav } from '@/composables/useSiteNav'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormMessage from '@/components/ui/FormMessage.vue'

const copy = site.account
const { logout, userStore } = useSiteNav()
const {
  profile,
  profileErrors,
  savingProfile,
  profileFailure,
  saveProfile,
  password,
  passwordErrors,
  savingPassword,
  passwordFailure,
  savePassword,
} = useAccount()
</script>

<template>
  <section class="account">
    <header class="account__head">
      <p class="account__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="account__title">{{ userStore.user?.name || userStore.user?.email }}</h1>
      <p class="account__email">{{ userStore.user?.email }}</p>
      <div class="account__actions">
        <BaseButton to="/mis-cursos" icon="fa-solid fa-graduation-cap">{{ copy.myCourses }}</BaseButton>
        <BaseButton variant="ghost" icon="fa-solid fa-right-from-bracket" @click="logout">
          {{ copy.logout }}
        </BaseButton>
      </div>
    </header>

    <div class="account__panels">
      <form class="panel" novalidate @submit.prevent="saveProfile">
        <h2 class="panel__title">{{ copy.profileTitle }}</h2>
        <p class="panel__text">{{ copy.profileText }}</p>

        <BaseField
          id="account-name"
          v-model="profile.name"
          :label="site.forms.name"
          autocomplete="name"
          required
          :error="profileErrors.name"
        />
        <BaseField
          id="account-phone"
          v-model="profile.phone"
          :label="site.forms.phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          :placeholder="site.forms.phonePlaceholder"
        />
        <BaseField
          id="account-document"
          v-model="profile.documentId"
          :label="site.forms.documentId"
          inputmode="numeric"
          autocomplete="off"
          :hint="copy.documentIdHint"
          :error="profileErrors.documentId"
        />

        <FormMessage v-if="profileFailure">{{ profileFailure }}</FormMessage>
        <BaseButton type="submit" :loading="savingProfile">{{ copy.save }}</BaseButton>
      </form>

      <form class="panel" novalidate @submit.prevent="savePassword">
        <h2 class="panel__title">{{ copy.passwordTitle }}</h2>

        <!-- Campo oculto de usuario: los gestores de contraseñas lo usan para asociar la clave nueva. -->
        <input
          type="email"
          class="visually-hidden"
          autocomplete="username"
          :value="userStore.user?.email"
          tabindex="-1"
          aria-hidden="true"
          readonly
        />
        <BaseField
          id="account-current"
          v-model="password.current"
          :label="copy.currentPassword"
          type="password"
          autocomplete="current-password"
          required
          :error="passwordErrors.current"
        />
        <BaseField
          id="account-next"
          v-model="password.next"
          :label="copy.newPassword"
          type="password"
          autocomplete="new-password"
          required
          :hint="site.forms.passwordHint"
          :error="passwordErrors.next"
        />

        <FormMessage v-if="passwordFailure">{{ passwordFailure }}</FormMessage>
        <BaseButton type="submit" variant="dark" :loading="savingPassword">
          {{ copy.changePassword }}
        </BaseButton>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.account {
  @include container(1000px);
  @include flex(column, stretch, flex-start, 2.5rem);
  padding-block: 2.5rem $space-section;

  &__head {
    @include flex(column, flex-start, flex-start, 0.5rem);
  }

  &__eyebrow {
    @include eyebrow;
    color: $clay-deep;
  }

  &__title {
    @include display($display-md);
    overflow-wrap: anywhere;
  }

  &__email {
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  &__panels {
    @include flex-cards(300px, 1.25rem);
    align-items: flex-start;
  }
}

.panel {
  @include flex(column, stretch, flex-start, 1rem);
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-md;
  padding: 1.6rem 1.4rem;

  @include from('md') {
    padding: 2rem 1.8rem;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: -0.5rem;
  }

  .btn {
    align-self: flex-start;
  }
}
</style>
