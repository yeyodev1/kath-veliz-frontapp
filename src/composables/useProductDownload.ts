import { ref } from 'vue'
import { studentService } from '@/services/student.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

/** Descarga de un producto `download`: la URL es firmada y dura poco, se pide en cada clic. */
export function useProductDownload() {
  const toast = useToastStore()
  const downloadingSlug = ref('')

  async function download(slug: string) {
    if (downloadingSlug.value) return
    downloadingSlug.value = slug
    try {
      const { url, filename } = await studentService.downloadLink(slug)
      // Un <a> y no window.open: tras un await, Safari en iOS bloquea las ventanas nuevas.
      const link = document.createElement('a')
      link.href = url
      link.download = filename || ''
      link.rel = 'noopener'
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      downloadingSlug.value = ''
    }
  }

  return { downloadingSlug, download }
}
