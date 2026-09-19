import type { RouteRecordRaw } from 'vue-router'

// Fragmento de rutas del área pública. index.ts lo compone con los demás.
// Home, Login y Account viven en index.ts.
export const publicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/cursos',
    name: 'Courses',
    component: () => import('@/views/CatalogView.vue'),
    // La misma vista sirve los dos catálogos; `catalog` decide qué tipos pide.
    meta: { title: 'Cursos', catalog: 'cursos' },
  },
  {
    path: '/recursos',
    name: 'Resources',
    component: () => import('@/views/CatalogView.vue'),
    meta: { title: 'Recursos gratuitos', catalog: 'recursos' },
  },
  {
    path: '/p/:slug',
    name: 'Product',
    component: () => import('@/views/ProductView.vue'),
    // El título real se pone cuando carga el producto.
    meta: { title: 'Programa' },
  },
  {
    path: '/registro',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Crear cuenta', guestOnly: true },
  },
  {
    path: '/recuperar',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: { title: 'Recuperar contraseña', guestOnly: true },
  },
  {
    // Sin guestOnly: el enlace del correo debe funcionar aunque haya otra sesión abierta.
    path: '/restablecer',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPasswordView.vue'),
    meta: { title: 'Define tu contraseña' },
  },
]
