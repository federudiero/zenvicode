# ROADMAP (ZenviCode)

## Phase 1 (Current)
- Consolidate i18n routing under `[locale]/(site)`.
- Add locale middleware (`localePrefix: always`).
- Implement API stubs: `POST /api/lead`, `POST /api/book-demo` with `zod`.
- Update README and developer docs.

## Phase 2
- Supabase integration: schema, RLS policies, role model (`admin`, `sales`, `ops`).
- Replace API stubs with n8n workflow triggers.
- Server actions: input validation with `zod`, sanitize payloads.
- Basic CRM views (pipeline, lead list, demo schedule).

## Phase 3
- SEO hardening (California targeting), sitemap, metadata.
- a11y audit: semantic HTML, focus management, contrast.
- Performance: image optimization, code splitting.
- E2E tests with Playwright; unit tests for forms and APIs.