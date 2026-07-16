import { http } from '@/api/http'

export interface CrudApi<TDto> {
  list(): Promise<TDto[]>
  remove(id: number): Promise<void>
}

export const createCrudApi = <TDto>(endpoint: string): CrudApi<TDto> => ({
  async list() {
    const response = await http.get<TDto[]>(endpoint)
    return response.data
  },

  async remove(id: number) {
    await http.delete(`${endpoint}/${id}`)
  },
})
