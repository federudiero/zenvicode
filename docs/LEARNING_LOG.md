# LEARNING LOG

## i18n setup notes
- Use `middleware.ts` to enforce locale prefixes and exclude `_next`, `api`, static files.
- Load messages within `src/app/[locale]/layout.tsx`; avoid nested `<html>`/`<body>`.
- Root layout should not depend on `getLocale` unless `next-intl` plugin is configured.

## APIs and validation
- `zod` schemas for `lead` and `book-demo` match `FormCard` payloads.
- Stubs return `{ok, type, data}` until Supabase+n8n integration.

## Gotchas
- Keep messages in `src/app/messages/{locale}.json` with mirrored keys.
- Do not hardcode strings; use translations in navigation and components.