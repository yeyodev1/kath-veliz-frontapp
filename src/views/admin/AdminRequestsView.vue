<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import RequestCard from '@/components/admin/RequestCard.vue'
import { adminSalesService } from '@/services/adminSales.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy, requestStatusLabels } from '@/config/admin'
import type { ApiError } from '@/types'
import type { ServiceRequest, ServiceRequestStatus } from '@/types/admin'

const copy = adminCopy.requests
const toast = useToastStore()

const requests = ref<ServiceRequest[]>([])
const status = ref<ServiceRequestStatus | ''>('pending')
const loading = ref(true)
const error = ref('')

// Aprobar o rechazar comparten el mismo cuadro: cambia el texto y la ruta.
const decision = reactive({
  open: false,
  approve: true,
  request: null as ServiceRequest | null,
  note: '',
  busy: false,
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    requests.value = await adminSalesService.requests(status.value)
  } catch (err) {
    error.value = (err as ApiError).message || adminCopy.genericError
  } finally {
    loading.value = false
  }
}

function decide(request: ServiceRequest, approve: boolean) {
  decision.request = request
  decision.approve = approve
  decision.note = ''
  decision.open = true
}

async function confirmDecision() {
  if (!decision.request || decision.busy) return
  decision.busy = true
  try {
    const note = decision.note.trim()
    if (decision.approve) await adminSalesService.approveRequest(decision.request.id, note)
    else await adminSalesService.rejectRequest(decision.request.id, note)
    toast.success(decision.approve ? 'Solicitud aprobada. Ya salió el correo con el enlace de pago.' : 'Solicitud rechazada.')
    decision.open = false
    await load()
  } catch (err) {
    toast.error((err as ApiError).message || adminCopy.genericError)
  } finally {
    decision.busy = false
  }
}

watch(status, load)
onMounted(load)
</script>

<template>
  <section class="adm-page">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <div class="adm-toolbar">
      <select v-model="status" aria-label="Filtrar por estado">
        <option value="">Todas</option>
        <option v-for="(label, value) in requestStatusLabels" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
    </div>

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!requests.length"
      :empty-text="copy.empty"
      empty-icon="fa-solid fa-clipboard-list"
      @retry="load"
    >
      <div class="adm-list">
        <RequestCard
          v-for="request in requests"
          :key="request.id"
          :request="request"
          @approve="decide($event, true)"
          @reject="decide($event, false)"
        />
      </div>
    </AdminState>

    <BaseModal
      :open="decision.open"
      :title="decision.approve ? copy.approveTitle : copy.rejectTitle"
      :message="`${decision.request?.name || ''}. ${decision.approve ? copy.approveMessage : copy.rejectMessage}`"
      :confirm-label="decision.busy ? 'Enviando…' : decision.approve ? 'Aprobar' : 'Rechazar'"
      :danger="!decision.approve"
      @confirm="confirmDecision"
      @cancel="decision.open = false"
    >
      <div class="adm-form requests__note">
        <label for="request-note">Nota (opcional)</label>
        <textarea id="request-note" v-model="decision.note" rows="3"></textarea>
      </div>
    </BaseModal>
  </section>
</template>

<style scoped lang="scss">
.requests__note {
  width: 100%;
  text-align: left;
  gap: 0;
}
</style>
