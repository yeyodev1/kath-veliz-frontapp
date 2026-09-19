/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 *
 * De dónde sale cada texto: hero, sobre mí y servicios son literales de
 * kathveliz.com; lo de cursos y asesoría, de sus landings de Mailchimp.
 * Nada de testimonios ni cifras inventadas: lo que no existe queda vacío y
 * la sección no se pinta.
 */

export interface Testimonial {
  name: string
  role: string
  quote: string
  photo?: string
}

export interface FallbackOffering {
  slug: string
  type: 'course' | 'download' | 'service' | 'free'
  kicker: string
  title: string
  text: string
  cta: string
}

// Arreglo tipado aparte: con `as const` un [] vacío se vuelve `never[]`.
const testimonials: Testimonial[] = []

const fallbackOfferings: FallbackOffering[] = [
  {
    slug: 'asesoria-personalizada',
    type: 'service',
    kicker: 'Asesoría 1:1',
    title: 'Asesorías',
    text: 'Trabajamos juntas para entender tus hábitos, diseñar tu primer presupuesto y crear un plan realista que te permita ahorrar, disfrutar y dejar de vivir con miedo a endeudarte.',
    cta: 'Quiero mi asesoría',
  },
  {
    slug: 'tu-punto-de-partida',
    type: 'course',
    kicker: 'Curso',
    title: 'Tu Punto de Partida',
    text: 'Clases prácticas, ejercicios guiados, sesiones en vivo y plantillas automatizadas.',
    cta: 'Conoce el curso',
  },
  {
    slug: 'domina-tus-tarjetas-de-credito',
    type: 'course',
    kicker: 'Curso',
    title: 'Domina tus tarjetas de crédito',
    text: 'Por fin aprenderás lo que necesitas saber sobre tarjetas de crédito, qué pasa si no pagas a tiempo y cómo sacarles provecho.',
    cta: 'Conoce el curso',
  },
  {
    slug: 'plantilla-presupuesto-inteligente',
    type: 'download',
    kicker: 'Plantilla',
    title: 'Plantilla Presupuesto Inteligente',
    text: 'Una plantilla automatizada de Excel para que puedas hacer el seguimiento de tu presupuesto durante un año completo.',
    cta: 'Ver la plantilla',
  },
]

export const site = {
  name: 'Kath Veliz',
  tagline: 'Tu libertad empieza cuando tomas el control de tus finanzas',
  claim: 'Asesoría & Cursos',
  description:
    'Finanzas personales para tus 20s y 30s: cursos, plantillas y asesoría 1:1 para que tomes el control de tu dinero sin miedo.',
  url: 'https://kathveliz.com',
  // Pendiente: Kath aún no confirma un correo público. Vacío = no se muestra.
  email: '',
  // Solo dígitos con código de país (sale del botón de dudas de su landing).
  whatsapp: '593990682369',
  social: {
    instagram: 'https://www.instagram.com/kathvelizc/',
    tiktok: 'https://www.tiktok.com/@kathvelizc',
    facebook: '',
    community: 'https://chat.whatsapp.com/EGISL9WifNL78M6Cg83KpF',
  },
  handle: '@kathvelizc',
  logo: {
    full: '/img/logo-kath-veliz.png',
    mark: '/img/kv-mark.png',
    alt: 'Kath Veliz, tu coach de finanzas',
  },
  // Fotos de la sesión profesional. Si alguna no carga, BrandPhoto pinta un
  // bloque de color de marca con el monograma en vez de una imagen rota.
  images: {
    hero: '/img/kath-hero.jpg',
    heroMobile: '/img/kath-hero-movil.jpg',
    about: '/img/kath-sobre-mi.jpg',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Cursos', to: '/cursos' },
    { label: 'Recursos', to: '/recursos' },
    { label: 'Asesoría', to: '/p/asesoria-personalizada' },
  ],
  navUser: {
    courses: { label: 'Mis cursos', to: '/mis-cursos' },
    admin: { label: 'Panel', to: '/admin' },
    account: { label: 'Mi cuenta', to: '/cuenta' },
    login: 'Ingresar',
    logout: 'Cerrar sesión',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    skip: 'Saltar al contenido',
  },

  home: {
    hero: {
      eyebrow: 'Kath Veliz — Asesoría & Cursos',
      title: {
        before: 'Tu ',
        em: 'libertad',
        after: ' empieza cuando tomas el control de tus finanzas',
      },
      text: 'Aquí no hay juicios ni fórmulas complicadas, solo herramientas prácticas y acompañamiento real para que entiendas a dónde se va tu dinero.',
      primary: { label: 'Ver los cursos', to: '/cursos' },
      secondary: { label: 'Quiero una asesoría', to: '/p/asesoria-personalizada' },
      photoAlt: 'Kath Veliz sonriendo',
      stamp: 'Tu coach de finanzas',
      // Los temas de los módulos de "Tu Punto de Partida": corren en la cinta bajo el hero.
      topics: [
        'Mentalidad financiera',
        'Ingresos',
        'Ahorro',
        'Gastos',
        'Deudas',
        'Tarjetas de crédito',
        'Presupuesto',
      ],
    },
    about: {
      eyebrow: 'Sobre mí',
      title: { before: 'En nuestros 20s ', em: 'nadie', after: ' nos habla de finanzas' },
      lead: 'Nadie nos enseña a presupuestar, a ahorrar o a usar una tarjeta de crédito sin miedo.',
      paragraphs: [
        'Aprendimos a prueba y error, muchas veces endeudándonos y sintiendo que el dinero nos controlaba a nosotros.',
        'Este espacio nace para cambiar esa historia. Porque tomar el control de tus finanzas no debería ser un secreto que descubres demasiado tarde, sino el primer paso hacia tu tranquilidad y libertad.',
      ],
      bioTitle: '¡Conozcámonos!',
      bio: 'Soy Kath, tengo 28 años y soy licenciada en gestión empresarial internacional. Tengo +10 años de experiencia en empresas multinacionales y CFO de BurgerLab EC.',
      photoAlt: 'Kath Veliz trabajando en su computadora',
      facts: [
        { value: '+10 años', label: 'en empresas multinacionales' },
        { value: 'CFO', label: 'de BurgerLab EC' },
        { value: 'Lic.', label: 'en gestión empresarial internacional' },
      ],
    },
    offerings: {
      eyebrow: 'Servicios',
      title: { before: 'Elige por dónde ', em: 'empezar', after: '' },
      text: 'Mis cursos están pensados para que aprendas desde cero a organizar tu dinero, ahorrar sin estrés, controlar tus gastos y usar tus tarjetas de crédito con seguridad.',
      all: { label: 'Ver todo el catálogo', to: '/cursos' },
      fallback: fallbackOfferings,
    },
    freebies: {
      eyebrow: 'Recursos gratis',
      title: { before: 'Empieza hoy, ', em: 'sin pagar', after: ' nada' },
      text: 'Guías para dar el primer paso. Déjame tu nombre y tu correo y te llega el enlace al instante.',
      all: { label: 'Ver todos los recursos', to: '/recursos' },
    },
    testimonials: {
      eyebrow: 'Testimonios',
      title: { before: 'Lo que dicen ', em: 'ellas', after: '' },
      items: testimonials,
    },
    community: {
      eyebrow: 'Contacto',
      title: { before: '¡Únete a mi canal de ', em: 'WhatsApp', after: '!' },
      text: 'Para que estés al tanto de los cursos nuevos que estaré dictando, talleres y tips exclusivos sobre manejo de finanzas.',
      cta: 'Únete aquí',
      follow: '¡Sígueme en mis redes sociales!',
      doubts: 'Si tienes dudas, escríbeme por aquí',
    },
  },

  catalog: {
    cursos: {
      eyebrow: 'Cursos y plantillas',
      title: { before: 'Aprende a organizar tu dinero ', em: 'desde cero', after: '' },
      text: 'Sin importar tu nivel de conocimiento: de manera sencilla, práctica y con términos fáciles de entender.',
      empty:
        'Pronto vas a encontrar aquí los cursos. Mientras tanto, únete al canal para enterarte primero.',
    },
    recursos: {
      eyebrow: 'Recursos gratuitos',
      title: { before: 'Guías para dar el ', em: 'primer paso', after: '' },
      text: 'Déjame tu nombre y tu correo y te llega el enlace al instante.',
      empty:
        'Estoy preparando los primeros recursos gratuitos. Únete al canal y te aviso cuando salgan.',
    },
    error: 'No pudimos cargar el catálogo. Revisa tu conexión e inténtalo de nuevo.',
    retry: 'Reintentar',
  },

  product: {
    typeLabels: {
      course: 'Curso',
      download: 'Plantilla',
      service: 'Asesoría 1:1',
      free: 'Recurso gratuito',
    },
    cardCta: {
      course: 'Ver el curso',
      download: 'Ver la plantilla',
      service: 'Conoce más',
      free: 'Lo quiero gratis',
    },
    badges: { waitlist: 'Lista de espera', closed: 'Inscripciones cerradas', free: 'Gratis' },
    sections: {
      highlights: 'Qué vas a recibir',
      audience: 'Es para ti si…',
      syllabus: 'Qué incluye el curso',
      live: 'Próximas clases en vivo',
      faqs: 'Preguntas frecuentes',
    },
    meta: {
      lessons: 'clases',
      lesson: 'clase',
      lifetime: 'Acceso de por vida',
      accessDays: 'de acceso',
      preview: 'Vista previa gratis',
      previewTitle: 'Vista previa',
      previewError: 'No pudimos cargar la vista previa.',
      close: 'Cerrar',
    },
    buy: {
      cta: 'Comprar',
      note: 'Pago seguro con tarjeta a través de Payphone.',
      owned: 'Ir a mis cursos',
    },
    closed: {
      title: 'Inscripciones cerradas',
      text: 'Por ahora este programa no está recibiendo inscripciones. Únete al canal de WhatsApp para enterarte cuando vuelva a abrir.',
    },
    waitlist: {
      title: 'Entra a la lista de espera',
      text: 'Déjame tus datos y serás de las primeras en enterarte cuando abra la próxima edición. Además te llega por correo un cupón de 10% de descuento.',
      cta: 'Quiero mi 10% de descuento',
      success: '¡Listo! Revisa tu correo: ahí está tu cupón de 10% de descuento.',
    },
    free: {
      title: 'Recíbelo gratis en tu correo',
      text: 'Déjame tu nombre y tu correo y te envío el enlace ahora mismo.',
      cta: 'Enviármelo gratis',
      success: '¡Enviado! Revisa tu correo (y la carpeta de spam, por si acaso).',
    },
    service: {
      title: 'Cuéntame de ti',
      text: 'No atiendo a todo el mundo: quiero estar segura de que puedo ayudarte. Llena esta encuesta y te respondo por correo.',
      cta: 'Enviar mi solicitud',
      anchor: 'Llenar la encuesta',
      success: '¡Recibido! Te acabo de enviar un correo con toda la información de la asesoría.',
      stepsTitle: 'Cómo funciona',
      steps: [
        {
          title: 'Llenas la encuesta',
          text: 'Me cuentas en qué punto estás con tu dinero. Apenas la envías te llega por correo un PDF con todo el detalle de la asesoría.',
        },
        {
          title: 'Reviso tu caso',
          text: 'Leo tus respuestas una por una. Si veo que puedo ayudarte, te llega un correo con tu enlace de pago.',
        },
        {
          title: 'Empezamos',
          text: 'Apenas pagas, coordinamos por correo las fechas de nuestras sesiones. Todo es 100% remoto.',
        },
      ],
    },
    notFound: {
      title: 'No encontramos este programa',
      text: 'Puede que el enlace esté mal escrito o que ya no esté disponible.',
      cta: 'Ver el catálogo',
    },
  },

  forms: {
    name: 'Nombre',
    namePlaceholder: 'Cómo te llamas',
    email: 'Correo',
    emailPlaceholder: 'tucorreo@ejemplo.com',
    phone: 'Teléfono',
    phoneOptional: 'Teléfono (opcional)',
    phonePlaceholder: '0991234567',
    documentId: 'Cédula',
    password: 'Contraseña',
    passwordHint: 'Mínimo 8 caracteres.',
    passwordConfirm: 'Repite la contraseña',
    selectPlaceholder: 'Elige una opción',
    required: 'Este campo es obligatorio.',
    invalidEmail: 'Escribe un correo válido.',
    shortPassword: 'La contraseña debe tener al menos 8 caracteres.',
    passwordMismatch: 'Las contraseñas no coinciden.',
    privacy: 'Tus datos solo se usan para escribirte. Nada de spam.',
    sending: 'Enviando…',
  },

  auth: {
    login: {
      eyebrow: 'Acceso',
      title: 'Qué bueno verte de nuevo',
      text: 'Ingresa para seguir con tus clases.',
      cta: 'Ingresar',
      loading: 'Ingresando…',
      forgot: '¿Olvidaste tu contraseña?',
      noAccount: '¿Aún no tienes cuenta?',
      register: 'Crea una',
      forCheckout: 'Ingresa o crea tu cuenta para terminar tu compra.',
    },
    register: {
      eyebrow: 'Cuenta nueva',
      title: 'Crea tu cuenta',
      text: 'Con ella entras a tus cursos y descargas cuando quieras.',
      cta: 'Crear mi cuenta',
      loading: 'Creando…',
      hasAccount: '¿Ya tienes cuenta?',
      login: 'Ingresa',
    },
    forgot: {
      eyebrow: 'Recuperar acceso',
      title: '¿Olvidaste tu contraseña?',
      text: 'Escribe tu correo y te envío un enlace para crear una nueva.',
      cta: 'Enviarme el enlace',
      sentTitle: 'Revisa tu correo',
      sent: 'Si ese correo tiene una cuenta, en unos minutos te llega el enlace para crear una contraseña nueva.',
      back: 'Volver a ingresar',
    },
    reset: {
      eyebrow: 'Tu contraseña',
      title: 'Define tu contraseña',
      text: 'Elige una contraseña para entrar a tu cuenta.',
      cta: 'Guardar y entrar',
      missingToken: 'Este enlace no es válido o ya venció. Pide uno nuevo.',
      requestNew: 'Pedir un enlace nuevo',
      success: 'Contraseña guardada. ¡Bienvenida!',
    },
    aside: {
      quote:
        'Tomar el control de tus finanzas no debería ser un secreto que descubres demasiado tarde.',
      author: 'Kath Veliz',
    },
    welcome: 'Hola',
  },

  account: {
    eyebrow: 'Mi cuenta',
    profileTitle: 'Tus datos',
    profileText: 'La cédula y el teléfono los pide Payphone al momento de pagar.',
    save: 'Guardar cambios',
    saved: 'Datos actualizados',
    documentIdInvalid: 'La cédula tiene 10 dígitos (o 13 si es RUC).',
    documentIdHint: 'Solo números, sin guiones.',
    passwordTitle: 'Cambiar contraseña',
    currentPassword: 'Contraseña actual',
    newPassword: 'Contraseña nueva',
    changePassword: 'Cambiar contraseña',
    passwordChanged: 'Contraseña actualizada',
    myCourses: 'Ir a mis cursos',
    logout: 'Cerrar sesión',
    loggedOut: 'Sesión cerrada',
  },

  footer: {
    text: 'Finanzas personales sin juicios ni fórmulas complicadas.',
    explore: 'Explora',
    follow: 'Sígueme',
    newsletter: {
      title: 'Tips de finanzas en tu correo',
      text: 'Cursos nuevos, talleres y consejos. Sin spam.',
      cta: 'Suscribirme',
      success: '¡Listo! Ya estás en la lista.',
      emailLabel: 'Tu correo',
    },
    community: 'Canal de WhatsApp',
    rights: 'Todos los derechos reservados.',
    disclaimer: 'Está prohibida la reproducción del material de los cursos.',
  },

  notFound: {
    code: 'Error 404',
    title: { before: 'Esta página ', em: 'no existe', after: '' },
    text: 'Puede que el enlace esté mal escrito o que la página se haya movido.',
    cta: 'Volver al inicio',
    secondary: 'Ver los cursos',
  },
} as const

export type EmphasisTitle = { before: string; em: string; after: string }

export function whatsappLink(message = 'Hola Kath, quiero más información'): string {
  if (!site.whatsapp) return '#'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
