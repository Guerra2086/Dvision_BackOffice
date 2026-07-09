export function formatPrice(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-PT', { year: 'numeric', month: 'short', day: '2-digit' })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-PT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
