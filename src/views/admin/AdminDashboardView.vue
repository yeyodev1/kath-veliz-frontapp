<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import { adminSalesService } from '@/services/adminSales.service'
import { adminCopy } from '@/config/admin'
import { formatCents } from '@/utils/adminFormat'
import type { ApiError } from '@/types'
import type { AdminStats } from '@/types/admin'

const copy = adminCopy.dashboard
const stats = ref<AdminStats | null>(null)
const loading = ref(true)
const error = ref('')

// Cada tarjeta lleva a la pantalla donde se puede hacer algo con ese número.
const cards = computed(() => {
  const data = stats.value
  if (!data) return []
  return [
    {
      key: 'salesCents',
      value: formatCents(data.salesCents),
      icon: 'fa-solid fa-sack-dollar',
      to: '/admin/ordenes',
    },
    {
      key: 'ordersPaid',
      value: data.ordersPaid,
      icon: 'fa-solid fa-receipt',
      to: '/admin/ordenes',
    },
    {
      key: 'students',
      value: data.students,
      icon: 'fa-solid fa-user-graduate',
      to: '/admin/alumnos',
    },
    { key: 'leads', value: data.leads, icon: 'fa-solid fa-address-book', to: '/admin/leads' },
    {
      key: 'pendingRequests',
      value: data.pendingRequests,
      icon: 'fa-solid fa-clipboard-list',
      to: '/admin/solicitudes',
    },
    {
      key: 'activeAccesses',
      value: data.activeAccesses,
      icon: 'fa-solid fa-key',
      to: '/admin/accesos',
    },
  ] as const
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    stats.value = await adminSalesService.stats()
  } catch (err) {
    error.value = (err as ApiError).message || adminCopy.genericError
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <AdminState :loading="loading" :error="error" @retry="load">
      <div class="stats">
        <RouterLink
          v-for="card in cards"
          :key="card.key"
          :to="card.to"
          class="stats__card"
          :class="{
            'stats__card--alert': card.key === 'pendingRequests' && Number(card.value) > 0,
          }"
        >
          <span class="stats__icon"><i :class="card.icon"></i></span>
          <span class="stats__value">{{ card.value }}</span>
          <span class="stats__label">{{ copy.cards[card.key] }}</span>
        </RouterLink>
      </div>
    </AdminState>
  </section>
</template>

<style scoped lang="scss">
.stats {
  // Dos por fila en 360 px, tres en pantallas anchas.
  @include flex-cards(140px, 0.75rem);

  @include from('md') {
    @include flex-cards(260px, 1.25rem);
  }

  &__card {
    @include card;
    @include flex(column, flex-start, flex-start, 0.35rem);
    padding: 1.1rem;
    @include transition;

    &:hover {
      border-color: $accent;
      transform: translateY(-2px);
    }

    &--alert {
      border-color: $accent;
      background: $accent-soft;
    }
  }

  &__icon {
    @include flex(row, center, center);
    width: 38px;
    height: 38px;
    border-radius: $radius-sm;
    background: $accent-soft;
    color: $accent-deep;
    margin-bottom: 0.4rem;
  }

  &__card--alert &__icon {
    background: $surface;
  }

  &__value {
    @include display($text-xl, 600);
    color: $ink;
    overflow-wrap: anywhere;
  }

  &__label {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
  }
}
</style>
