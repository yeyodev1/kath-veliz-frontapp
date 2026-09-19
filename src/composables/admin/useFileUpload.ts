import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/config/admin'
import { tooBigMessage } from '@/services/adminUploads.service'
import type { ApiError } from '@/types'

/**
 * Estado de una subida directa a Cloudinary: progreso y errores en un
 * solo lugar para la portada, los descargables y los adjuntos.
 */
export function useFileUpload<T>(
  uploader: (file: File, onProgress: (percent: number) => void) => Promise<T>,
) {
  const toast = useToastStore()
  const uploading = ref(false)
  const progress = ref(0)

  async function upload(event: Event, maxMb: number): Promise<T | null> {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    // Se limpia para poder volver a elegir el mismo archivo si falla.
    input.value = ''
    if (!file) return null

    if (file.size > maxMb * 1024 * 1024) {
      toast.error(tooBigMessage(file.size, maxMb))
      return null
    }

    uploading.value = true
    progress.value = 0
    try {
      return await uploader(file, (percent) => (progress.value = percent))
    } catch (err) {
      toast.error((err as ApiError).message || adminCopy.genericError)
      return null
    } finally {
      uploading.value = false
    }
  }

  return { uploading, progress, upload }
}
