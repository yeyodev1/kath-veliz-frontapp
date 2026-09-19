import { AdminAPIBase, type Query } from './adminBase.service'
import type { Paginated } from '@/types'
import type { AdminAccess, AdminStudent, GrantAccessPayload } from '@/types/admin'

class AdminAccessService extends AdminAPIBase {
  list(query: Query): Promise<Paginated<AdminAccess>> {
    return this.fetchPage<AdminAccess>('admin/access', query)
  }

  /** `expiresAt` viaja siempre: fecha ISO o `null` explícito. El backend rechaza si falta. */
  grant(payload: GrantAccessPayload): Promise<unknown> {
    return this.create<unknown>('admin/access', payload)
  }

  updateExpiry(id: string, expiresAt: string | null): Promise<AdminAccess> {
    return this.update<AdminAccess>(`admin/access/${id}`, { expiresAt })
  }

  revoke(id: string): Promise<unknown> {
    return this.create<unknown>(`admin/access/${id}/revoke`)
  }

  students(query: Query): Promise<Paginated<AdminStudent>> {
    return this.fetchPage<AdminStudent>('admin/students', query)
  }
}

export const adminAccessService = new AdminAccessService()
