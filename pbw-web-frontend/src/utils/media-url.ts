export function resolveMediaUrl(value: string | null | undefined, mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL) {
  if (!value || !mediaBaseUrl || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return value || ''
  return `${mediaBaseUrl.replace(/\/$/, '')}/${value.replace(/^\//, '')}`
}
