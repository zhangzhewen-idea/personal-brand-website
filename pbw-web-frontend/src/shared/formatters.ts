export function formatCount(value: number): string {
  if (value >= 10_000) {
    return `${Math.floor(value / 10_000)}万+`
  }
  return value.toLocaleString('zh-CN')
}

export function formatPrice(value: number): string {
  if (value === 0) return '免费'
  return Number.isInteger(value) ? `¥${value}` : `¥${value.toFixed(2)}`
}
