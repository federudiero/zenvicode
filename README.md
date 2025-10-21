# ZenviCode — Landing + CRM básico (EN/ES)

Sitio bilingüe (EN por defecto, ES espejado) con Next.js App Router y `next-intl`. Target: negocios en California (US), con foco en SEO, seguridad (RLS) y automatizaciones (n8n, fase 2).

## Arquitectura

- Framework: `next@15` con App Router.
- i18n: `next-intl` con prefijo de locale y middleware.
- Rutas del sitio bajo `src/app/[locale]/(site)`.
- APIs: `src/app/api/lead` y `src/app/api/book-demo` con validación `zod`.
- Seguridad: Supabase + RLS (pendiente de integración, fase 2).
- Automatizaciones: n8n (stub en fase 1; integración real en fase 2).

## Enrutamiento i18n

- Middleware: `middleware.ts` fuerza prefijo de locale y excluye rutas estáticas/API.
- Layout localizado: `src/app/[locale]/layout.tsx` carga mensajes de `next-intl`.
- Segmento del sitio: `src/app/[locale]/(site)` con páginas:
  - `/[locale]` (home)
  - `/[locale]/use-cases`
  - `/[locale]/how-we-work`
  - `/[locale]/pricing`
  - `/[locale]/contact`
- Nota: las páginas legales aún residen bajo `src/app/(site)/legal/*` y deben migrarse a `src/app/[locale]/(site)/legal/*` en la próxima iteración.

## APIs

- `POST /api/lead`
  - Payload: `{ name: string, email: string, message: string }`
  - Respuesta: `{ ok: true, type: "lead", data }` (stub)
- `POST /api/book-demo`
  - Payload: `{ company: string, name: string, email: string, message: string }`
  - Respuesta: `{ ok: true, type: "demo", data }` (stub)
- Validación con `zod`. En fase 2 se integrará Supabase y n8n.

## SEO y accesibilidad

- EN por defecto, ES espejado; etiquetas semánticas y `focus-visible`.
- Evitar scripts bloqueantes; optimizar imágenes y cargar diferido cuando sea seguro.

## Desarrollo

- Instalar dependencias: `npm install`
- Desarrollo: `npm run dev` (Turbopack)
- Lint: `npm run lint`
- Build: `npm run build`

## Estructura principal

```
src/
  app/
    [locale]/(site)/
      page.tsx
      use-cases/page.tsx
      pricing/page.tsx
      contact/page.tsx
      how-we-work/page.tsx
    messages/
      en.json
      es.json
  components/
  content/
```

## Migración aplicada (Fase 1)

- Se movieron páginas de `src/app/(site)/*` a `src/app/[locale]/(site)/*`.
- Se añadieron rutas API (`lead`, `book-demo`) con validación `zod`.
- Se configuró `middleware.ts` para prefijo de locale.
- Se documentó y estabilizó la carga de mensajes en el layout localizado.

## Verificación manual sugerida

- Navegación: Validar `/en` y `/es` con enlaces de la barra de navegación.
- Formularios: Enviar `lead` y `demo`; verificar respuestas JSON de los stubs.
- i18n: Cambiar entre EN/ES y comprobar textos de `messages/*.json`.

## Próximos pasos

- Migrar páginas legales a `[locale]/(site)/legal/*`.
- Integrar Supabase y RLS (modelo de roles: admin, sales, ops).
- Integrar n8n para automatizaciones (sustituir stubs).
- Añadir pruebas unitarias/e2e y checklist de accesibilidad.

Más detalles en `docs/ROADMAP.md`, `docs/LEARNING_LOG.md` y `docs/estado_proyecto.md`.
