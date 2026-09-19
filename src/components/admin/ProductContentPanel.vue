<script setup lang="ts">
import { onMounted } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminState from './AdminState.vue'
import AdminSheet from './AdminSheet.vue'
import ContentModuleCard from './ContentModuleCard.vue'
import LessonEditor from './LessonEditor.vue'
import { useProductContent } from '@/composables/admin/useProductContent'
import { useConfirm } from '@/composables/admin/useConfirm'
import { adminCopy } from '@/config/admin'
import type { AdminLesson, AdminModule } from '@/types/admin'

const props = defineProps<{ productId: string }>()

const copy = adminCopy.content
const content = useProductContent(() => props.productId)
const { modules, loading, error, saving, reordering, moduleForm, lessonForm } = content
const confirm = useConfirm()

function askRemoveModule(module: AdminModule) {
  confirm.ask(
    { title: copy.deleteModuleTitle, message: `${module.title}. ${copy.deleteModuleMessage}`, confirmLabel: 'Sí, borrar', danger: true },
    () => content.removeModule(module),
  )
}

function askRemoveLesson(lesson: AdminLesson) {
  confirm.ask(
    { title: copy.deleteLessonTitle, message: `${lesson.title}. ${copy.deleteLessonMessage}`, confirmLabel: 'Sí, borrar', danger: true },
    () => content.removeLesson(lesson),
  )
}

// Cuando Bunny termina, el backend ya guardó la duración: se refresca la lista sin parpadeo.
function onVideoReady(durationSeconds: number) {
  lessonForm.durationSeconds = durationSeconds
  content.load(true)
}

onMounted(() => content.load())
</script>

<template>
  <div class="content">
    <div class="content__bar">
      <p class="adm-muted">Usa las flechas para cambiar el orden. Se guarda solo.</p>
      <button class="btn btn--primary adm-btn-sm" @click="content.openModule()">
        <i class="fa-solid fa-plus"></i>
        Nuevo módulo
      </button>
    </div>

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!modules.length"
      :empty-text="copy.emptyModules"
      empty-icon="fa-solid fa-layer-group"
      @retry="content.load()"
    >
      <div class="adm-list">
        <ContentModuleCard
          v-for="(module, index) in modules"
          :key="module.id"
          :module="module"
          :index="index"
          :total="modules.length"
          :busy="reordering"
          @move="content.moveModule(index, $event)"
          @edit="content.openModule(module)"
          @remove="askRemoveModule(module)"
          @add-lesson="content.openLesson(module.id)"
          @edit-lesson="content.openLesson(module.id, $event)"
          @remove-lesson="askRemoveLesson"
          @move-lesson="(lessonIndex, step) => content.moveLesson(module, lessonIndex, step)"
        />
      </div>
    </AdminState>

    <AdminSheet
      :open="moduleForm.open"
      :title="moduleForm.id ? 'Editar módulo' : 'Nuevo módulo'"
      @close="moduleForm.open = false"
    >
      <form id="module-form" class="adm-form" @submit.prevent="content.saveModule">
        <div class="adm-field">
          <label for="module-title">Título del módulo</label>
          <input id="module-title" v-model="moduleForm.title" type="text" required />
        </div>
        <div class="adm-field">
          <label for="module-description">Descripción (opcional)</label>
          <textarea id="module-description" v-model="moduleForm.description" rows="3"></textarea>
        </div>
      </form>
      <template #footer>
        <button type="button" class="btn btn--ghost" @click="moduleForm.open = false">Cancelar</button>
        <button type="submit" form="module-form" class="btn btn--primary" :disabled="saving || !moduleForm.title.trim()">
          {{ saving ? 'Guardando…' : 'Guardar módulo' }}
        </button>
      </template>
    </AdminSheet>

    <LessonEditor
      :form="lessonForm"
      :saving="saving"
      @close="lessonForm.open = false"
      @save="content.saveLesson"
      @video-ready="onVideoReady"
    />
    <BaseModal v-bind="confirm.modal" @confirm="confirm.accept" @cancel="confirm.cancel" />
  </div>
</template>

<style scoped lang="scss">
.content {
  @include flex(column, stretch, flex-start, 1rem);

  &__bar {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
  }
}
</style>
