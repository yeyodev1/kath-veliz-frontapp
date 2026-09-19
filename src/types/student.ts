// Tipos del checkout y del área del alumno. Siguen el CONTRATO-API tal cual;
// se definen acá (y no en types/catalog.ts) para que esta área no dependa de otra.

export type ProductType = 'course' | 'download' | 'service' | 'free'
export type SaleMode = 'open' | 'waitlist' | 'closed'
export type AccessStatus = 'vigente' | 'vencido' | 'revocado'

export interface StudentCover {
  url: string
  publicId?: string
}

/** Lo mínimo de un producto que usan el checkout y "Mis cursos". */
export interface StudentProduct {
  id: string
  slug: string
  type: ProductType
  title: string
  subtitle?: string
  cover: StudentCover | null
  priceCents: number
  compareAtPriceCents: number | null
  saleMode?: SaleMode
  accessDurationDays?: number | null
  lessonCount?: number
}

/** Usuario de sesión con la cédula, que Payphone exige en cada cobro. */
export interface BuyerUser {
  id: string
  email: string
  name: string
  phone: string
  documentId?: string
  accountType: string
}

export interface BuyerData {
  phone: string
  documentId: string
}

export interface CouponResult {
  code: string
  percentOff: number
  discountCents: number
  totalCents: number
}

export interface CreateOrderPayload {
  productSlug: string
  couponCode?: string
  phone: string
  documentId: string
  serviceRequestId?: string
}

export interface OrderSummary {
  id: string
  subtotalCents?: number
  discountCents?: number
  totalCents: number
  status?: 'pending' | 'paid' | 'canceled' | 'failed'
  clientTransactionId?: string
}

/** Configuración de la Cajita: llega completa del backend, nunca se quema acá. */
export interface PayphoneConfig {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  amountWithTax?: number
  tax?: number
  service?: number
  tip?: number
  currency: string
  reference: string
  email: string
  phoneNumber: string
  documentId: string
}

export interface CreateOrderResponse {
  order: OrderSummary
  payphone: PayphoneConfig | null
}

export type PaymentStatus = 'paid' | 'canceled' | 'failed'

export interface ConfirmOrderResponse {
  status: PaymentStatus
  order: OrderSummary
  product: { slug: string; title: string; type: ProductType }
}

export interface AccessInfo {
  status: AccessStatus
  expiresAt: string | null
}

export interface ProgressSummary {
  completedLessons: number
  totalLessons: number
  percent: number
  lastLessonId: string | null
}

export interface MyProduct {
  product: StudentProduct
  access: AccessInfo
  progress: ProgressSummary
}

export interface LessonAttachment {
  name: string
  url: string
}

export interface LearnLesson {
  id: string
  title: string
  description: string
  durationSeconds: number
  attachments: LessonAttachment[]
  completed: boolean
  positionSeconds: number
}

export interface LearnModule {
  id: string
  title: string
  lessons: LearnLesson[]
}

export interface LiveSession {
  id: string
  title: string
  description?: string
  startsAt: string
  meetUrl: string
  // El backend puede mandar solo el id o la lección poblada.
  recordingLesson: string | { id: string; title?: string } | null
}

export interface LearnProduct {
  product: StudentProduct
  access: AccessInfo
  modules: LearnModule[]
  liveSessions: LiveSession[]
  hasDownload: boolean
}

export interface Playback {
  embedUrl: string
  positionSeconds: number
  signed: boolean
}

export interface DownloadLink {
  url: string
  filename: string
}
