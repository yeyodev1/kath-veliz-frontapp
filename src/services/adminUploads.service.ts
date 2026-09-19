import { AdminAPIBase } from './adminBase.service'
import type { UploadedFile, UploadedImage } from '@/types/admin'

// Subir desde el celular con datos móviles tarda: el timeout normal de 15 s no alcanza.
const UPLOAD_TIMEOUT = 5 * 60 * 1000

class AdminUploadsService extends AdminAPIBase {
  image(file: File, onProgress?: (percent: number) => void): Promise<UploadedImage> {
    const body = new FormData()
    body.append('file', file)
    return this.create<UploadedImage>('admin/uploads/image', body, this.config(onProgress))
  }

  /** `isPrivate` = descargable de pago: queda en Cloudinary como archivo autenticado. */
  file(
    file: File,
    isPrivate = false,
    onProgress?: (percent: number) => void,
  ): Promise<UploadedFile> {
    const body = new FormData()
    // El campo de texto va antes del archivo: multer lo lee en orden.
    if (isPrivate) body.append('private', 'true')
    body.append('file', file)
    return this.create<UploadedFile>('admin/uploads/file', body, this.config(onProgress))
  }

  private config(onProgress?: (percent: number) => void) {
    return {
      timeout: UPLOAD_TIMEOUT,
      onUploadProgress: (event: { loaded: number; total?: number }) => {
        if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100))
      },
    }
  }
}

export const adminUploadsService = new AdminUploadsService()
