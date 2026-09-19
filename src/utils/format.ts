const money = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatMoney(value: number): string {
  return money.format(value)
}

/**
 * Precio desde centavos: 1990 → "$19.90". Se arma a mano y no con Intl porque
 * es-EC usa coma decimal ("$19,90") y la marca escribe sus precios con punto.
 */
export function formatPrice(cents: number): string {
  const safe = Number.isFinite(cents) ? Math.round(cents) : 0
  const sign = safe < 0 ? '-' : ''
  const abs = Math.abs(safe)
  const dollars = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const rest = (abs % 100).toString().padStart(2, '0')
  return `${sign}$${dollars}.${rest}`
}

/**
 * Duración legible desde segundos: 95 → "1:35" (para una lección),
 * 5400 → "1 h 30 min" con `long` (para el total de un curso).
 */
export function formatDuration(seconds: number, long = false): string {
  const total = Math.max(0, Math.round(seconds || 0))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60

  if (long) {
    if (h && m) return `${h} h ${m} min`
    if (h) return `${h} h`
    return `${Math.max(m, total ? 1 : 0)} min`
  }

  const mm = h ? m.toString().padStart(2, '0') : m.toString()
  const ss = s.toString().padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

const date = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value: string | Date): string {
  return date.format(typeof value === 'string' ? new Date(value) : value)
}

const dateTime = new Intl.DateTimeFormat('es-EC', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: '2-digit',
})

/** "jueves, 15 de octubre, 19:00" — para las clases en vivo. */
export function formatDateTime(value: string | Date): string {
  return dateTime.format(typeof value === 'string' ? new Date(value) : value)
}
