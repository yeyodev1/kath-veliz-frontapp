// Las fotos de una sesión profesional pesan 12-20 MB y Cloudinary rechaza imágenes
// de más de 10 MB. Se reducen en el navegador antes de subir: además de caber,
// suben en segundos desde el celular.

const SHRINK_OVER_BYTES = 1.5 * 1024 * 1024
const MAX_SIDE = 2000
const JPEG_QUALITY = 0.85

interface Drawable {
  source: CanvasImageSource
  width: number
  height: number
  release: () => void
}

async function decode(file: File): Promise<Drawable> {
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      }
    } catch {
      // Safari viejo no acepta opciones: se intenta con <img>.
    }
  }

  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

/**
 * Devuelve la imagen reducida a máx. 2000 px de lado en JPEG, o la original si
 * ya es liviana, es un GIF (perdería la animación) o el navegador no la puede leer.
 */
export async function shrinkImage(file: File): Promise<File> {
  if (file.size <= SHRINK_OVER_BYTES || file.type === 'image/gif') return file

  try {
    const drawable = await decode(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(drawable.width, drawable.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(drawable.width * scale)
    canvas.height = Math.round(drawable.height * scale)

    const context = canvas.getContext('2d')
    if (!context) return file
    // JPEG no tiene transparencia: sin fondo, un PNG transparente saldría negro.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(drawable.source, 0, 0, canvas.width, canvas.height)
    drawable.release()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    )
    if (!blob || blob.size >= file.size) return file

    const name = file.name.replace(/\.[^.]+$/, '') || 'imagen'
    return new File([blob], `${name}.jpg`, { type: 'image/jpeg' })
  } catch {
    return file
  }
}
