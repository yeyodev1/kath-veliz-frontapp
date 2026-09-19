import type { RouteRecordRaw } from 'vue-router'

// Fragmento de rutas del área "student". index.ts lo compone con los demás.
export const studentRoutes: Array<RouteRecordRaw> = [
  {
    path: '/checkout/:slug',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Completa tu compra', requiresAuth: true },
  },
  {
    // Sin requiresAuth a propósito: Payphone reversa el cobro a los 5 minutos,
    // así que la vista intenta confirmar siempre y solo pide login si el API da 401.
    path: '/pago/respuesta',
    name: 'PaymentResponse',
    component: () => import('@/views/PaymentResponseView.vue'),
    meta: { title: 'Confirmando tu pago' },
  },
  {
    path: '/mis-cursos',
    name: 'MyCourses',
    component: () => import('@/views/MyCoursesView.vue'),
    meta: { title: 'Mis cursos', requiresAuth: true },
  },
  {
    path: '/aprender/:slug/:lessonId?',
    name: 'Learn',
    component: () => import('@/views/LearnView.vue'),
    meta: { title: 'Aprender', requiresAuth: true },
  },
]
