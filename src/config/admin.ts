import type {
  AccessSource,
  AccessStatus,
  BadgeTone,
  LeadKind,
  OrderStatus,
  ProductType,
  SaleMode,
  ServiceRequestStatus,
  SurveyQuestionType,
} from '@/types/admin'

/**
 * Copy y configuración del panel. Kath no es técnica: los textos dicen qué pasa
 * en palabras de todos los días, sin jerga.
 */

export interface AdminNavItem {
  label: string
  short: string
  to: string
  icon: string
  /** Aparece en la barra inferior del celular; el resto va en "Más". */
  primary?: boolean
}

export const adminNav: AdminNavItem[] = [
  { label: 'Resumen', short: 'Resumen', to: '/admin', icon: 'fa-solid fa-house', primary: true },
  {
    label: 'Productos',
    short: 'Productos',
    to: '/admin/productos',
    icon: 'fa-solid fa-box-open',
    primary: true,
  },
  {
    label: 'Alumnos y accesos',
    short: 'Accesos',
    to: '/admin/accesos',
    icon: 'fa-solid fa-key',
    primary: true,
  },
  {
    label: 'Solicitudes de asesoría',
    short: 'Solicitudes',
    to: '/admin/solicitudes',
    icon: 'fa-solid fa-clipboard-list',
    primary: true,
  },
  { label: 'Clases en vivo', short: 'En vivo', to: '/admin/en-vivo', icon: 'fa-solid fa-video' },
  {
    label: 'Lista de alumnos',
    short: 'Alumnos',
    to: '/admin/alumnos',
    icon: 'fa-solid fa-user-graduate',
  },
  { label: 'Órdenes', short: 'Órdenes', to: '/admin/ordenes', icon: 'fa-solid fa-receipt' },
  {
    label: 'Contactos (leads)',
    short: 'Contactos',
    to: '/admin/leads',
    icon: 'fa-solid fa-address-book',
  },
  { label: 'Cupones', short: 'Cupones', to: '/admin/cupones', icon: 'fa-solid fa-ticket' },
]

export const productTypeLabels: Record<ProductType, string> = {
  course: 'Curso',
  download: 'Descargable',
  service: 'Asesoría',
  free: 'Recurso gratuito',
}

export const productTypeHints: Record<ProductType, string> = {
  course: 'Módulos y lecciones en video. Puede tener clases en vivo.',
  download: 'Un archivo que se descarga después de comprar (por ejemplo, la plantilla de Excel).',
  service: 'La persona llena una encuesta y tú decides si la aceptas antes de que pague.',
  free: 'Se entrega gratis a cambio del nombre y el correo.',
}

export const saleModeLabels: Record<SaleMode, string> = {
  open: 'A la venta',
  waitlist: 'Lista de espera',
  closed: 'Cerrado',
}

export const saleModeHints: Record<SaleMode, string> = {
  open: 'Cualquiera puede comprarlo ahora.',
  waitlist: 'No se puede comprar: la persona deja su correo y recibe un cupón de 10%.',
  closed: 'Se ve en la web, pero no se puede comprar ni dejar el correo.',
}

export const surveyTypeLabels: Record<SurveyQuestionType, string> = {
  text: 'Respuesta corta',
  textarea: 'Respuesta larga',
  select: 'Elegir de una lista',
}

export const accessStatusLabels: Record<AccessStatus, string> = {
  vigente: 'Vigente',
  vencido: 'Vencido',
  revocado: 'Revocado',
}

export const accessStatusTones: Record<AccessStatus, BadgeTone> = {
  vigente: 'success',
  vencido: 'warning',
  revocado: 'danger',
}

export const accessSourceLabels: Record<AccessSource, string> = {
  purchase: 'Compra',
  manual: 'Manual',
  demo: 'Demo',
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagada',
  canceled: 'Cancelada',
  failed: 'Fallida',
}

export const orderStatusTones: Record<OrderStatus, BadgeTone> = {
  pending: 'warning',
  paid: 'success',
  canceled: 'neutral',
  failed: 'danger',
}

export const leadKindLabels: Record<LeadKind, string> = {
  'free-resource': 'Recurso gratuito',
  waitlist: 'Lista de espera',
  newsletter: 'Boletín',
}

export const requestStatusLabels: Record<ServiceRequestStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  paid: 'Pagada',
}

export const requestStatusTones: Record<ServiceRequestStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'info',
  rejected: 'danger',
  paid: 'success',
}

export const adminCopy = {
  brand: 'Panel de Kath',
  backToSite: 'Ver la web',
  logout: 'Cerrar sesión',
  more: 'Más',
  retry: 'Reintentar',
  loading: 'Cargando…',
  genericError: 'Algo salió mal. Inténtalo de nuevo.',

  dashboard: {
    title: 'Resumen',
    subtitle: 'Así va tu plataforma hoy.',
    cards: {
      salesCents: 'Ventas',
      ordersPaid: 'Órdenes pagadas',
      students: 'Alumnos',
      leads: 'Contactos',
      pendingRequests: 'Solicitudes pendientes',
      activeAccesses: 'Accesos activos',
    },
  },

  products: {
    title: 'Productos',
    subtitle: 'Cursos, descargables, asesoría y recursos gratuitos.',
    create: 'Nuevo producto',
    empty: 'Todavía no hay productos. Crea el primero.',
    deleteTitle: '¿Borrar este producto?',
    deleteMessage:
      'Se borra el producto con su contenido. Los alumnos dejarán de verlo. No se puede deshacer.',
    lifetime: 'De por vida',
    limited: 'Por un tiempo limitado',
  },

  content: {
    emptyModules:
      'Este producto aún no tiene módulos. Crea el primero para empezar a subir lecciones.',
    emptyLessons: 'Este módulo no tiene lecciones todavía.',
    deleteModuleTitle: '¿Borrar este módulo?',
    deleteModuleMessage: 'Se borran también todas sus lecciones. No se puede deshacer.',
    deleteLessonTitle: '¿Borrar esta lección?',
    deleteLessonMessage:
      'Se borra la lección y su video deja de estar disponible. No se puede deshacer.',
    videoProcessing: 'Procesando en Bunny…',
    videoProcessingHint: 'Puedes salir de esta pantalla: el video se sigue procesando solo.',
    videoReady: 'Video listo',
    videoNone: 'Sin video',
    videoKeepOpen:
      'No cierres esta pantalla mientras sube. Si se corta el internet, vuelve a elegir el mismo archivo y continúa donde quedó.',
  },

  live: {
    title: 'Clases en vivo',
    subtitle: 'Agenda las clases por Meet y avisa a tus alumnos.',
    pickProduct: 'Elige un curso para ver y agendar sus clases en vivo.',
    empty: 'Este curso no tiene clases en vivo agendadas.',
    notifyTitle: '¿Avisar a los alumnos?',
    notifyMessage:
      'Se envía un correo con la fecha y el enlace de Meet a todas las personas con acceso vigente a este curso.',
    deleteTitle: '¿Borrar esta clase?',
    deleteMessage: 'La clase desaparece del calendario de los alumnos.',
  },

  access: {
    title: 'Alumnos y accesos',
    subtitle: 'Quién puede ver qué, y hasta cuándo.',
    grant: 'Dar acceso manual',
    empty: 'No hay accesos con esos filtros.',
    revokeTitle: '¿Revocar este acceso?',
    revokeMessage:
      'La persona deja de ver este producto de inmediato. Puedes volver a darle acceso cuando quieras.',
    expiryLegend: '¿Hasta cuándo tiene acceso?',
    expiryDate: 'Se revoca el…',
    expiryDateHint: 'El acceso se corta solo al final de ese día.',
    expiryNever: 'No se revoca',
    expiryNeverHint: 'El acceso no tiene fecha de vencimiento.',
    expiryRequired: 'Elige una de las dos opciones para continuar.',
    neverLabel: 'No se revoca',
  },

  students: {
    title: 'Lista de alumnos',
    subtitle: 'Todas las personas con cuenta en la plataforma.',
    empty: 'No se encontraron alumnos.',
  },

  orders: {
    title: 'Órdenes',
    subtitle: 'Todos los intentos de compra y su estado.',
    empty: 'No hay órdenes con ese filtro.',
  },

  leads: {
    title: 'Contactos',
    subtitle: 'Personas que dejaron su correo en la web.',
    empty: 'No hay contactos con esos filtros.',
    export: 'Exportar CSV',
  },

  requests: {
    title: 'Solicitudes de asesoría',
    subtitle: 'Revisa las respuestas y decide a quién atender.',
    empty: 'No hay solicitudes con ese filtro.',
    approveTitle: 'Aprobar solicitud',
    approveMessage: 'Le llegará un correo con el enlace de pago de la asesoría.',
    rejectTitle: 'Rechazar solicitud',
    rejectMessage: 'Le llegará un correo avisando que por ahora no podrás atenderla.',
  },

  coupons: {
    title: 'Cupones',
    subtitle: 'Códigos de descuento para tus productos.',
    create: 'Nuevo cupón',
    empty: 'Todavía no hay cupones.',
    deleteTitle: '¿Borrar este cupón?',
    deleteMessage: 'El código dejará de funcionar. No se puede deshacer.',
  },
} as const
