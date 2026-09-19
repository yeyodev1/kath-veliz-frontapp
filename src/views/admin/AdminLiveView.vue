<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminRecord from '@/components/admin/AdminRecord.vue'
import AdminDatum from '@/components/admin/AdminDatum.vue'
import AdminBadge from '@/components/admin/AdminBadge.vue'
import LiveSessionForm from '@/components/admin/LiveSessionForm.vue'
import { useLiveSessions } from '@/composables/admin/useLiveSessions'
import { useConfirm } from '@/composables/admin/useConfirm'
import { useProductOptions } from '@/composables/admin/useProductOptions'
import { adminCopy } from '@/config/admin'
import { formatDateTimeEc } from '@/utils/adminFormat'
import type { LiveSession } from '@/types/admin'

const copy = adminCopy.live
const live = useLiveSessions()
const { productId, sessions, loading, error, saving, form, lessonOptions, canSave } = live
const { products, load: loadProducts } = useProductOptions()
const confirm = useConfirm()

// Solo los cursos tienen clases en vivo.
const courses = computed(() => products.value.filter((product) => product.type === 'course'))

function isPast(session: LiveSession): boolean {
  return new Date(session.startsAt).getTime() < Date.now()
}

function askNotify(session: LiveSession) {
  confirm.ask(
    {
      title: copy.notifyTitle,
      message: `${session.title}. ${copy.notifyMessage}`,
      confirmLabel: 'Sí, avisar',
    },
    () => live.notify(session),
  )
}

function askDelete(session: LiveSession) {
  confirm.ask(
    {
      title: copy.deleteTitle,
      message: `${session.title}. ${copy.deleteMessage}`,
      confirmLabel: 'Sí, borrar',
      danger: true,
    },
    () => live.remove(session),
  )
}

onMounted(async () => {
  await loadProducts()
  // Con un solo curso no hay nada que elegir.
  if (!productId.value && courses.value.length === 1) productId.value = courses.value[0]!.id
})
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle">
      <button class="btn btn--primary" :disabled="!productId" @click="live.open()">
        <i class="fa-solid fa-plus"></i>
        Nueva clase
      </button>
    </AdminPageHeader>

    <div class="adm-toolbar">
      <select v-model="productId" aria-label="Curso">
        <option value="" disabled>Elige un curso</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>
    </div>

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!productId || !sessions.length"
      :empty-text="productId ? copy.empty : copy.pickProduct"
      empty-icon="fa-solid fa-video"
      @retry="live.load"
    >
      <div class="adm-list">
        <AdminRecord v-for="session in sessions" :key="session.id" :muted="isPast(session)">
          <template #title>
            {{ session.title }}
            <small>{{ formatDateTimeEc(session.startsAt) }}</small>
          </template>
          <template #badge>
            <AdminBadge :tone="isPast(session) ? 'neutral' : 'success'">
              {{ isPast(session) ? 'Ya pasó' : 'Próxima' }}
            </AdminBadge>
          </template>

          <AdminDatum label="Enlace de Meet" wide>
            <a :href="session.meetUrl" target="_blank" rel="noopener">{{ session.meetUrl }}</a>
          </AdminDatum>
          <AdminDatum v-if="session.description" label="Descripción" wide>{{
            session.description
          }}</AdminDatum>
          <AdminDatum label="Grabación">
            {{ session.recordingLesson ? 'Enlazada a una lección' : 'Sin grabación' }}
          </AdminDatum>

          <template #actions>
            <button class="btn btn--dark adm-btn-sm" @click="askNotify(session)">
              <i class="fa-solid fa-paper-plane"></i>
              Avisar a los alumnos
            </button>
            <button class="btn btn--ghost adm-btn-sm" @click="live.open(session)">
              <i class="fa-solid fa-pen"></i>
              Editar
            </button>
            <button
              class="adm-icon-btn adm-icon-btn--danger"
              aria-label="Borrar clase"
              @click="askDelete(session)"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </template>
        </AdminRecord>
      </div>
    </AdminState>

    <LiveSessionForm
      :form="form"
      :lessons="lessonOptions"
      :saving="saving"
      :can-save="canSave"
      @close="form.open = false"
      @save="live.save"
    />
    <BaseModal v-bind="confirm.modal" @confirm="confirm.accept" @cancel="confirm.cancel" />
  </section>
</template>
