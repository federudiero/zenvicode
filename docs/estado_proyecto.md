# Estado del proyecto

## Resumen
- Sitio bilingüe funcional con rutas bajo `[locale]/(site)`.
- Middleware de localización activo; EN por defecto, ES espejado.
- APIs `lead` y `book-demo` implementadas con validación y respuestas stub.

## Pendientes
- Migrar páginas legales a `[locale]/(site)/legal/*`.
- Integrar Supabase con RLS y modelo de roles.
- Integrar n8n para automatizaciones reales.
- Añadir pruebas y checklist de a11y.

## Compatibilidad y calidad
- TypeScript estricto y lint limpio.
- i18n sin strings hardcodeados; `messages/en.json` y `messages/es.json` alineados.
- Performance y SEO: seguir convenciones de California (US).