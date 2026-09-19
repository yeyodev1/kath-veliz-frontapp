<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminRecord from '@/components/admin/AdminRecord.vue'
import AdminDatum from '@/components/admin/AdminDatum.vue'
import AdminBadge from '@/components/admin/AdminBadge.vue'
import { adminLeadsService } from '@/services/adminLeads.service'
import { useAdminList } from '@/composables/admin/useAdminList'
import { useToastStore } from '@/stores/toast'
import { adminCopy, leadKindLabels } from '@/config/admin'
import { formatDateEc, refProduct } from '@/utils/adminFormat'
import type { ApiError } from '@/types'

const copy = adminCopy.leads
const toast = useToastStore()
const list = useAdminList((query) => adminLeadsService.list(query), { source: '', kind: '' })
const exporting = ref(false)

// El CSV respeta los mismos filtros que se están viendo en pantalla.
async function exportCsv() {
  if (exporting.value) return
  exporting.value = true
  try {
    await adminLeadsService.exportCsv({ source: list.filters.source, kind: list.filters.kind })
    toast.success('Archivo descargado.')
  } catch (err) {
    toast.error((err as ApiError).message || adminCopy.genericError)
  } finally {
    exporting.value = false
  }
}

onMounted(list.load)
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle">
      <button class="btn btn--dark" :disabled="exporting" @click="exportCsv">
        <i :class="exporting ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-file-arrow-down'"></i>
        {{ copy.export }}
      </button>
    </AdminPageHeader>

    <div class="adm-toolbar">
      <select v-model="list.filters.kind" aria-label="Filtrar por tipo">
        <option value="">Todos los tipos</option>
        <option v-for="(label, value) in leadKindLabels" :key="value" :value="value">{{ label }}</option>
      </select>
      <input
        v-model="list.filters.source"
        type="search"
        placeholder="Origen (ej.: footer o el slug de la página)"
        aria-label="Filtrar por origen"
        autocapitalize="none"
      />
    </div>

    <AdminState
      :loading="list.loading.value"
      :error="list.error.value"
      :empty="!list.items.value.length"
      :empty-text="copy.empty"
      empty-icon="fa-solid fa-address-book"
      @retry="list.load"
    >
      <div class="adm-list">
        <AdminRecord v-for="lead in list.items.value" :key="lead.id">
          <template #title>
            {{ lead.name || lead.email }}
            <small v-if="lead.name">{{ lead.email }}</small>
          </template>
          <template #badge>
            <AdminBadge tone="info">{{ leadKindLabels[lead.kind] || lead.kind }}</AdminBadge>
          </template>

          <AdminDatum v-if="lead.phone" label="Teléfono">{{ lead.phone }}</AdminDatum>
          <AdminDatum label="Origen">{{ lead.source || '—' }}</AdminDatum>
          <AdminDatum v-if="refProduct(lead.product).title" label="Producto">
            {{ refProduct(lead.product).title }}
          </AdminDatum>
          <AdminDatum v-if="lead.couponCode" label="Cupón">{{ lead.couponCode }}</AdminDatum>
          <AdminDatum v-if="lead.createdAt" label="Fecha">{{ formatDateEc(lead.createdAt) }}</AdminDatum>
        </AdminRecord>
      </div>
    </AdminState>

    <AdminPagination
      :page="list.page.value"
      :pages="list.pages.value"
      :total="list.total.value"
      @change="list.goTo"
    />
  </section>
</template>
