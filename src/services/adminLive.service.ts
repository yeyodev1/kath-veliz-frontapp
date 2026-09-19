import { AdminAPIBase } from './adminBase.service'
import type { LiveSession, LiveSessionPayload } from '@/types/admin'

class AdminLiveService extends AdminAPIBase {
  list(productId: string): Promise<LiveSession[]> {
    return this.fetchList<LiveSession>('admin/live-sessions', { product: productId })
  }

  createSession(payload: LiveSessionPayload): Promise<LiveSession> {
    return this.create<LiveSession>('admin/live-sessions', payload)
  }

  updateSession(id: string, payload: Partial<LiveSessionPayload>): Promise<LiveSession> {
    return this.update<LiveSession>(`admin/live-sessions/${id}`, payload)
  }

  deleteSession(id: string): Promise<void> {
    return this.remove(`admin/live-sessions/${id}`)
  }

  /** Correo a todas las personas con acceso vigente al producto. Devuelve cuántos salieron. */
  notify(id: string): Promise<{ sent: number }> {
    return this.create<{ sent: number }>(`admin/live-sessions/${id}/notify`)
  }
}

export const adminLiveService = new AdminLiveService()
