import APIBase from './httpBase'
import type { DownloadLink, LearnProduct, MyProduct, Playback } from '@/types/student'

class StudentService extends APIBase {
  async myProducts(): Promise<MyProduct[]> {
    const { data } = await this.get<MyProduct[]>('me/products')
    return data
  }

  async learn(slug: string): Promise<LearnProduct> {
    const { data } = await this.get<LearnProduct>(`me/products/${encodeURIComponent(slug)}`)
    return data
  }

  /** La URL del video viene firmada y con vencimiento: se pide cada vez, no se guarda. */
  async playback(lessonId: string): Promise<Playback> {
    const { data } = await this.get<Playback>(`lessons/${lessonId}/playback`)
    return data
  }

  async saveProgress(
    lessonId: string,
    positionSeconds: number,
    completed?: boolean,
  ): Promise<void> {
    // `completed` solo viaja cuando es true: un guardado de posición no debe
    // desmarcar una clase que ya se vio.
    const body = completed ? { positionSeconds, completed: true } : { positionSeconds }
    await this.post<{ ok: boolean }>(`lessons/${lessonId}/progress`, body)
  }

  async downloadLink(slug: string): Promise<DownloadLink> {
    const { data } = await this.get<DownloadLink>(
      `me/products/${encodeURIComponent(slug)}/download`,
    )
    return data
  }
}

export const studentService = new StudentService()
