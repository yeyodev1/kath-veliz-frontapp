<script setup lang="ts">
import { toRef } from 'vue'
import { site } from '@/config/site'
import { useSurveyForm } from '@/composables/useSurveyForm'
import BaseField from '@/components/ui/BaseField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormMessage from '@/components/ui/FormMessage.vue'
import type { ProductDetail } from '@/types/catalog'

// Las preguntas no están escritas acá: llegan en product.surveyQuestions y
// Kath las edita desde el panel.
const props = defineProps<{ product: ProductDetail }>()

const { contact, answers, errors, sending, done, failure, submit } = useSurveyForm(toRef(props, 'product'))
const copy = site.product.service
</script>

<template>
  <Transition name="rise" mode="out-in">
    <FormMessage v-if="done" type="success">{{ copy.success }}</FormMessage>

    <form v-else class="survey" novalidate @submit.prevent="submit">
      <BaseField
        id="survey-name"
        v-model="contact.name"
        :label="site.forms.name"
        autocomplete="name"
        required
        :error="errors.name"
      />
      <BaseField
        id="survey-email"
        v-model="contact.email"
        :label="site.forms.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        required
        :error="errors.email"
      />
      <BaseField
        id="survey-phone"
        v-model="contact.phone"
        :label="site.forms.phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        :placeholder="site.forms.phonePlaceholder"
        required
        :error="errors.phone"
      />

      <BaseField
        v-for="(question, i) in product.surveyQuestions"
        :id="`survey-q-${i}`"
        :key="`${i}-${question.label}`"
        v-model="answers[i]"
        :label="question.label"
        :as="question.type === 'text' ? 'input' : question.type"
        :options="question.options"
        :placeholder="question.type === 'select' ? site.forms.selectPlaceholder : undefined"
        :required="question.required"
        :error="errors.answers[i]"
      />

      <FormMessage v-if="failure">{{ failure }}</FormMessage>

      <BaseButton type="submit" :loading="sending" block>
        {{ sending ? site.forms.sending : copy.cta }}
      </BaseButton>
      <p class="survey__privacy">{{ site.forms.privacy }}</p>
    </form>
  </Transition>
</template>

<style scoped lang="scss">
.survey {
  @include flex(column, stretch, flex-start, 1rem);

  &__privacy {
    font-size: $text-xs;
    color: $ink-muted;
    text-align: center;
  }
}
</style>
