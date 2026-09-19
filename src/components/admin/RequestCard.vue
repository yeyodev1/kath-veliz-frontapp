<script setup lang="ts">
import { ref } from 'vue'
import AdminRecord from './AdminRecord.vue'
import AdminDatum from './AdminDatum.vue'
import AdminBadge from './AdminBadge.vue'
import { requestStatusLabels, requestStatusTones } from '@/config/admin'
import { formatDateEc } from '@/utils/adminFormat'
import type { ServiceRequest } from '@/types/admin'

const props = defineProps<{ request: ServiceRequest }>()
const emit = defineEmits<{ approve: [request: ServiceRequest]; reject: [request: ServiceRequest] }>()

// Las pendientes llegan abiertas: son las que Kath tiene que leer para decidir.
const showAnswers = ref(props.request.status === 'pending')
</script>

<template>
  <AdminRecord :muted="request.status !== 'pending'">
    <template #title>
      {{ request.name }}
      <small>{{ request.email }}</small>
    </template>
    <template #badge>
      <AdminBadge :tone="requestStatusTones[request.status]">
        {{ requestStatusLabels[request.status] || request.status }}
      </AdminBadge>
    </template>

    <AdminDatum v-if="request.phone" label="Teléfono">
      <a :href="`tel:${request.phone}`">{{ request.phone }}</a>
    </AdminDatum>
    <AdminDatum v-if="request.createdAt" label="Llegó el">{{ formatDateEc(request.createdAt) }}</AdminDatum>
    <AdminDatum v-if="request.adminNote" label="Tu nota" wide>{{ request.adminNote }}</AdminDatum>

    <div class="request__answers">
      <button class="request__toggle" :aria-expanded="showAnswers" @click="showAnswers = !showAnswers">
        <i :class="showAnswers ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
        {{ showAnswers ? 'Ocultar respuestas' : `Ver respuestas (${request.answers.length})` }}
      </button>
      <dl v-if="showAnswers" class="request__list">
        <div v-for="(item, index) in request.answers" :key="index" class="request__item">
          <dt>{{ item.question }}</dt>
          <dd>{{ item.answer || '—' }}</dd>
        </div>
        <p v-if="!request.answers.length" class="adm-muted">No respondió ninguna pregunta.</p>
      </dl>
    </div>

    <template v-if="request.status === 'pending'" #actions>
      <button class="btn btn--primary adm-btn-sm" @click="emit('approve', request)">
        <i class="fa-solid fa-check"></i>
        Aprobar
      </button>
      <button class="btn btn--ghost adm-btn-sm" @click="emit('reject', request)">
        <i class="fa-solid fa-xmark"></i>
        Rechazar
      </button>
    </template>
  </AdminRecord>
</template>

<style scoped lang="scss">
.request {
  &__answers {
    flex: 1 1 100%;
    min-width: 0;
  }

  &__toggle {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.85rem);
    padding: 0.9rem;
    border-radius: $radius-sm;
    background: $sand;
  }

  &__item {
    dt {
      font-size: $text-xs;
      font-weight: 700;
      color: $ink-soft;
    }

    dd {
      font-size: $text-sm;
      color: $ink;
      white-space: pre-line;
      overflow-wrap: anywhere;
    }
  }
}
</style>
