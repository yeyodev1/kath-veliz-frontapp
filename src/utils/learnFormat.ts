// Fechas del área del alumno: siempre en hora de Ecuador, sin importar desde
// dónde se conecte la alumna (una clase en vivo es a una hora de Guayaquil).
const TIME_ZONE = 'America/Guayaquil'

const longDate = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TIME_ZONE,
})

const dateTime = new Intl.DateTimeFormat('es-EC', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: TIME_ZONE,
})

export function formatLongDate(value: string | Date): string {
  return longDate.format(new Date(value))
}

export function formatDateTime(value: string | Date): string {
  const text = dateTime.format(new Date(value))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** 754 → "12:34"; 3725 → "1:02:05". */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0))
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}
