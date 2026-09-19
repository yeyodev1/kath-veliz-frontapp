import axios from 'axios'
import { AdminAPIBase } from './adminBase.service'
import { shrinkImage } from '@/utils/shrinkImage'
import type { UploadedFile, UploadedImage } from '@/types/admin'

// Subir desde el celular con datos móviles tarda: el timeout normal de 15 s no alcanza.
const UPLOAD_TIMEOUT = 10 * 60 * 1000

/**
 * Límites en MB. `image` y `file` son los del plan actual de Cloudinary (se comprobó:
 * rechaza todo lo que pase de 10 MB); si se sube de plan, basta cambiarlos aquí.
 * `imageOriginal` es el tope antes de reducir la foto en el navegador.
 */
export const UPLOAD_LIMITS_MB = { image: 10, imageOriginal: 60, file: 10 }

type Progress = (percent: number) => void

interface UploadSignature {
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  type: 'upload' | 'authenticated'
  publicId?: string
  allowedFormats?: string
  uploadUrl: string
}

interface CloudinaryUpload {
  secure_url: string
  public_id: string
}

function toMb(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return mb >= 10 ? String(Math.round(mb)) : mb.toFixed(1)
}

export function tooBigMessage(bytes: number, maxMb: number): string {
  return `Este archivo pesa ${toMb(bytes)} MB; el máximo es ${maxMb} MB.`
}

/** Cloudinary responde en inglés; aquí se traduce a algo que Kath entienda. */
function toUploadError(error: unknown, file: File) {
  if (axios.isAxiosError(error) && error.response) {
    const detail = String(error.response.data?.error?.message || '')
    const max = /File size too large.*Maximum is (\d+)/i.exec(detail)
    if (max) {
      return {
        status: 400,
        message: tooBigMessage(file.size, Math.floor(Number(max[1]) / 1048576)),
      }
    }
    if (/format|invalid image/i.test(detail)) {
      return { status: 400, message: 'Ese tipo de archivo no se pudo leer. Prueba con otro.' }
    }
    return {
      status: error.response.status,
      message: 'No se pudo subir el archivo. Inténtalo de nuevo.',
    }
  }
  if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
    return {
      status: 408,
      message: 'La subida tardó demasiado. Revisa tu internet e inténtalo de nuevo.',
    }
  }
  return { status: 500, message: 'Se cortó la conexión mientras se subía. Inténtalo de nuevo.' }
}

/**
 * Subida directa navegador → Cloudinary. El backend solo firma: en Vercel una
 * petición no puede pasar de ~4.5 MB, así que el archivo nunca viaja por el API.
 */
class AdminUploadsService extends AdminAPIBase {
  async image(file: File, onProgress?: Progress): Promise<UploadedImage> {
    const prepared = await shrinkImage(file)
    if (prepared.size > UPLOAD_LIMITS_MB.image * 1024 * 1024) {
      throw { status: 400, message: tooBigMessage(prepared.size, UPLOAD_LIMITS_MB.image) }
    }
    const uploaded = await this.direct('image', prepared, false, onProgress)
    return { url: uploaded.secure_url, publicId: uploaded.public_id }
  }

  /** `isPrivate` = descargable de pago: queda en Cloudinary como archivo autenticado. */
  async file(file: File, isPrivate = false, onProgress?: Progress): Promise<UploadedFile> {
    const uploaded = await this.direct('file', file, isPrivate, onProgress)
    return { url: uploaded.secure_url, publicId: uploaded.public_id, filename: file.name }
  }

  private async direct(
    kind: 'image' | 'file',
    file: File,
    isPrivate: boolean,
    onProgress?: Progress,
  ): Promise<CloudinaryUpload> {
    const ticket = await this.create<UploadSignature>('admin/uploads/signature', {
      kind,
      filename: file.name,
      isPrivate,
    })

    // Solo viajan los parámetros firmados: si se cambia alguno, Cloudinary rechaza la subida.
    const body = new FormData()
    body.append('api_key', ticket.apiKey)
    body.append('timestamp', String(ticket.timestamp))
    body.append('signature', ticket.signature)
    body.append('folder', ticket.folder)
    if (kind === 'file') body.append('type', ticket.type)
    if (ticket.publicId) body.append('public_id', ticket.publicId)
    if (ticket.allowedFormats) body.append('allowed_formats', ticket.allowedFormats)
    body.append('file', file)

    try {
      // axios "limpio": a Cloudinary no se le manda el Bearer de la sesión.
      const { data } = await axios.post<CloudinaryUpload>(ticket.uploadUrl, body, {
        timeout: UPLOAD_TIMEOUT,
        onUploadProgress: (event) => {
          if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100))
        },
      })
      return data
    } catch (error) {
      throw toUploadError(error, file)
    }
  }
}

export const adminUploadsService = new AdminUploadsService()
