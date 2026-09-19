import { computed, reactive } from 'vue'
import type { ExpiryChoice } from '@/types/admin'
import { dateInputToIso, tomorrowDateInput } from '@/utils/adminFormat'

/**
 * Vencimiento de un acceso. Arranca SIN opción elegida: un valor por defecto
 * silencioso termina regalando acceso de por vida (o cortándolo) sin que nadie
 * lo haya decidido. Mientras no sea válido, el formulario no se puede enviar.
 */
export function useExpiryChoice() {
  const choice = reactive<ExpiryChoice>({ mode: null, date: '' })
  const minDate = tomorrowDateInput()

  const isValid = computed(() => {
    if (choice.mode === 'never') return true
    // Las fechas "YYYY-MM-DD" se comparan bien como texto.
    return choice.mode === 'date' && Boolean(choice.date) && choice.date >= minDate
  })

  /** Fecha ISO o `null` explícito. Solo tiene sentido llamarlo si `isValid`. */
  function toPayload(): string | null {
    return choice.mode === 'date' ? dateInputToIso(choice.date) : null
  }

  function reset() {
    choice.mode = null
    choice.date = ''
  }

  return { choice, minDate, isValid, toPayload, reset }
}
