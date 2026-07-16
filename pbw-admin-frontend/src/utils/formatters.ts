export const formatCurrency = (value: number) => Number.isFinite(value) ? `¥${value.toFixed(2)}` : '¥0.00'

export const formatCompactNumber = (value: number) => {
  if (!Number.isFinite(value)) return '0'
  const absolute = Math.abs(value)
  if (absolute >= 10000) {
    const unit = absolute >= 100000000 ? '亿' : '万'
    const divisor = unit === '亿' ? 100000000 : 10000
    const compact = value / divisor
    return `${Number(compact.toFixed(1))}${unit}`
  }
  return new Intl.NumberFormat('zh-CN').format(value)
}

export const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(date)
}
