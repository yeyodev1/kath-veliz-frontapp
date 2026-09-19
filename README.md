# Kath Veliz — frontapp

Vue 3 + Vite + TypeScript + SCSS + Pinia + vue-router. Se despliega en Vercel como SPA.

## Setup local

```bash
pnpm install
cp .env.example .env        # VITE_API_BASE_URL apunta al backapp local
pnpm dev                    # http://localhost:5173
```

Necesita el backapp corriendo en `:8100`.

## Scripts

| Script | Qué hace |
|---|---|
| `pnpm dev` | servidor de desarrollo |
| `pnpm build` | `vue-tsc -b && vite build` (el type-check corre acá) |
| `pnpm preview` | sirve `dist/` |
| `pnpm typecheck` | solo vue-tsc |
| `pnpm format` | prettier |

## Estructura

```
src/
  components/ui/   piezas sin dominio (ToastList, BaseModal…)
  components/<x>/  piezas por feature
  composables/     lógica compartida (useX.ts)
  config/          copy y configuración estática (site.ts)
  layout/          TheHeader, TheFooter y shells de página
  router/          rutas lazy + títulos + guards
  services/        httpBase.ts (APIBase) + <x>.service.ts
  stores/          Pinia (user, toast)
  styles/          index.scss (tokens inyectados) · global.scss (CSS real)
  types/           interfaces del dominio
  views/           XView.vue — solo componen
```

## Estilos

`vite.config.ts` inyecta `src/styles/index.scss` al inicio de **cada** `<style lang="scss">`.
Por eso ahí solo hay variables, funciones y mixins. Todo lo que emite CSS (reset, `:root`,
`body`, `.btn`, transiciones) vive en `global.scss`, importado una vez desde `main.ts`.

En los componentes se usan `$variables` y `@include mixin` directamente, sin `@use`.

## Deploy a Vercel

`vercel.json` reescribe todo a `index.html` y cachea `/assets` como inmutable.

```bash
vercel --prod
```

## Despliegue

- Producción: https://kath-veliz-frontapp.vercel.app
- Vercel está enlazado a este repo: **cada push a `main` despliega solo**. No hace falta `vercel deploy`.
- Única variable: `VITE_API_BASE_URL` (URL del backapp). Se hornea en el build, así que cambiarla exige redeploy.
- `vercel.json` reescribe todas las rutas a `index.html` (SPA) y envía `Referrer-Policy: origin-when-cross-origin`,
  que exige la Cajita de Pagos de Payphone.
