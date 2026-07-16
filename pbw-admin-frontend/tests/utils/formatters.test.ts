import { describe, expect, it } from 'vitest'
import { formatCompactNumber, formatCurrency } from '@/utils/formatters'

describe('formatters', () => {
  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])('金额对非有限数返回 ¥0.00: %s', (value) => {
    expect(formatCurrency(value)).toBe('¥0.00')
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])('紧凑数字对非有限数返回 0: %s', (value) => {
    expect(formatCompactNumber(value)).toBe('0')
  })

  it('保留中文万级展示', () => {
    expect(formatCompactNumber(12800000)).toBe('1280万')
  })
})
