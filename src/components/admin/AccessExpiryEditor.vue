<script setup lang="ts">
import { ref, watch } from 'vue'
import AdminSheet from './AdminSheet.vue'
import AdminExpiryChoice from './AdminExpiryChoice.vue'
import { adminAccessService } from '@/services/adminAccess.service'
import { useExpiryChoice } from '@/composables/admin/useExpiryChoice'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/admin'
import { formatDateEc, refProduct, refUser } from '@/utils/adminFormat'
import type { ApiError } from '@/types'
import type { AdminAccess } from '@/types/admin'

const props = defineProps<{ access: AdminAccess | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const toast = useToastStore()
const { choice, minDate, isValid, toPayload, reset } = useExpiryChoice()
const saving = ref(false)

// Cada vez que se abre arranca sin opción elegida, igual que al dar el acceso.
watch(() => props.access?.id, reset)

async function save() {
  if (!props.access || !isValid.value || saving.value) return
  saving.value = true
  try {
    await adminAccessService.updateExpiry(props.access.id, toPayload())
    toast.success('Vencimiento actualizado.')
    emit('saved')
    emit('close')
  } catch (err) {
    toast.error((err as ApiError).message || adminCopy.genericError)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AdminSheet
    :open="Boolean(access)"
    title="Editar vencimiento"
    :subtitle="access ? `${refUser(access.user).email} · ${refProduct(access.product).title}` : ''"
    @close="emit('close')"
  >
    <form v-if="access" id="expiry-form" class="adm-form" @submit.prevent="save">
      <p class="adm-muted">
        Ahora mismo:
        <strong>
          {{ access.expiresAt ? `se revoca el ${formatDateEc(access.expiresAt)}` : adminCopy.access.neverLabel }}
        </strong>
      </p>
      <AdminExpiryChoice v-model="choice" :min-date="minDate" name="edit-expiry" />
    </form>

    <template #footer>
      <button type="button" class="btn btn--ghost" @click="emit('close')">Cancelar</button>
      <button type="submit" form="expiry-form" class="btn btn--primary" :disabled="!isValid || saving">
        {{ saving ? 'Guardando…' : 'Guardar' }}
      </button>
    </template>
  </AdminSheet>
</template>
