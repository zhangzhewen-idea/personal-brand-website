import { endpoints } from '@/api/endpoints'
import http from '@/api/http'
import type { MatrixAccount } from '@/models'

export async function getMatrixAccounts(): Promise<MatrixAccount[]> {
  const { data } = await http.get<MatrixAccount[]>(endpoints.matrixAccounts)
  return data
}
