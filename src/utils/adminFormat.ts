import type { AccessStatus, AdminAccess, ProductRef, UserRef } from '@/types/admin'

// Ecuador continental no tiene horario de verano: siempre UTC-5. Fijar el
// desfase evita que una fecha cambie de día si Kath abre el panel de viaje.
const TIME_ZONE = 'America/Guayaquil'
const OFFSET = '-05:00'
const OFFSET_MS = 5 * 60 * 60 * 1000

const money = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

const dateFormat = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TIME_ZONE,
})

const dateTimeFormat = new Intl.DateTimeFormat('es-EC', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: TIME_ZONE,
})

/** 4990 → "$49,90". */
export function formatCents(cents: number | null | undefined): string {
  return money.format((cents || 0) / 100)
}

/** Centavos del API → texto para el input en dólares ("49.90"). */
export function centsToInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return ''
  return (cents / 100).toFixed(2)
}

/** Input en dólares (acepta coma o punto) → centavos enteros, o null si está vacío o no es número. */
export function inputToCents(value: string | number): number | null {
  const text = String(value ?? '')
    .trim()
    .replace(',', '.')
  if (!text) return null
  const amount = Number(text)
  if (!Number.isFinite(amount) || amount < 0) return null
  return Math.round(amount * 100)
}

export function formatDateEc(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : dateFormat.format(parsed)
}

export function formatDateTimeEc(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : dateTimeFormat.format(parsed)
}

/** ISO → "YYYY-MM-DD" en hora de Ecuador, para <input type="date">. */
export function isoToDateInput(iso: string | null | undefined): string {
  if (!iso) return ''
  const time = new Date(iso).getTime()
  if (Number.isNaN(time)) return ''
  return new Date(time - OFFSET_MS).toISOString().slice(0, 10)
}

/** "YYYY-MM-DD" → ISO al final de ese día en Ecuador: el acceso dura todo el día elegido. */
export function dateInputToIso(value: string): string {
  return new Date(`${value}T23:59:59${OFFSET}`).toISOString()
}

/** ISO → "YYYY-MM-DDTHH:mm" en hora de Ecuador, para <input type="datetime-local">. */
export function isoToDateTimeInput(iso: string | null | undefined): string {
  if (!iso) return ''
  const time = new Date(iso).getTime()
  if (Number.isNaN(time)) return ''
  return new Date(time - OFFSET_MS).toISOString().slice(0, 16)
}

export function dateTimeInputToIso(value: string): string {
  return new Date(`${value}:00${OFFSET}`).toISOString()
}

/** Mañana (en Ecuador) como "YYYY-MM-DD": mínimo permitido para un vencimiento. */
export function tomorrowDateInput(): string {
  return new Date(Date.now() - OFFSET_MS + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export function formatDuration(seconds: number | null | undefined): string {
  const total = Math.round(seconds || 0)
  if (!total) return ''
  const minutes = Math.floor(total / 60)
  const rest = String(total % 60).padStart(2, '0')
  return `${minutes}:${rest} min`
}

export function refUser(ref: UserRef | string | null | undefined): UserRef {
  if (ref && typeof ref === 'object') return ref
  return { id: ref || '', name: '', email: '' }
}

export function refProduct(ref: ProductRef | string | null | undefined): ProductRef {
  if (ref && typeof ref === 'object') return ref
  return { id: ref || '', title: '' }
}

/**
 * El estado lo decide el backend (`status`). Esto es solo un respaldo para
 * pintar el badge si una respuesta llega sin ese campo.
 */
export function accessStatus(access: AdminAccess): AccessStatus {
  if (access.status) return access.status
  if (access.revokedAt) return 'revocado'
  if (access.expiresAt && new Date(access.expiresAt).getTime() <= Date.now()) return 'vencido'
  return 'vigente'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
