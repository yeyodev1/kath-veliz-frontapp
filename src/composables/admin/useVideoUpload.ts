import { onBeforeUnmount, ref } from 'vue'
import * as tus from 'tus-js-client'
import { adminProductsService } from '@/services/adminProducts.service'
import { adminCopy } from '@/config/admin'
import type { ApiError } from '@/types'
import type { VideoStatus, VideoUploadTicket } from '@/types/admin'

export type VideoPhase =
  'idle' | 'preparing' | 'uploading' | 'paused' | 'processing' | 'ready' | 'error'

const STORAGE_PREFIX = 'admin:video-upload:'
const POLL_MS = 5000
// Media hora de sondeo; después Bunny sigue solo y el estado se ve al volver a abrir.
const MAX_POLLS = 360

interface SavedUpload {
  fingerprint: string
  ticket: VideoUploadTicket
}

const fingerprintOf = (file: File) => `${file.name}:${file.size}:${file.lastModified}`

// Bunny: 0 creado, 1 subido, 2 procesando, 3 transcodificando, 4 listo, 5 error, 6 falló la subida.
function classify(result: VideoStatus): 'ready' | 'failed' | 'empty' | 'processing' {
  if (result.ready) return 'ready'
  const status = String(result.status).toLowerCase()
  if (['5', '6'].includes(status) || /error|fail/.test(status)) return 'failed'
  if (['0', 'created', ''].includes(status)) return 'empty'
  return 'processing'
}

/**
 * Subida directa del navegador a Bunny por TUS. El backend solo firma: la API
 * key nunca pasa por aquí. La firma se guarda por lección para poder retomar
 * la MISMA subida si se corta el internet o se recarga la página.
 */
export function useVideoUpload(lessonId: () => string, onReady: (durationSeconds: number) => void) {
  const phase = ref<VideoPhase>('idle')
  const progress = ref(0)
  const message = ref('')
  const fileName = ref('')

  let upload: tus.Upload | null = null
  let pollTimer: ReturnType<typeof setTimeout> | undefined
  let polls = 0
  let alive = true

  const storageKey = () => `${STORAGE_PREFIX}${lessonId()}`

  function readSaved(file: File): VideoUploadTicket | null {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey()) || 'null') as SavedUpload | null
      const stillValid = saved && saved.ticket.tus.expire * 1000 > Date.now() + 60_000
      return saved && stillValid && saved.fingerprint === fingerprintOf(file) ? saved.ticket : null
    } catch {
      return null
    }
  }

  function forget() {
    try {
      localStorage.removeItem(storageKey())
    } catch {
      /* modo privado */
    }
  }

  function warnBeforeLeave(event: BeforeUnloadEvent) {
    event.preventDefault()
  }

  function setPhase(next: VideoPhase) {
    phase.value = next
    if (next === 'uploading') window.addEventListener('beforeunload', warnBeforeLeave)
    else window.removeEventListener('beforeunload', warnBeforeLeave)
  }

  async function start(file: File, title: string) {
    clearTimeout(pollTimer)
    message.value = ''
    progress.value = 0
    fileName.value = file.name
    setPhase('preparing')

    try {
      let ticket = readSaved(file)
      const resumable = Boolean(ticket)
      if (!ticket) {
        ticket = await adminProductsService.requestVideoUpload(lessonId(), title)
        try {
          const saved: SavedUpload = { fingerprint: fingerprintOf(file), ticket }
          localStorage.setItem(storageKey(), JSON.stringify(saved))
        } catch {
          /* sin almacenamiento solo se pierde el poder retomar tras recargar */
        }
      }

      upload = new tus.Upload(file, {
        endpoint: ticket.tus.endpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
        headers: {
          AuthorizationSignature: ticket.tus.signature,
          AuthorizationExpire: String(ticket.tus.expire),
          VideoId: ticket.videoId,
          LibraryId: String(ticket.libraryId),
        },
        metadata: { filetype: file.type || 'video/mp4', title: title || file.name },
        removeFingerprintOnSuccess: true,
        onProgress(sent, total) {
          progress.value = total ? Math.floor((sent / total) * 100) : 0
        },
        onSuccess() {
          forget()
          progress.value = 100
          beginPolling()
        },
        onError() {
          if (!alive) return
          message.value = 'Se cortó la subida. Revisa tu internet y toca "Continuar".'
          setPhase('error')
        },
      })

      // Solo se retoma una subida anterior si la firma guardada es de ese mismo video.
      if (resumable) {
        const previous = await upload.findPreviousUploads()
        const latest = previous.sort((a, b) => b.creationTime.localeCompare(a.creationTime))[0]
        if (latest) upload.resumeFromPreviousUpload(latest)
      }

      upload.start()
      setPhase('uploading')
    } catch (err) {
      message.value = (err as ApiError).message || adminCopy.genericError
      setPhase('error')
    }
  }

  function pause() {
    if (phase.value !== 'uploading' || !upload) return
    upload.abort()
    setPhase('paused')
  }

  /** Continúa desde donde quedó (pausa o error de red). Devuelve false si hay que elegir el archivo otra vez. */
  function resume(): boolean {
    if (!upload) {
      message.value = 'Elige el archivo de nuevo para volver a intentarlo.'
      return false
    }
    message.value = ''
    upload.start()
    setPhase('uploading')
    return true
  }

  function beginPolling() {
    polls = 0
    setPhase('processing')
    poll()
  }

  async function poll() {
    if (!alive) return
    try {
      const result = await adminProductsService.videoStatus(lessonId())
      if (!alive) return
      const state = classify(result)
      if (state === 'ready') {
        setPhase('ready')
        onReady(result.durationSeconds || 0)
        return
      }
      if (state === 'failed') {
        message.value = 'Bunny no pudo procesar este video. Súbelo de nuevo.'
        setPhase('error')
        upload = null
        return
      }
    } catch {
      // Un fallo de red suelto no detiene el sondeo.
    }
    polls += 1
    if (polls < MAX_POLLS) pollTimer = setTimeout(poll, POLL_MS)
  }

  /** Al abrir una lección que ya tiene video: ¿está listo, procesando o quedó a medias? */
  async function checkExisting() {
    try {
      const result = await adminProductsService.videoStatus(lessonId())
      if (!alive) return
      const state = classify(result)
      if (state === 'ready') setPhase('ready')
      else if (state === 'processing') beginPolling()
      else if (state === 'empty')
        message.value = 'La subida anterior no terminó. Elige el mismo archivo para continuarla.'
    } catch {
      /* sin estado: se deja subir de nuevo */
    }
  }

  onBeforeUnmount(() => {
    alive = false
    clearTimeout(pollTimer)
    window.removeEventListener('beforeunload', warnBeforeLeave)
    // La subida se corta con la pantalla; la firma guardada permite retomarla.
    if (phase.value === 'uploading') upload?.abort()
  })

  return { phase, progress, message, fileName, start, pause, resume, checkExisting }
}
