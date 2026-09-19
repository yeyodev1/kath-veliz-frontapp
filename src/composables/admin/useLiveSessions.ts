import { computed, reactive, ref, watch } from 'vue'
import { adminLiveService } from '@/services/adminLive.service'
import { adminProductsService } from '@/services/adminProducts.service'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/admin'
import { dateTimeInputToIso, isoToDateTimeInput } from '@/utils/adminFormat'
import type { ApiError } from '@/types'
import type { AdminModule, LiveSession } from '@/types/admin'

/** Clases en vivo de un producto: lista, formulario y aviso a los alumnos. */
export function useLiveSessions() {
  const toast = useToastStore()
  const productId = ref('')
  const sessions = ref<LiveSession[]>([])
  const modules = ref<AdminModule[]>([])
  const loading = ref(false)
  const error = ref('')
  const saving = ref(false)

  const form = reactive({
    open: false,
    id: '',
    title: '',
    description: '',
    startsAt: '',
    meetUrl: '',
    recordingLesson: '',
  })

  // Las lecciones del curso, para elegir cuál es la grabación de la clase.
  const lessonOptions = computed(() =>
    modules.value.flatMap((module) =>
      module.lessons.map((lesson) => ({
        id: lesson.id,
        label: `${module.title} — ${lesson.title}`,
      })),
    ),
  )

  const canSave = computed(
    () => Boolean(form.title.trim() && form.startsAt && form.meetUrl.trim()) && !saving.value,
  )

  async function load() {
    if (!productId.value) return
    loading.value = true
    error.value = ''
    try {
      const [list, content] = await Promise.all([
        adminLiveService.list(productId.value),
        // Si el contenido falla, la pantalla sigue sirviendo: solo no habrá lista de grabaciones.
        adminProductsService.content(productId.value).catch(() => [] as AdminModule[]),
      ])
      sessions.value = [...list].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      modules.value = content
    } catch (err) {
      error.value = (err as ApiError).message || adminCopy.genericError
    } finally {
      loading.value = false
    }
  }

  watch(productId, () => {
    sessions.value = []
    load()
  })

  function open(session?: LiveSession) {
    const recording = session?.recordingLesson
    form.id = session?.id || ''
    form.title = session?.title || ''
    form.description = session?.description || ''
    form.startsAt = isoToDateTimeInput(session?.startsAt)
    form.meetUrl = session?.meetUrl || ''
    form.recordingLesson = recording
      ? typeof recording === 'string'
        ? recording
        : recording.id
      : ''
    form.open = true
  }

  async function save() {
    if (!canSave.value) return
    const payload = {
      product: productId.value,
      title: form.title.trim(),
      description: form.description.trim(),
      startsAt: dateTimeInputToIso(form.startsAt),
      meetUrl: form.meetUrl.trim(),
      recordingLesson: form.recordingLesson || null,
    }
    saving.value = true
    try {
      if (form.id) await adminLiveService.updateSession(form.id, payload)
      else await adminLiveService.createSession(payload)
      toast.success(form.id ? 'Clase actualizada.' : 'Clase agendada.')
      form.open = false
      await load()
    } catch (err) {
      toast.error((err as ApiError).message || adminCopy.genericError)
    } finally {
      saving.value = false
    }
  }

  async function remove(session: LiveSession) {
    await adminLiveService.deleteSession(session.id)
    toast.success('Clase borrada.')
    await load()
  }

  async function notify(session: LiveSession) {
    const { sent, failed = 0 } = await adminLiveService.notify(session.id)
    const people = (count: number) => `${count} ${count === 1 ? 'alumno' : 'alumnos'}`
    if (failed > 0) {
      toast.error(
        `Aviso enviado a ${people(sent)}, pero no salió para ${people(failed)}. Vuelve a intentarlo en unos minutos.`,
      )
    } else if (sent > 0) toast.success(`Aviso enviado a ${people(sent)}.`)
    else toast.info('No se envió ningún correo: este curso no tiene alumnos con acceso vigente.')
  }

  return {
    productId,
    sessions,
    loading,
    error,
    saving,
    form,
    lessonOptions,
    canSave,
    load,
    open,
    save,
    remove,
    notify,
  }
}
