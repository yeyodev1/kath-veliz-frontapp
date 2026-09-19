import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { studentService } from '@/services/student.service'
import type { ApiError } from '@/types'

const PLAYERJS_URL = 'https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js'
const SAVE_EVERY_MS = 15000
// Con menos de esto no vale la pena reanudar: es volver a ver el saludo.
const MIN_RESUME_SECONDS = 5
// Casi nadie ve los últimos segundos de cierre; desde acá la clase cuenta como vista.
const COMPLETE_RATIO = 0.95

let playerJsPromise: Promise<void> | null = null

function loadPlayerJs(): Promise<void> {
  if (window.playerjs) return Promise.resolve()
  if (playerJsPromise) return playerJsPromise

  playerJsPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = PLAYERJS_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      script.remove()
      playerJsPromise = null
      reject(new Error('No se pudo cargar player.js'))
    }
    document.head.appendChild(script)
  })
  return playerJsPromise
}

interface LessonPlayerOptions {
  lessonId: Ref<string>
  iframe: Ref<HTMLIFrameElement | null>
  /** La clase terminó (o pasó del 95 %): el temario la marca como vista. */
  onCompleted: (lessonId: string) => void
  /** Posición guardada, para que el temario la recuerde al volver a la clase. */
  onPosition?: (lessonId: string, seconds: number) => void
  /** Falso si no conviene reanudar (p. ej. la posición guardada ya es el final del video). */
  canResume?: (lessonId: string, seconds: number) => boolean
}

export function useLessonPlayer(options: LessonPlayerOptions) {
  const { lessonId, iframe, onCompleted, onPosition, canResume } = options
  const embedUrl = ref('')
  const loading = ref(false)
  const error = ref('')

  // Una "sesión" por clase cargada: los eventos de un iframe viejo se ignoran.
  let session = 0
  let activeLesson = ''
  let position = 0
  let savedPosition = 0
  let lastSaveAt = 0
  let completedSent = false

  function save(completed = false) {
    if (!activeLesson) return
    if (!completed && Math.abs(position - savedPosition) < 1) return
    if (completed && completedSent) return

    const id = activeLesson
    const seconds = Math.floor(position)
    savedPosition = position
    lastSaveAt = Date.now()
    if (completed) completedSent = true

    onPosition?.(id, seconds)
    // El progreso es accesorio: si falla un guardado, el video no se interrumpe.
    studentService.saveProgress(id, seconds, completed).catch(() => {
      if (completed) completedSent = false
    })
    if (completed) onCompleted(id)
  }

  async function attach(current: number, resumeAt: number) {
    try {
      await loadPlayerJs()
    } catch {
      return // sin player.js el video igual se ve; solo no hay progreso automático
    }
    await nextTick()
    if (current !== session || !iframe.value || !window.playerjs) return

    const player = new window.playerjs.Player(iframe.value)
    // Mientras el salto de reanudación no se aplique, el player reporta segundos
    // cercanos a 0: guardarlos pisaría la posición real de la alumna.
    let resumeDeadline = 0

    player.on('ready', () => {
      if (current !== session) return
      const resume = resumeAt >= MIN_RESUME_SECONDS && (canResume?.(activeLesson, resumeAt) ?? true)
      if (!resume) return
      resumeDeadline = Date.now() + 5000
      player.setCurrentTime(resumeAt)
    })

    player.on('timeupdate', ({ seconds, duration }) => {
      if (current !== session) return
      if (resumeDeadline) {
        if (seconds < resumeAt - 2 && Date.now() < resumeDeadline) return
        resumeDeadline = 0
      }
      position = seconds
      if (duration > 0 && seconds / duration >= COMPLETE_RATIO) save(true)
      else if (Date.now() - lastSaveAt >= SAVE_EVERY_MS) save()
    })

    player.on('ended', () => {
      if (current === session) save(true)
    })
  }

  async function load(id: string) {
    save() // deja guardada la clase anterior antes de cambiar
    const current = ++session
    activeLesson = ''
    embedUrl.value = ''
    error.value = ''
    if (!id) return

    loading.value = true
    try {
      const playback = await studentService.playback(id)
      if (current !== session) return

      activeLesson = id
      position = playback.positionSeconds || 0
      savedPosition = position
      lastSaveAt = Date.now()
      completedSent = false
      embedUrl.value = playback.embedUrl
      loading.value = false
      await attach(current, position)
    } catch (e) {
      if (current !== session) return
      error.value = (e as ApiError).message
      loading.value = false
    }
  }

  // Al pasar la pestaña a segundo plano (o cerrar en móvil) no hay `beforeunload` fiable.
  function onVisibility() {
    if (document.visibilityState === 'hidden') save()
  }

  watch(lessonId, (id) => load(id), { immediate: true })
  onMounted(() => document.addEventListener('visibilitychange', onVisibility))
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisibility)
    save()
    session++
  })

  return { embedUrl, loading, error, reload: () => load(lessonId.value) }
}
