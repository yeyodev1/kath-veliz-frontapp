<script setup lang="ts">
import BaseField from './BaseField.vue'
import BaseButton from './BaseButton.vue'
import FormMessage from './FormMessage.vue'
import { useLeadForm } from '@/composables/useLeadForm'
import { site } from '@/config/site'
import type { LeadKind } from '@/types/catalog'

// Captura de contacto reutilizable: recurso gratuito, lista de espera y
// newsletter comparten validación y envío; cambia el texto y si pide nombre.
const props = withDefaults(
  defineProps<{
    kind: LeadKind
    source: string
    productSlug?: string
    cta: string
    success: string
    askName?: boolean
    inline?: boolean
    onDark?: boolean
    idPrefix?: string
  }>(),
  { askName: true, idPrefix: 'lead' },
)

const { form, errors, sending, done, failure, submit } = useLeadForm({
  kind: props.kind,
  source: props.source,
  productSlug: props.productSlug,
  askName: props.askName,
})
</script>

<template>
  <div class="lead" :class="{ 'lead--dark': onDark }">
    <Transition name="rise" mode="out-in">
      <FormMessage v-if="done" type="success">{{ success }}</FormMessage>

      <form
        v-else
        class="lead__form"
        :class="{ 'lead__form--inline': inline }"
        novalidate
        @submit.prevent="submit"
      >
        <BaseField
          v-if="askName"
          :id="`${idPrefix}-name`"
          v-model="form.name"
          :label="site.forms.name"
          :placeholder="site.forms.namePlaceholder"
          autocomplete="given-name"
          required
          :error="errors.name"
        />
        <BaseField
          :id="`${idPrefix}-email`"
          v-model="form.email"
          :label="site.forms.email"
          :placeholder="site.forms.emailPlaceholder"
          type="email"
          inputmode="email"
          autocomplete="email"
          required
          :hide-label="inline"
          :error="errors.email"
        />
        <BaseButton
          type="submit"
          :variant="onDark ? 'light' : 'primary'"
          :loading="sending"
          :block="!inline"
          class="lead__submit"
        >
          {{ sending ? site.forms.sending : cta }}
        </BaseButton>
        <FormMessage v-if="failure" class="lead__failure">{{ failure }}</FormMessage>
        <p v-if="!inline" class="lead__privacy">{{ site.forms.privacy }}</p>
      </form>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.lead {
  width: 100%;

  &__form {
    @include flex(column, stretch, flex-start, 0.9rem);

    &--inline {
      @include from('sm') {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;

        > .field {
          flex: 1 1 200px;
          width: auto;
        }

        > .lead__failure {
          flex: 1 1 100%;
        }
      }
    }
  }

  &__privacy {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &--dark {
    :deep(label),
    :deep(.field__hint) {
      color: rgba($paper, 0.85);
    }

    :deep(.field__error) {
      color: $butter;
    }

    :deep(input) {
      background: rgba($paper, 0.08);
      border-color: rgba($paper, 0.3);
      color: $paper;

      &::placeholder {
        color: rgba($paper, 0.6);
      }

      &:focus {
        border-color: $butter;
        box-shadow: 0 0 0 3px rgba($butter, 0.25);
      }
    }

    .lead__privacy {
      color: rgba($paper, 0.7);
    }
  }
}
</style>
