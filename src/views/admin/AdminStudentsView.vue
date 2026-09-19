<script setup lang="ts">
import { onMounted } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminRecord from '@/components/admin/AdminRecord.vue'
import AdminDatum from '@/components/admin/AdminDatum.vue'
import AdminBadge from '@/components/admin/AdminBadge.vue'
import { adminAccessService } from '@/services/adminAccess.service'
import { useAdminList } from '@/composables/admin/useAdminList'
import { accessStatusTones, adminCopy } from '@/config/admin'
import { accessStatus, formatDateEc, refProduct } from '@/utils/adminFormat'

const copy = adminCopy.students
const list = useAdminList((query) => adminAccessService.students(query), { search: '' })

onMounted(list.load)
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <div class="adm-toolbar">
      <input
        v-model="list.filters.search"
        type="search"
        placeholder="Buscar por nombre o correo"
        aria-label="Buscar alumnos"
      />
    </div>

    <AdminState
      :loading="list.loading.value"
      :error="list.error.value"
      :empty="!list.items.value.length"
      :empty-text="copy.empty"
      empty-icon="fa-solid fa-user-graduate"
      @retry="list.load"
    >
      <div class="adm-list">
        <AdminRecord v-for="student in list.items.value" :key="student.id">
          <template #title>
            {{ student.name || student.email }}
            <small v-if="student.name">{{ student.email }}</small>
          </template>

          <AdminDatum v-if="student.phone" label="Teléfono">{{ student.phone }}</AdminDatum>
          <AdminDatum v-if="student.createdAt" label="Se registró">{{
            formatDateEc(student.createdAt)
          }}</AdminDatum>
          <AdminDatum label="Accesos" wide>
            <span v-if="!student.accesses?.length">Sin accesos</span>
            <span v-else class="students__accesses">
              <AdminBadge
                v-for="access in student.accesses"
                :key="access.id"
                :tone="accessStatusTones[accessStatus(access)]"
              >
                {{ refProduct(access.product).title || 'Producto' }}
              </AdminBadge>
            </span>
          </AdminDatum>

          <template #actions>
            <RouterLink
              :to="{ name: 'AdminAccess', query: { user: student.id } }"
              class="btn btn--ghost adm-btn-sm"
            >
              <i class="fa-solid fa-key"></i>
              Ver accesos
            </RouterLink>
          </template>
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

<style scoped lang="scss">
.students__accesses {
  @include flex(row, center, flex-start, 0.4rem);
  flex-wrap: wrap;
  margin-top: 0.25rem;
  white-space: normal;
}
</style>
