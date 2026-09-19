<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AccessRow from '@/components/admin/AccessRow.vue'
import AccessGrantForm from '@/components/admin/AccessGrantForm.vue'
import AccessExpiryEditor from '@/components/admin/AccessExpiryEditor.vue'
import { adminAccessService } from '@/services/adminAccess.service'
import { useAdminList } from '@/composables/admin/useAdminList'
import { useConfirm } from '@/composables/admin/useConfirm'
import { useProductOptions } from '@/composables/admin/useProductOptions'
import { useToastStore } from '@/stores/toast'
import { accessStatusLabels, adminCopy } from '@/config/admin'
import { refProduct, refUser } from '@/utils/adminFormat'
import type { AdminAccess } from '@/types/admin'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const copy = adminCopy.access
const { products, load: loadProducts } = useProductOptions()
const confirm = useConfirm()

// `user` llega desde la lista de alumnos ("Ver accesos") como id.
const list = useAdminList((query) => adminAccessService.list(query), {
  product: '',
  status: '',
  search: '',
  user: String(route.query.user || ''),
})

const grantOpen = ref(false)
const editing = ref<AdminAccess | null>(null)

// Respaldo por si el backend aún no filtra por texto: se filtra lo ya cargado.
const visible = computed(() => {
  const term = list.filters.search.trim().toLowerCase()
  if (!term) return list.items.value
  return list.items.value.filter((access) => {
    const user = refUser(access.user)
    const text = `${user.name} ${user.email} ${refProduct(access.product).title} ${access.note}`
    return text.toLowerCase().includes(term)
  })
})

function clearUser() {
  list.filters.user = ''
  router.replace({ query: {} })
}

function askRevoke(access: AdminAccess) {
  const who = refUser(access.user).email || 'esta persona'
  confirm.ask(
    {
      title: copy.revokeTitle,
      message: `${who} — ${refProduct(access.product).title}. ${copy.revokeMessage}`,
      confirmLabel: 'Sí, revocar',
      danger: true,
    },
    async () => {
      await adminAccessService.revoke(access.id)
      toast.success('Acceso revocado.')
      await list.load()
    },
  )
}

onMounted(() => {
  loadProducts()
  list.load()
})
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle">
      <button class="btn btn--primary" @click="grantOpen = true">
        <i class="fa-solid fa-user-plus"></i>
        {{ copy.grant }}
      </button>
    </AdminPageHeader>

    <div class="adm-toolbar">
      <input
        v-model="list.filters.search"
        type="search"
        placeholder="Buscar por nombre o correo"
        aria-label="Buscar por nombre o correo"
      />
      <select v-model="list.filters.product" aria-label="Filtrar por producto">
        <option value="">Todos los productos</option>
        <option v-for="product in products" :key="product.id" :value="product.id">
          {{ product.title }}
        </option>
      </select>
      <select v-model="list.filters.status" aria-label="Filtrar por estado">
        <option value="">Todos los estados</option>
        <option v-for="(label, value) in accessStatusLabels" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
    </div>

    <div v-if="list.filters.user" class="adm-actions">
      <span class="adm-muted">Viendo los accesos de un solo alumno.</span>
      <button class="btn btn--ghost adm-btn-sm" @click="clearUser">
        <i class="fa-solid fa-xmark"></i>
        Ver todos
      </button>
    </div>

    <AdminState
      :loading="list.loading.value"
      :error="list.error.value"
      :empty="!visible.length"
      :empty-text="copy.empty"
      empty-icon="fa-solid fa-key"
      @retry="list.load"
    >
      <div class="adm-list">
        <AccessRow
          v-for="access in visible"
          :key="access.id"
          :access="access"
          @revoke="askRevoke"
          @edit="editing = $event"
        />
      </div>
    </AdminState>

    <AdminPagination
      :page="list.page.value"
      :pages="list.pages.value"
      :total="list.total.value"
      @change="list.goTo"
    />

    <AccessGrantForm :open="grantOpen" @close="grantOpen = false" @granted="list.load" />
    <AccessExpiryEditor :access="editing" @close="editing = null" @saved="list.load" />
    <BaseModal v-bind="confirm.modal" @confirm="confirm.accept" @cancel="confirm.cancel" />
  </section>
</template>
