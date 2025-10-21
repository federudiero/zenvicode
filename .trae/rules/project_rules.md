0) Purpose & KPIs

Goal: Capture and convert leads for n8n automation services (Discovery → PoC → Implementation → Support).

KPIs: form conversion, demos booked, first-response SLA, CAC by channel.

1) Scope

Phase 1 (MVP): Home, Use Cases, How We Work, Pricing/Plans (Zenvicode services), Contact/Book Demo.

Phase 2: Case studies, SEO blog, comparisons, ROI calculator.

1.1 Frontend (locked stack)

Framework: Next.js (App Router) + TypeScript

Styling: TailwindCSS

UI kit: shadcn/ui (Radix)

State/Data: TanStack Query (reads from copy_blocks / site_settings)

Forms/Validation: react-hook-form + Zod

Icons: lucide-react

Theming: next-themes (dark/light)

i18n: next-intl (es/en; default es)

2) Content & Data (restructured)

Goal: decouple copy/media from code and enable easy editing.

Content layers

Taxonomies: use_cases, benefits, faqs, plans, steps

Blocks: hero, value_props, trust, pricing_table, cta_bars

Site settings: site_settings (branding, nav, CTA, contact)

Location (MVP): JSON files in repo (e.g., /content/{block}.json).
Phase 2 may migrate to Supabase (RLS) keeping the same keys.

Assets: images in /public/* with semantic names; replaceable without code changes.

Forms: POST to internal API → forward to n8n webhook (lead & demo).

Traceability: store (server-side) consent, source, and a leadId (if applicable).

3) Integrations (n8n)
3.1 MVP flows

Lead Inbound: Form → n8n Webhook → (optional) enrichment → push to CRM/Sheet → notification (email/Slack/WhatsApp)

Book Demo: Form → n8n Webhook → Calendar (Google/Calendly) → confirmation + reminder

Excluded from MVP (per request): nurture drip and internal status/health.

3.2 Key site messages (solution-oriented)

“500+ integrations / templates”

“AI in workflows”

“Cloud or self-host”

“Fast, measurable PoC”

4) Information Architecture (routes)

/ Home (value proposition + primary CTA)

/use-cases Use cases (cards by vertical/role)

/how-we-work Method (Discovery → PoC → Go-live → Support)

/pricing Zenvicode service plans (clarify n8n Cloud is billed separately)

/contact Form + WhatsApp + Booking

/legal/{privacy,terms}

5) Reusable UI Components

Hero, Trust, UseCaseCard, Steps, PricingCard, FAQAccordion, FormCard (Zod + honeypot), Footer

6) SEO, Performance & Accessibility

SEO: single H1, per-page meta/OG, JSON-LD (FAQ/Service), correct alt

Performance: Next/Image, local fonts, Lighthouse ≥95

A11y: WCAG AA, visible focus, contrast tokens, full dark/light support

7) Analytics & Privacy

Base: Vercel Analytics

Google: GA4 (measurement), Google Tag Manager (tag orchestration), Google Search Console (indexing)

Consent Mode (v2): cookie banner; block tags until consent

Minimal data: store only what’s needed for sales contact (GDPR-friendly)

8) Security

Server-side validation (Zod), CSRF, honeypot + IP rate-limit

Secrets server-only (HttpOnly when applicable)

If Supabase is used in Phase 2, keep RLS/ACL enabled

9) Environments & Variables

Not defined yet. Do not use in code until setup is agreed.

Proposed (TBD):

LEADS_WEBHOOK_URL (server) — n8n endpoint for “Contact”

AGENDA_WEBHOOK_URL (server) — n8n endpoint for “Book Demo”

NEXT_PUBLIC_SITE_URL (public) — canonical

GA4_MEASUREMENT_ID / NEXT_PUBLIC_GTM_ID (public) — if enabled

When confirmed, document name, purpose, visibility, and why DB isn’t sufficient.

10) Git & Branching

Integration branch: develop

Branches: feature/n8n-<slug> / fix/n8n-<slug>

PR → Vercel Preview → manual QA → your approval → merge

Conventional Commits + SemVer

11) Operations & Quality

Only port 3000 locally

ESLint + TypeScript clean before PR

Minimum tests: page render + form validation

Tracking docs:

/docs/ROADMAP.md (what, how, date)

/docs/LEARNING_LOG.md (append-only)

/docs/estado_proyecto.doc (non-technical ops summary: scope, pending items, risks, next deliverables)

12) Phase 1 Deliverables (Definition of “done”)

Site deployed on Vercel (domain connected)

Pages: Home, Use Cases, How We Work, Pricing, Contact/Booking

Operational forms (lead & booking) wired to n8n

Mock data for copy and Google images as placeholders (replace before launch)

2 n8n workflows: lead and booking (logging + notification)

“How to edit copy” guide (README)

Lighthouse ≥95 and SEO checklist (screenshots)

Motion pass complete on Home, Use Cases, How We Work, Pricing per §17

Accessibility proof of prefers-reduced-motion behavior (screenshot/video)

13) Editorial Line

Pain: manual tasks, errors, tool silos

Promise: pragmatic automations that save time and reduce errors

Proof: integrations/templates + Cloud or Self-host as needed

Low risk: fast, measurable PoC

14) Visual Style (reference)

Clean hosting/pricing layout: benefit sections, clear cards, strong CTAs, “what’s included” blocks

Motion-aware: subtle, purposeful animations that aid comprehension (no flashy or parallax-heavy gimmicks)

Tone: business-first (results over jargon)

Inspiration: smooth reveals, flowing lines, marquee-style logos (like n8n integrations flow & Trae home)

15) Invariants

No hardcoded copy → use copy_blocks / site_settings

Don’t break routes/props/DTO; for breaking changes → propose v2 + migration plan

No extra deps outside the stack without justification (package, purpose, alternative)

If an issue arises: apply atomic fixes (small, scoped), then document & notify the impact

16) Roadmap

S1: MVP + n8n flows for leads/booking

S2: Case studies, SEO blog, comparisons

S3: ROI calculator + embedded micro-demos

17) Motion & Interactions (Animations)

Goal: add premium feel (like n8n/Trae) without hurting performance or accessibility.

17.1 Libraries & scope

Primary: Framer Motion for enter/exit/reveal + stagger

Secondary: CSS keyframes for simple, infinite loops (e.g., logo marquee)

No GSAP or heavy canvas unless explicitly approved

17.2 Where to animate (MVP)

Home/Hero: fade-in + slight parallax of heading/CTA; soft gradient/glow background

Integrations/Logos: infinite marquee (pause on hover)

“Flow” diagram: SVG lines “draw” on scroll (stroke-dashoffset) + small node pulse

How we work (steps): scroll-reveal with stagger

Cards (use cases / pricing): subtle hover (scale ≤1.02, shadow bloom)

17.3 Guardrails (A11y & performance)

Honor prefers-reduced-motion → disable non-essential motion

Use GPU-friendly transforms (opacity, translate, scale); avoid layout thrash

Keep first LCP element static; start animations after mount/in-view

Target 60fps; verify in Performance panel; no CLS introduced

Durations: 180–600ms; easings: easeOut or low-bounce spring

17.4 Implementation checklist

Add Framer Motion and one marquee keyframe in globals.css

Encapsulate effects: Hero, LogoMarquee, FlowPreview, StepsReveal

Centralize motion tokens (durations/easings) for consistency

Use once-only in-view triggers for scroll reveals

17.5 Acceptance criteria (MVP)

No layout shifts; CLS stays 0.00

Lighthouse ≥95 (Performance + Best Practices) with animations enabled

prefers-reduced-motion fully supported

Motion never blocks input or reading flow

Visual consistency across light/dark themes