/** Tipos del catálogo público. Reflejan el contrato del API (CONTRATO-API.md). */

export type ProductType = 'course' | 'download' | 'service' | 'free'
export type SaleMode = 'open' | 'waitlist' | 'closed'
export type LeadKind = 'free-resource' | 'waitlist' | 'newsletter'

export interface ProductCover {
  url: string
  publicId?: string
}

/** Lo que devuelve GET /products: lo justo para pintar una tarjeta. */
export interface ProductCard {
  id: string
  slug: string
  type: ProductType
  title: string
  subtitle: string
  cover: ProductCover | null
  /** Siempre enteros en centavos; el front formatea con formatPrice. */
  priceCents: number
  compareAtPriceCents: number | null
  saleMode: SaleMode
  /** null = acceso de por vida. */
  accessDurationDays: number | null
  lessonCount?: number
  totalDurationSeconds?: number
}

export interface ProductFaq {
  question: string
  answer: string
}

export interface SurveyQuestion {
  label: string
  type: 'text' | 'textarea' | 'select'
  options: string[]
  required: boolean
}

export interface LessonPreview {
  id: string
  title: string
  durationSeconds: number
  isFreePreview: boolean
}

export interface ProductModule {
  id?: string
  title: string
  description?: string
  lessons: LessonPreview[]
}

export interface LiveSessionPreview {
  id?: string
  title: string
  description?: string
  startsAt: string
}

/** GET /products/:slug. Nunca trae bunnyVideoId ni URLs de archivos. */
export interface ProductDetail extends ProductCard {
  description: string
  highlights: string[]
  audience: string[]
  faqs: ProductFaq[]
  surveyQuestions: SurveyQuestion[]
  modules: ProductModule[]
  lessonCount: number
  totalDurationSeconds: number
  nextLiveSessions: LiveSessionPreview[]
}

export interface LeadPayload {
  name: string
  email: string
  phone?: string
  /** Slug de la landing desde la que llega, o "footer". */
  source: string
  productSlug?: string
  kind: LeadKind
}

export interface SurveyAnswer {
  question: string
  answer: string
}

export interface ServiceRequestPayload {
  productSlug: string
  name: string
  email: string
  phone: string
  answers: SurveyAnswer[]
}

export interface LessonPlayback {
  embedUrl: string
  positionSeconds: number
  signed: boolean
}
