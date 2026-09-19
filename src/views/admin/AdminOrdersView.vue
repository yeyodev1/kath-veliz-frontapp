<script setup lang="ts">
import { onMounted } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminRecord from '@/components/admin/AdminRecord.vue'
import AdminDatum from '@/components/admin/AdminDatum.vue'
import AdminBadge from '@/components/admin/AdminBadge.vue'
import { adminSalesService } from '@/services/adminSales.service'
import { useAdminList } from '@/composables/admin/useAdminList'
import { adminCopy, orderStatusLabels, orderStatusTones } from '@/config/admin'
import { formatCents, formatDateTimeEc, refUser } from '@/utils/adminFormat'

const copy = adminCopy.orders
const list = useAdminList((query) => adminSalesService.orders(query), { status: '' })

onMounted(list.load)
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <div class="adm-toolbar">
      <select v-model="list.filters.status" aria-label="Filtrar por estado">
        <option value="">Todos los estados</option>
        <option v-for="(label, value) in orderStatusLabels" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
    </div>

    <AdminState
      :loading="list.loading.value"
      :error="list.error.value"
      :empty="!list.items.value.length"
      :empty-text="copy.empty"
      empty-icon="fa-solid fa-receipt"
      @retry="list.load"
    >
      <div class="adm-list">
        <AdminRecord v-for="order in list.items.value" :key="order.id" :muted="order.status !== 'paid'">
          <template #title>
            {{ formatCents(order.totalCents) }}
            <small>{{ refUser(order.user).name || refUser(order.user).email || 'Cliente' }}</small>
          </template>
          <template #badge>
            <AdminBadge :tone="orderStatusTones[order.status]">
              {{ orderStatusLabels[order.status] || order.status }}
            </AdminBadge>
          </template>

          <AdminDatum label="Productos" wide>
            {{ order.items.map((item) => item.title).join(', ') || '—' }}
          </AdminDatum>
          <AdminDatum v-if="refUser(order.user).name" label="Correo">{{ refUser(order.user).email }}</AdminDatum>
          <AdminDatum label="Fecha">{{ formatDateTimeEc(order.paidAt || order.createdAt) }}</AdminDatum>
          <AdminDatum v-if="order.discountCents" label="Descuento">
            −{{ formatCents(order.discountCents) }}
            <template v-if="order.coupon">({{ order.coupon }})</template>
          </AdminDatum>
          <AdminDatum label="Referencia">{{ order.clientTransactionId }}</AdminDatum>
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
