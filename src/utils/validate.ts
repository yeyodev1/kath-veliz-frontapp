/** Validación mínima de correo: el veredicto final lo da el backend. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

/** Deja solo dígitos y el "+" inicial: la gente escribe espacios, guiones y paréntesis. */
function phoneDigits(raw: string): string {
  const trimmed = raw.trim()
  return (trimmed.startsWith('+') ? '+' : '') + trimmed.replace(/\D/g, '')
}

/** Payphone pide el celular como +593984111222; la gente escribe 0984111222. */
export function normalizePhone(raw: string): string {
  const digits = phoneDigits(raw)
  if (/^09\d{8}$/.test(digits)) return `+593${digits.slice(1)}`
  if (/^\+?5939\d{8}$/.test(digits)) return `+${digits.replace('+', '')}`
  // Hay quien escribe +593 y deja el cero: +593 099 123 4567.
  if (/^\+?59309\d{8}$/.test(digits)) return `+593${digits.replace('+', '').slice(4)}`
  return digits
}

/** De vuelta a como se escribe acá, para precargar el campo. */
export function displayPhone(stored: string): string {
  return /^\+5939\d{8}$/.test(stored) ? `0${stored.slice(4)}` : stored
}

/**
 * Celular ecuatoriano (09XXXXXXXX o +593…). Un número de otro país pasa solo si
 * viene con su código (+1…, +34…): hay clientas que viven fuera.
 */
export function isMobilePhone(raw: string): boolean {
  const phone = normalizePhone(raw)
  if (phone.startsWith('+593')) return /^\+5939\d{8}$/.test(phone)
  return /^\+\d{8,15}$/.test(phone)
}

/** Cédula (10 dígitos), RUC (13) o pasaporte (letras y números). */
export function isDocumentId(raw: string): boolean {
  const value = raw.trim()
  if (/^\d+$/.test(value)) return value.length === 10 || value.length === 13
  return /^[A-Za-z0-9]{6,20}$/.test(value)
}
