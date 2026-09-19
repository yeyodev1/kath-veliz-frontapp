import { AdminAPIBase, type Query } from './adminBase.service'
import type { Paginated } from '@/types'
import type { AdminLead } from '@/types/admin'

class AdminLeadsService extends AdminAPIBase {
  list(query: Query): Promise<Paginated<AdminLead>> {
    return this.fetchPage<AdminLead>('admin/leads', query)
  }

  /**
   * El CSV está detrás del Bearer, así que un <a href> no sirve: se pide como
   * blob con la sesión y se dispara la descarga desde el navegador.
   */
  async exportCsv(query: Query): Promise<void> {
    const params: Record<string, string> = {}
    for (const [key, value] of Object.entries(query)) if (value) params[key] = String(value)

    const { data } = await this.get<Blob>('admin/leads/export.csv', undefined, {
      params,
      responseType: 'blob',
      timeout: 60000,
    })

    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = `contactos-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }
}

export const adminLeadsService = new AdminLeadsService()
