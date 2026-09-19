import APIBase from './httpBase'
import type { LeadPayload, ServiceRequestPayload } from '@/types/catalog'

class LeadService extends APIBase {
  /** free-resource, waitlist o newsletter: el backend decide qué correo envía. */
  async create(payload: LeadPayload): Promise<{ ok: boolean; message?: string }> {
    const { data } = await this.post<{ ok: boolean; message?: string }>('leads', payload)
    return data
  }

  /** Encuesta de la asesoría: dispara el correo con el PDF informativo. */
  async requestService(payload: ServiceRequestPayload): Promise<{ ok: boolean }> {
    const { data } = await this.post<{ ok: boolean }>('service-requests', payload)
    return data
  }
}

export const leadService = new LeadService()
