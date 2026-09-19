import { AdminAPIBase } from './adminBase.service'
import type {
  AdminLesson,
  AdminLessonPayload,
  AdminModule,
  AdminProduct,
  AdminProductPayload,
  ContentOrderPayload,
  VideoStatus,
  VideoUploadTicket,
} from '@/types/admin'

class AdminProductsService extends AdminAPIBase {
  list(): Promise<AdminProduct[]> {
    return this.fetchList<AdminProduct>('admin/products')
  }

  /** null si el producto ya no existe: la vista decide qué mostrar. */
  async getById(id: string): Promise<AdminProduct | null> {
    try {
      return await this.fetch<AdminProduct>(`admin/products/${id}`)
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null
      throw error
    }
  }

  createProduct(payload: AdminProductPayload): Promise<AdminProduct> {
    return this.create<AdminProduct>('admin/products', payload)
  }

  updateProduct(id: string, payload: Partial<AdminProductPayload>): Promise<AdminProduct> {
    return this.update<AdminProduct>(`admin/products/${id}`, payload)
  }

  deleteProduct(id: string): Promise<void> {
    return this.remove(`admin/products/${id}`)
  }

  async content(productId: string): Promise<AdminModule[]> {
    const data = await this.fetch<{ modules?: AdminModule[] }>(
      `admin/products/${productId}/content`,
    )
    return (data.modules || []).map((module) => ({ ...module, lessons: module.lessons || [] }))
  }

  createModule(
    productId: string,
    payload: { title: string; description: string },
  ): Promise<AdminModule> {
    return this.create<AdminModule>(`admin/products/${productId}/modules`, payload)
  }

  updateModule(id: string, payload: { title: string; description: string }): Promise<AdminModule> {
    return this.update<AdminModule>(`admin/modules/${id}`, payload)
  }

  deleteModule(id: string): Promise<void> {
    return this.remove(`admin/modules/${id}`)
  }

  createLesson(moduleId: string, payload: AdminLessonPayload): Promise<AdminLesson> {
    return this.create<AdminLesson>(`admin/modules/${moduleId}/lessons`, payload)
  }

  updateLesson(id: string, payload: Partial<AdminLessonPayload>): Promise<AdminLesson> {
    return this.update<AdminLesson>(`admin/lessons/${id}`, payload)
  }

  deleteLesson(id: string): Promise<void> {
    return this.remove(`admin/lessons/${id}`)
  }

  saveOrder(productId: string, payload: ContentOrderPayload): Promise<unknown> {
    return this.replace<unknown>(`admin/products/${productId}/order`, payload)
  }

  /** Pide al backend el video en Bunny y la firma para subirlo directo por TUS. */
  requestVideoUpload(lessonId: string, title?: string): Promise<VideoUploadTicket> {
    return this.create<VideoUploadTicket>(`admin/lessons/${lessonId}/video`, title ? { title } : {})
  }

  videoStatus(lessonId: string): Promise<VideoStatus> {
    return this.fetch<VideoStatus>(`admin/lessons/${lessonId}/video-status`)
  }
}

export const adminProductsService = new AdminProductsService()
