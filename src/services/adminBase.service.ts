import type { AxiosRequestConfig } from 'axios'
import APIBase from './httpBase'
import type { Paginated } from '@/types'

export type Query = Record<string, string | number | boolean | null | undefined>

/** Los filtros vacíos no viajan: `?status=` haría que el backend filtre por cadena vacía. */
function cleanQuery(query: Query = {}): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== '') params[key] = value
  }
  return params
}

/**
 * Mongoose serializa `_id`; el contrato habla de `id`. Se normaliza una sola
 * vez aquí para que ninguna vista tenga que preguntarse cuál llegó.
 */
export function normalizeIds<T>(value: unknown): T {
  if (Array.isArray(value)) return value.map((item) => normalizeIds(item)) as T
  if (value && typeof value === 'object' && !(value instanceof Blob)) {
    const source = value as Record<string, unknown>
    const result: Record<string, unknown> = {}
    for (const [key, inner] of Object.entries(source)) result[key] = normalizeIds(inner)
    if (result.id === undefined && source._id !== undefined) result.id = String(source._id)
    return result as T
  }
  return value as T
}

/** Acepta tanto `{ items, total, page, pages }` como un arreglo desnudo. */
function toPage<T>(data: unknown): Paginated<T> {
  if (Array.isArray(data)) return { items: data as T[], total: data.length, page: 1, pages: 1 }
  const page = (data || {}) as Partial<Paginated<T>>
  const items = Array.isArray(page.items) ? page.items : []
  return {
    items,
    total: page.total ?? items.length,
    page: page.page ?? 1,
    pages: page.pages ?? 1,
  }
}

/** Base de los servicios del panel: mismas llamadas de APIBase, con ids y páginas normalizados. */
export class AdminAPIBase extends APIBase {
  protected async fetch<T>(endpoint: string, query?: Query): Promise<T> {
    const { data } = await this.get<unknown>(endpoint, undefined, { params: cleanQuery(query) })
    return normalizeIds<T>(data)
  }

  protected async fetchList<T>(endpoint: string, query?: Query): Promise<T[]> {
    return toPage<T>(await this.fetch<unknown>(endpoint, query)).items
  }

  protected async fetchPage<T>(endpoint: string, query?: Query): Promise<Paginated<T>> {
    return toPage<T>(await this.fetch<unknown>(endpoint, query))
  }

  protected async create<T>(
    endpoint: string,
    body: unknown = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.post<unknown>(endpoint, body, undefined, config)
    return normalizeIds<T>(data)
  }

  protected async update<T>(endpoint: string, body: unknown): Promise<T> {
    const { data } = await this.patch<unknown>(endpoint, body)
    return normalizeIds<T>(data)
  }

  protected async replace<T>(endpoint: string, body: unknown): Promise<T> {
    const { data } = await this.put<unknown>(endpoint, body)
    return normalizeIds<T>(data)
  }

  protected async remove(endpoint: string): Promise<void> {
    await this.delete<unknown>(endpoint)
  }
}
