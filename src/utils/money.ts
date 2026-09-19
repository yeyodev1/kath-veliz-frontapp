import { formatPrice } from './format'

// El API habla siempre en centavos enteros; solo acá se convierten a dólares.
// Mismo formato que las landings ("$200.00"): un precio no puede cambiar de
// coma a punto entre la página del producto y el checkout.
export function formatCents(cents: number): string {
  return formatPrice(Number.isFinite(cents) ? cents : 0)
}
