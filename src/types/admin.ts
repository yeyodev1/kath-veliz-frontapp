// Tipos del panel de administración. Siguen el CONTRATO-API: dinero en
// centavos, fechas ISO y `null` con significado ("no se revoca", "de por vida").

export type ProductType = 'course' | 'download' | 'service' | 'free'
export type SaleMode = 'open' | 'waitlist' | 'closed'
export type SurveyQuestionType = 'text' | 'textarea' | 'select'

export interface UploadedImage {
  url: string
  publicId: string
}

export interface UploadedFile extends UploadedImage {
  filename: string
}

export interface ProductFaq {
  question: string
  answer: string
}

export interface SurveyQuestion {
  label: string
  type: SurveyQuestionType
  options: string[]
  required: boolean
}

export interface AdminProduct {
  id: string
  type: ProductType
  slug: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  audience: string[]
  faqs: ProductFaq[]
  cover: UploadedImage | null
  priceCents: number
  compareAtPriceCents: number | null
  saleMode: SaleMode
  /** null = de por vida. */
  accessDurationDays: number | null
  isPublished: boolean
  order: number
  downloadFile: UploadedFile | null
  freeResourceUrl: string
  infoPdf: UploadedFile | null
  surveyQuestions: SurveyQuestion[]
}

export type AdminProductPayload = Omit<AdminProduct, 'id'>

export interface LessonAttachment {
  name: string
  url: string
  publicId: string
}

export interface AdminLesson {
  id: string
  module: string
  title: string
  description: string
  order: number
  bunnyVideoId: string
  videoStatus?: string | number | null
  durationSeconds: number
  attachments: LessonAttachment[]
  isFreePreview: boolean
  isPublished: boolean
}

export type AdminLessonPayload = Pick<
  AdminLesson,
  'title' | 'description' | 'attachments' | 'isFreePreview' | 'isPublished'
>

export interface AdminModule {
  id: string
  title: string
  description: string
  order: number
  lessons: AdminLesson[]
}

export interface ContentOrderPayload {
  modules: { id: string; lessons: string[] }[]
}

export interface VideoUploadTicket {
  videoId: string
  libraryId: string | number
  tus: { endpoint: string; signature: string; expire: number }
}

export interface VideoStatus {
  status: string | number
  ready: boolean
  durationSeconds: number
}

/** Una referencia puede llegar poblada (objeto) o como id suelto. */
export interface UserRef {
  id: string
  name: string
  email: string
  phone?: string
}

export interface ProductRef {
  id: string
  title: string
  slug?: string
  type?: ProductType
}

export interface LiveSession {
  id: string
  product: ProductRef | string
  title: string
  description: string
  startsAt: string
  meetUrl: string
  recordingLesson: { id: string; title: string } | string | null
}

export interface LiveSessionPayload {
  product: string
  title: string
  description: string
  startsAt: string
  meetUrl: string
  recordingLesson: string | null
}

export type AccessStatus = 'vigente' | 'vencido' | 'revocado'
export type AccessSource = 'purchase' | 'manual' | 'demo'

export interface AdminAccess {
  id: string
  user: UserRef | string
  product: ProductRef | string
  source: AccessSource
  status?: AccessStatus
  note: string
  /** null = no se revoca. */
  expiresAt: string | null
  revokedAt: string | null
  createdAt?: string
}

export interface GrantAccessPayload {
  email: string
  name?: string
  productIds: string[]
  /** Obligatorio: fecha ISO futura o null explícito. Nunca undefined. */
  expiresAt: string | null
  note: string
}

/** Estado del control de vencimiento: arranca sin nada elegido a propósito. */
export interface ExpiryChoice {
  mode: 'date' | 'never' | null
  date: string
}

export interface AdminStudent {
  id: string
  name: string
  email: string
  phone: string
  createdAt?: string
  accesses: AdminAccess[]
}

export type OrderStatus = 'pending' | 'paid' | 'canceled' | 'failed'

export interface AdminOrder {
  id: string
  user: UserRef | string
  items: { product: string; title: string; priceCents: number }[]
  subtotalCents: number
  discountCents: number
  totalCents: number
  coupon: string
  clientTransactionId: string
  status: OrderStatus
  paidAt: string | null
  createdAt?: string
}

export type LeadKind = 'free-resource' | 'waitlist' | 'newsletter'

export interface AdminLead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  kind: LeadKind
  couponCode: string
  product: ProductRef | string | null
  createdAt?: string
}

export type ServiceRequestStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export interface ServiceRequest {
  id: string
  product: ProductRef | string
  name: string
  email: string
  phone: string
  answers: { question: string; answer: string }[]
  status: ServiceRequestStatus
  adminNote: string
  createdAt?: string
}

export interface AdminCoupon {
  id: string
  code: string
  percentOff: number
  product: ProductRef | string | null
  expiresAt: string | null
  maxUses: number | null
  usedCount: number
  isActive: boolean
}

export interface CouponPayload {
  code: string
  percentOff: number
  product: string | null
  expiresAt: string | null
  maxUses: number | null
  isActive: boolean
}

export interface AdminStats {
  salesCents: number
  ordersPaid: number
  students: number
  leads: number
  pendingRequests: number
  activeAccesses: number
}

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
