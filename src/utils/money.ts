// El API habla siempre en centavos enteros; solo acá se convierten a dólares.
const usd = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatCents(cents: number): string {
  return usd.format((Number.isFinite(cents) ? cents : 0) / 100)
}
