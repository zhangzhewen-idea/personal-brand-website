import { http } from '@/api/http'

export interface CrudApi<TDto> {
  list(): Promise<TDto[]>
  remove(id: number): Promise<void>
}

type CrudListResponse<TDto> = TDto[] | { data: TDto[] }

const parseListResponse = <TDto>(data: CrudListResponse<TDto>): TDto[] =>
  Array.isArray(data) ? data : data.data

export const createCrudApi = <TDto>(endpoint: string): CrudApi<TDto> => ({
  async list() {
    const response = await http.get<CrudListResponse<TDto>>(endpoint)
    return parseListResponse(response.data)
  },

  async remove(id: number) {
    await http.delete(`${endpoint}/${id}`)
  },
})
