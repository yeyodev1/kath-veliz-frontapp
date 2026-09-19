import APIBase from './httpBase'
import type { LessonPlayback, ProductCard, ProductDetail, ProductType } from '@/types/catalog'

class ProductService extends APIBase {
  /** Solo productos publicados, ya ordenados por `order`. */
  async list(type?: ProductType): Promise<ProductCard[]> {
    const { data } = await this.get<ProductCard[]>('products', undefined, {
      params: type ? { type } : undefined,
    })
    return Array.isArray(data) ? data : []
  }

  async bySlug(slug: string): Promise<ProductDetail> {
    const { data } = await this.get<ProductDetail>(`products/${encodeURIComponent(slug)}`)
    return data
  }

  /** Las lecciones con `isFreePreview` se reproducen sin sesión ni acceso. */
  async playback(lessonId: string): Promise<LessonPlayback> {
    const { data } = await this.get<LessonPlayback>(`lessons/${lessonId}/playback`)
    return data
  }
}

export const productService = new ProductService()
