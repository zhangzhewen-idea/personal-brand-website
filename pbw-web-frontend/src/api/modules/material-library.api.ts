import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { MaterialLibraryItem } from '@/models'

export async function getMaterials(): Promise<MaterialLibraryItem[]> {
  const { data } = await http.get<MaterialLibraryItem[]>(endpoints.materials)
  return data
}
