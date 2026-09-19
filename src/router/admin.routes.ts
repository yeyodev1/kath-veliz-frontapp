import type { RouteRecordRaw } from 'vue-router'

// Fragmento de rutas del área "admin". index.ts lo compone con los demás.
// El guard global lee `requiresAuth` y `requiresAdmin`: van en cada ruta para
// que ninguna pantalla nueva quede abierta por olvido.
const guard = { requiresAuth: true, requiresAdmin: true }

export const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    component: () => import('@/layout/AdminLayout.vue'),
    meta: { ...guard },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: { ...guard, title: 'Panel — Resumen' },
      },
      {
        path: 'productos',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminProductsView.vue'),
        meta: { ...guard, title: 'Panel — Productos' },
      },
      {
        // Va antes de `:id` para que "nuevo" no se lea como un id.
        path: 'productos/nuevo',
        name: 'AdminProductNew',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { ...guard, title: 'Panel — Nuevo producto' },
      },
      {
        path: 'productos/:id',
        name: 'AdminProductEdit',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { ...guard, title: 'Panel — Editar producto' },
      },
      {
        path: 'en-vivo',
        name: 'AdminLive',
        component: () => import('@/views/admin/AdminLiveView.vue'),
        meta: { ...guard, title: 'Panel — Clases en vivo' },
      },
      {
        path: 'accesos',
        name: 'AdminAccess',
        component: () => import('@/views/admin/AdminAccessView.vue'),
        meta: { ...guard, title: 'Panel — Alumnos y accesos' },
      },
      {
        path: 'alumnos',
        name: 'AdminStudents',
        component: () => import('@/views/admin/AdminStudentsView.vue'),
        meta: { ...guard, title: 'Panel — Alumnos' },
      },
      {
        path: 'ordenes',
        name: 'AdminOrders',
        component: () => import('@/views/admin/AdminOrdersView.vue'),
        meta: { ...guard, title: 'Panel — Órdenes' },
      },
      {
        path: 'leads',
        name: 'AdminLeads',
        component: () => import('@/views/admin/AdminLeadsView.vue'),
        meta: { ...guard, title: 'Panel — Contactos' },
      },
      {
        path: 'solicitudes',
        name: 'AdminRequests',
        component: () => import('@/views/admin/AdminRequestsView.vue'),
        meta: { ...guard, title: 'Panel — Solicitudes de asesoría' },
      },
      {
        path: 'cupones',
        name: 'AdminCoupons',
        component: () => import('@/views/admin/AdminCouponsView.vue'),
        meta: { ...guard, title: 'Panel — Cupones' },
      },
    ],
  },
]
