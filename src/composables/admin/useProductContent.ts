import { reactive, ref } from 'vue'
import { adminProductsService } from '@/services/adminProducts.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/admin'
import type { ApiError } from '@/types'
import type { AdminLesson, AdminModule, LessonAttachment } from '@/types/admin'

/** Módulos y lecciones de un producto: crear, editar, borrar y reordenar. */
export function useProductContent(productId: () => string) {
  const toast = useToastStore()
  const modules = ref<AdminModule[]>([])
  const loading = ref(true)
  const error = ref('')
  const saving = ref(false)
  const reordering = ref(false)

  const moduleForm = reactive({ open: false, id: '', title: '', description: '' })
  const lessonForm = reactive({
    open: false,
    id: '',
    moduleId: '',
    title: '',
    description: '',
    isFreePreview: false,
    isPublished: true,
    attachments: [] as LessonAttachment[],
    bunnyVideoId: '',
    durationSeconds: 0,
  })

  function fail(err: unknown) {
    toast.error((err as ApiError).message || adminCopy.genericError)
  }

  async function load(silent = false) {
    if (!silent) loading.value = true
    error.value = ''
    try {
      modules.value = await adminProductsService.content(productId())
    } catch (err) {
      if (silent) fail(err)
      else error.value = (err as ApiError).message || adminCopy.genericError
    } finally {
      loading.value = false
    }
  }

  // --- Reordenar -----------------------------------------------------------
  // Se mueve en pantalla al instante y se guarda el orden completo; si el
  // guardado falla, se vuelve a pedir el contenido para no mostrar un orden falso.
  async function persistOrder() {
    reordering.value = true
    try {
      await adminProductsService.saveOrder(productId(), {
        modules: modules.value.map((module) => ({
          id: module.id,
          lessons: module.lessons.map((lesson) => lesson.id),
        })),
      })
    } catch (err) {
      fail(err)
      await load(true)
    } finally {
      reordering.value = false
    }
  }

  function swap<T>(list: T[], index: number, step: number): boolean {
    const target = index + step
    if (reordering.value || target < 0 || target >= list.length) return false
    const [item] = list.splice(index, 1)
    if (item === undefined) return false
    list.splice(target, 0, item)
    return true
  }

  function moveModule(index: number, step: number) {
    if (swap(modules.value, index, step)) persistOrder()
  }

  function moveLesson(module: AdminModule, index: number, step: number) {
    if (swap(module.lessons, index, step)) persistOrder()
  }

  // --- Módulos -------------------------------------------------------------
  function openModule(module?: AdminModule) {
    moduleForm.id = module?.id || ''
    moduleForm.title = module?.title || ''
    moduleForm.description = module?.description || ''
    moduleForm.open = true
  }

  async function saveModule() {
    if (!moduleForm.title.trim() || saving.value) return
    const payload = { title: moduleForm.title.trim(), description: moduleForm.description.trim() }
    saving.value = true
    try {
      if (moduleForm.id) await adminProductsService.updateModule(moduleForm.id, payload)
      else await adminProductsService.createModule(productId(), payload)
      toast.success(moduleForm.id ? 'Módulo actualizado.' : 'Módulo creado.')
      moduleForm.open = false
      await load(true)
    } catch (err) {
      fail(err)
    } finally {
      saving.value = false
    }
  }

  async function removeModule(module: AdminModule) {
    await adminProductsService.deleteModule(module.id)
    toast.success('Módulo borrado.')
    await load(true)
  }

  // --- Lecciones -----------------------------------------------------------
  function openLesson(moduleId: string, lesson?: AdminLesson) {
    lessonForm.id = lesson?.id || ''
    lessonForm.moduleId = moduleId
    lessonForm.title = lesson?.title || ''
    lessonForm.description = lesson?.description || ''
    lessonForm.isFreePreview = lesson?.isFreePreview ?? false
    lessonForm.isPublished = lesson?.isPublished ?? true
    lessonForm.attachments = (lesson?.attachments || []).map((file) => ({ ...file }))
    lessonForm.bunnyVideoId = lesson?.bunnyVideoId || ''
    lessonForm.durationSeconds = lesson?.durationSeconds || 0
    lessonForm.open = true
  }

  async function saveLesson() {
    if (!lessonForm.title.trim() || saving.value) return
    const payload = {
      title: lessonForm.title.trim(),
      description: lessonForm.description.trim(),
      isFreePreview: lessonForm.isFreePreview,
      isPublished: lessonForm.isPublished,
      attachments: lessonForm.attachments,
    }
    saving.value = true
    try {
      if (lessonForm.id) {
        await adminProductsService.updateLesson(lessonForm.id, payload)
        toast.success('Lección guardada.')
        lessonForm.open = false
      } else {
        // La hoja queda abierta ya con id: el siguiente paso natural es subir el video.
        const created = await adminProductsService.createLesson(lessonForm.moduleId, payload)
        lessonForm.id = created.id
        toast.success('Lección creada. Ahora puedes subir el video.')
      }
      await load(true)
    } catch (err) {
      fail(err)
    } finally {
      saving.value = false
    }
  }

  async function removeLesson(lesson: AdminLesson) {
    await adminProductsService.deleteLesson(lesson.id)
    toast.success('Lección borrada.')
    await load(true)
  }

  return {
    modules, loading, error, saving, reordering, moduleForm, lessonForm,
    load, moveModule, moveLesson, openModule, saveModule, removeModule,
    openLesson, saveLesson, removeLesson,
  }
}

export type LessonFormState = ReturnType<typeof useProductContent>['lessonForm']
export type ModuleFormState = ReturnType<typeof useProductContent>['moduleForm']
