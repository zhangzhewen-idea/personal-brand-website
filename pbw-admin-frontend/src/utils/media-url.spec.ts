import { describe, expect, it } from 'vitest'
import { resolveMediaUrl } from './media-url'

describe('resolveMediaUrl', () => {
  const productionBaseUrl = 'https://pwb-backend.harmonies.cc'

  it('生产环境为后端相对媒体路径添加域名', () => {
    expect(resolveMediaUrl('/uploads/image/example.webp', productionBaseUrl))
      .toBe('https://pwb-backend.harmonies.cc/uploads/image/example.webp')
    expect(resolveMediaUrl('uploads/video/example.mp4', productionBaseUrl))
      .toBe('https://pwb-backend.harmonies.cc/uploads/video/example.mp4')
  })

  it('保留完整地址并支持开发环境后端地址', () => {
    expect(resolveMediaUrl('https://cdn.example.com/image.webp', productionBaseUrl))
      .toBe('https://cdn.example.com/image.webp')
    expect(resolveMediaUrl('blob:http://localhost/example', productionBaseUrl))
      .toBe('blob:http://localhost/example')
    expect(resolveMediaUrl('/uploads/image/example.webp', 'http://localhost:8080'))
      .toBe('http://localhost:8080/uploads/image/example.webp')
  })
})
