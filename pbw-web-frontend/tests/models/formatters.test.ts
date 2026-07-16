import { formatCount, formatPrice } from '@/shared/formatters'

describe('formatters', () => {
  it.each([
    [10_000_000, '1000万+'],
    [500_000, '50万+'],
    [20_000, '2万+'],
    [9_999, '9,999'],
  ])('将统计值 %s 格式化为 %s', (value, expected) => {
    expect(formatCount(value)).toBe(expected)
  })

  it.each([
    [0, '免费'],
    [49, '¥49'],
    [39.9, '¥39.90'],
  ])('将价格 %s 格式化为 %s', (value, expected) => {
    expect(formatPrice(value)).toBe(expected)
  })
})
