import { apiClient } from '@/api/client'

export interface UploadedFile {
  fileKey: string
  url: string
  originalName: string
  contentType: string
  fileSize: number
  mediaType: 'image' | 'video'
}

export const fileApi = {
  upload(file: File, mediaType: 'image' | 'video', onProgress?: (percentage: number) => void) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('mediaType', mediaType)
    return apiClient.post<UploadedFile>('/admin/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total) onProgress?.(Math.round((event.loaded * 100) / event.total))
      },
    })
  },
}
