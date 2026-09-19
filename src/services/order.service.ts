import APIBase from './httpBase'
import type {
  BuyerUser,
  ConfirmOrderResponse,
  CouponResult,
  CreateOrderPayload,
  CreateOrderResponse,
  ServiceRequestPrefill,
  StudentProduct,
} from '@/types/student'

class OrderService extends APIBase {
  async product(slug: string): Promise<StudentProduct> {
    const { data } = await this.get<StudentProduct>(`products/${encodeURIComponent(slug)}`)
    return data
  }

  async validateCoupon(code: string, productSlug: string): Promise<CouponResult> {
    const { data } = await this.post<CouponResult>('coupons/validate', { code, productSlug })
    return data
  }

  /** Guarda teléfono y cédula en la cuenta: Payphone los exige en cada cobro. */
  async saveBuyer(payload: {
    name: string
    phone: string
    documentId: string
  }): Promise<BuyerUser> {
    const { data } = await this.put<BuyerUser | { user: BuyerUser }>('auth/me', payload)
    // /auth/me del scaffold envuelve en { user }; el contrato lo devuelve desnudo.
    return 'user' in data ? data.user : data
  }

  /** Datos de la solicitud de asesoría aprobada, para no pedirlos otra vez. */
  async requestPrefill(id: string): Promise<ServiceRequestPrefill> {
    const { data } = await this.get<ServiceRequestPrefill>(
      `service-requests/${encodeURIComponent(id)}/prefill`,
    )
    return data
  }

  async create(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await this.post<CreateOrderResponse>('orders', payload)
    return data
  }

  async confirm(id: string, clientTransactionId: string): Promise<ConfirmOrderResponse> {
    // Payphone puede tardar en responderle al backend; mejor esperar que reintentar a ciegas.
    const { data } = await this.post<ConfirmOrderResponse>(
      'orders/confirm',
      { id, clientTransactionId },
      undefined,
      { timeout: 45000 },
    )
    return data
  }
}

export const orderService = new OrderService()
