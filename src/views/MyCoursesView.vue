<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import StateBlock from '@/components/student/StateBlock.vue'
import CourseCard from '@/components/student/CourseCard.vue'
import { studentService } from '@/services/student.service'
import { useUserStore } from '@/stores/user'
import { useProductDownload } from '@/composables/useProductDownload'
import { studentCopy } from '@/config/student'
import type { ApiError } from '@/types'
import type { MyProduct } from '@/types/student'

const copy = studentCopy.myCourses
const userStore = useUserStore()
const { downloadingSlug, download } = useProductDownload()

const items = ref<MyProduct[]>([])
const loading = ref(true)
const error = ref('')

const firstName = computed(() => (userStore.user?.name || '').trim().split(/\s+/)[0] || '')
// Primero lo que se puede usar; lo bloqueado queda al final, pero no desaparece.
const sorted = computed(() =>
  [...items.value].sort(
    (a, b) => Number(a.access.status !== 'vigente') - Number(b.access.status !== 'vigente'),
  ),
)

async function load() {
  loading.value = true
  error.value = ''
  try {
    items.value = await studentService.myProducts()
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="my-courses">
    <header class="my-courses__head">
      <p class="my-courses__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="my-courses__title">{{ copy.title }}</h1>
      <p v-if="firstName && items.length" class="my-courses__greeting">
        {{ copy.greeting(firstName) }}
      </p>
    </header>

    <StateBlock v-if="loading" loading :text="copy.loading" />

    <StateBlock
      v-else-if="error"
      icon="fa-triangle-exclamation"
      tone="danger"
      :title="copy.errorTitle"
      :text="error"
    >
      <template #actions>
        <button class="btn btn--primary" type="button" @click="load">{{ copy.retry }}</button>
      </template>
    </StateBlock>

    <StateBlock
      v-else-if="!items.length"
      icon="fa-graduation-cap"
      :title="copy.emptyTitle"
      :text="copy.emptyText"
    >
      <template #actions>
        <RouterLink class="btn btn--primary" to="/cursos">{{ copy.emptyCta }}</RouterLink>
      </template>
    </StateBlock>

    <div v-else class="my-courses__list">
      <CourseCard
        v-for="item in sorted"
        :key="item.product.slug"
        :item="item"
        :downloading="downloadingSlug === item.product.slug"
        @download="download"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.my-courses {
  @include container;
  @include flex(column, stretch, flex-start, $space-md);
  flex: 1;
  padding-block: $space-lg $space-xl;

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 600);
    margin-top: 0.4rem;
  }

  &__greeting {
    margin-top: 0.5rem;
    color: $ink-soft;
  }

  &__list {
    @include flex-cards(300px, 1.25rem);

    // Con una o dos tarjetas, flex-grow las estiraría a todo el ancho.
    > * {
      @include from('md') {
        max-width: 420px;
      }
    }
  }
}
</style>
