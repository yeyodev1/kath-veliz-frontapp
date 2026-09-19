import { AdminAPIBase, type Query } from './adminBase.service'
import type { Paginated } from '@/types'
import type {
  AdminCoupon,
  AdminOrder,
  AdminStats,
  CouponPayload,
  ServiceRequest,
  ServiceRequestStatus,
} from '@/types/admin'

class AdminSalesService extends AdminAPIBase {
  stats(): Promise<AdminStats> {
    return this.fetch<AdminStats>('admin/stats')
  }

  orders(query: Query): Promise<Paginated<AdminOrder>> {
    return this.fetchPage<AdminOrder>('admin/orders', query)
  }

  requests(status: ServiceRequestStatus | ''): Promise<ServiceRequest[]> {
    return this.fetchList<ServiceRequest>('admin/service-requests', { status })
  }

  approveRequest(id: string, adminNote: string): Promise<unknown> {
    return this.create<unknown>(`admin/service-requests/${id}/approve`, { adminNote })
  }

  rejectRequest(id: string, adminNote: string): Promise<unknown> {
    return this.create<unknown>(`admin/service-requests/${id}/reject`, { adminNote })
  }

  coupons(): Promise<AdminCoupon[]> {
    return this.fetchList<AdminCoupon>('admin/coupons')
  }

  createCoupon(payload: CouponPayload): Promise<AdminCoupon> {
    return this.create<AdminCoupon>('admin/coupons', payload)
  }

  updateCoupon(id: string, payload: Partial<CouponPayload>): Promise<AdminCoupon> {
    return this.update<AdminCoupon>(`admin/coupons/${id}`, payload)
  }

  deleteCoupon(id: string): Promise<void> {
    return this.remove(`admin/coupons/${id}`)
  }
}

export const adminSalesService = new AdminSalesService()
