<script setup lang="ts">
import { computed } from 'vue'
import AdminRecord from './AdminRecord.vue'
import AdminDatum from './AdminDatum.vue'
import AdminBadge from './AdminBadge.vue'
import {
  accessSourceLabels,
  accessStatusLabels,
  accessStatusTones,
  adminCopy,
} from '@/config/admin'
import { accessStatus, formatDateEc, refProduct, refUser } from '@/utils/adminFormat'
import type { AdminAccess } from '@/types/admin'

const props = defineProps<{ access: AdminAccess }>()
const emit = defineEmits<{ revoke: [access: AdminAccess]; edit: [access: AdminAccess] }>()

const user = computed(() => refUser(props.access.user))
const product = computed(() => refProduct(props.access.product))
const status = computed(() => accessStatus(props.access))
</script>

<template>
  <AdminRecord :muted="status !== 'vigente'">
    <template #title>
      {{ user.name || user.email || 'Alumno' }}
      <small v-if="user.name">{{ user.email }}</small>
    </template>
    <template #badge>
      <AdminBadge :tone="accessStatusTones[status]">{{ accessStatusLabels[status] }}</AdminBadge>
    </template>

    <AdminDatum label="Producto">{{ product.title || '—' }}</AdminDatum>
    <AdminDatum label="Origen">{{ accessSourceLabels[access.source] || access.source }}</AdminDatum>
    <AdminDatum label="Vence">
      {{ access.expiresAt ? formatDateEc(access.expiresAt) : adminCopy.access.neverLabel }}
    </AdminDatum>
    <AdminDatum v-if="access.revokedAt" label="Revocado el">{{
      formatDateEc(access.revokedAt)
    }}</AdminDatum>
    <AdminDatum v-if="access.note" label="Nota" wide>{{ access.note }}</AdminDatum>

    <template #actions>
      <button class="btn btn--ghost adm-btn-sm" @click="emit('edit', access)">
        <i class="fa-regular fa-calendar"></i>
        Editar vencimiento
      </button>
      <button
        v-if="status !== 'revocado'"
        class="btn btn--danger adm-btn-sm"
        @click="emit('revoke', access)"
      >
        <i class="fa-solid fa-ban"></i>
        Revocar
      </button>
    </template>
  </AdminRecord>
</template>
