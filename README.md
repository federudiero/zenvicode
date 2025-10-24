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

## CRM (Firebase) — Setup rápido

El sitio incluye un CRM mínimo accesible en `/[locale]/admin/crm` (por ejemplo: `/es/admin/crm`). El acceso está oculto y se revela sólo para administradores.

- Enlace oculto: triple clic en el enlace con id `#site-logo` (Home) o escribe "crm" en cualquier parte. Si no has iniciado sesión y no eres admin, se abrirá el login con Google.
- Autenticación: Firebase Auth (proveedor Google). Habilítalo en tu proyecto de Firebase: Auth -> Sign-in method -> Google -> Enable.
- Datos: Firestore. Los leads se escriben en la colección `leads`. La app cliente sólo puede leer/actualizar leads si eres admin. Las creaciones de leads se realizan desde el endpoint Next.js con Admin SDK.

### Variables de entorno

Crea `.env.local` en la raíz del proyecto con credenciales de cliente y del Admin SDK:

```
# Firebase Web (cliente)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-side para /api/lead)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
# Asegúrate de mantener los \n del bloque de la llave privada
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Opcional: Emails para /api/book-demo
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

### Reglas de seguridad de Firestore

El repositorio incluye `firestore.rules` con reglas recomendadas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isAdmin() {
      return isSignedIn() &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
    match /admins/{uid} {
      allow read: if isSignedIn() && request.auth.uid == uid;
      allow write: if false;
    }
    match /leads/{id} {
      allow read: if isAdmin();
      allow create: if false; // creación sólo desde servidor (Admin SDK)
      allow update, delete: if isAdmin();
    }
  }
}
```

Cárgalas en Firebase Console (Firestore -> Rules) o con Firebase CLI.

### Crear un usuario administrador

1) Autentícate en la app con Google (en la UI verás tu email cuando no tengas permisos).
2) Toma tu UID desde Firebase Auth (Users) o desde la app si lo registras en logs.
3) En Firestore crea el documento: `admins/{UID}` con el campo `{ isAdmin: true }`.

Una vez admin, verás el botón "Open CRM" cuando dispares el enlace oculto y podrás acceder a `/[locale]/admin/crm`.

### API / Formularios

- `POST /api/lead` valida `{ name, email, message, source? }` y guarda un documento en `leads` con `status: "nuevo"`, `createdAt`, `updatedAt` y metacampos. Respuesta: `{ ok: true, id }`.
  - El formulario en `/[locale]/(site)/contact` usa `FormCard` y envía a este endpoint.
  - Soporte de honeypot opcional (`hp`), ignorado si está vacío.
- `POST /api/book-demo` valida `{ company, name, email, message }` y (opcionalmente) envía email vía Resend si `RESEND_API_KEY` está configurado.

### Desarrollo

- Instalar dependencias: `pnpm install`
- Desarrollo: `pnpm dev`
- Lint: `pnpm run lint`
- Build: `pnpm run build`
