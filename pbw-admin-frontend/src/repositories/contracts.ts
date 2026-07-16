export interface ListRepository<T extends { id: number }> {
  list(): Promise<T[]>
  remove(id: number): Promise<void>
}

export interface SingletonRepository<T> {
  get(): Promise<T>
}

export interface ResettableRepository {
  reset(): void
}
