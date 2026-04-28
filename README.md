# next-starter-internal — v0.2.0

Template WEDOOALL pour apps internes — Next.js 15 + CF Access + Supabase self-hosted + shadcn/ui v4 + Aceternity Pro + Motion+ + Quality Gates pré-câblés.

## Quickstart

### 1. Provisioner via FORGE (recommandé)

Depuis le repo `001- FORGE`, suivre `runbooks/provision-internal-app.md` qui orchestre :

- Création du repo GitHub depuis ce template
- Schéma Postgres dédié dans `supabase-internal`
- CF Access app + DNS + Tunnel
- Projets Sentry + PostHog
- Secrets dans Infisical
- App Coolify déployée

→ une commande `pnpm exec tsx engine/scripts/provision-internal-app.ts <slug>`.

### 2. Provisionner manuellement (debug only)

```bash
gh repo create WEDOOALL/mon-app --template WEDOOALL/next-starter-internal --private --clone
cd mon-app
cp .npmrc.example .npmrc       # remplir WEDOOALL_NPM_TOKEN + ACETERNITY_LICENSE
cp .env.example .env.local     # remplir Supabase, Sentry, PostHog
pnpm install
pnpm dev                       # → http://localhost:3000
```

En développement, le middleware CF Access est désactivé. La page affiche `MOCK_OPERATOR_EMAIL` (défaut : `dev@wedooall.com`).

## Stack v0.2

| Couche           | Techno                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| Framework        | Next.js 15 App Router + React 19 + TypeScript strict                   |
| Styling          | Tailwind CSS 4 (CSS-first `@theme`) + Stella tokens                    |
| UI primitives    | Radix + shadcn/ui v4 + lucide-react                                    |
| UI premium       | @aceternity/\* via shadcn registry (license `ACETERNITY_LICENSE`)      |
| Animations       | Motion v12 (+ Motion+ premium si licensé)                              |
| Forms            | react-hook-form + @hookform/resolvers + zod                            |
| Auth             | Cloudflare Access (JWT décodé server-side)                             |
| Database         | Supabase self-hosted (`supabase-internal.wedooall.com`, schéma dédié)  |
| DB clients       | @supabase/supabase-js + @supabase/ssr (App Router)                     |
| Observability    | Sentry + PostHog via `@wedooall/observability`                         |
| Middleware       | `@wedooall/middleware` (security headers + auth + observability)       |
| Email            | Gmail Workspace SMTP (cf. ADR-002 FORGE)                               |
| Tests            | Vitest (unit) + Playwright (e2e + a11y axe-core)                       |
| Quality Gates CI | lint + typecheck + build + Trivy + gitleaks + audit + Lighthouse + axe |

## Structure

```
app/
  api/health/route.ts     ← healthcheck endpoint (contrat FORGE)
  globals.css             ← Stella tokens @theme (dark + indigo)
  layout.tsx              ← fonts Inter + Geist Mono
  page.tsx
components/ui/            ← shadcn components (vide à l'init, add via CLI)
lib/
  utils.ts                ← cn() helper (clsx + tailwind-merge)
  db.ts                   ← pg pool global (legacy direct Postgres)
  supabase/
    client.ts             ← createBrowserClient (Client Components)
    server.ts             ← createServerClient (Server Components/Actions)
  integrations/           ← convention 1 service = 1 dossier (cf. README)
supabase/
  config.toml             ← Supabase CLI config
  migrations/             ← SQL migrations versionnées
  functions/              ← Edge Functions
  seed.sql                ← données dev/CI
e2e/
  home.spec.ts            ← page d'accueil
  a11y.spec.ts            ← audit accessibilité WCAG 2.1 AA (axe-core)
.github/workflows/ci.yml  ← CI étendue (8 jobs)
.husky/pre-commit         ← lint-staged auto
components.json           ← config shadcn + registry @aceternity
lighthouserc.json         ← perf 90 / a11y 95 budgets
forge.manifest.json       ← INVARIANT-03 — ne jamais modifier
```

Voir [`docs/STRUCTURE.md`](docs/STRUCTURE.md) pour la version détaillée.

## Sécurité JWT CF Access

Le JWT CF Access est décodé côté server component **uniquement pour afficher l'email opérateur** (`app/page.tsx`). La validation de signature est faite au niveau **edge Cloudflare Access** — le JWT ne peut pas atteindre l'origin sans être signé par CF Access si le tunnel/WARP est correctement configuré.

⚠️ **Pour défense-en-profondeur en prod :** configure `CF_ACCESS_TEAM_DOMAIN` dans `.env` et passe l'option à `authLayer({ provider: 'cfAccess', cfAccessTeamDomain: process.env.CF_ACCESS_TEAM_DOMAIN })` dans `middleware.ts` — cela activera la vérification JWKS côté app aussi.

## Ajouter un composant shadcn ou Aceternity

```bash
# shadcn standard
pnpm exec shadcn@latest add button card dialog

# Aceternity Pro (registry config dans components.json)
pnpm exec shadcn@latest add @aceternity/bento-grid
pnpm exec shadcn@latest add @aceternity/background-beams
pnpm exec shadcn@latest add @aceternity/spotlight
```

Catalogue Aceternity : https://ui.aceternity.com/components

## Motion+

Les animations premium Motion+ s'installent via tarball authentifiée (token = `MOTION_PLUS_LICENSE` env var) :

```bash
pnpm add "https://api.motion.dev/registry.tgz?package=motion-plus&version=latest&token=$MOTION_PLUS_LICENSE"
```

Puis import :

```tsx
import { Carousel } from "motion-plus/react";
```

## Forge.manifest.json

Fichier forensique géré par le moteur FORGE. **Ne pas modifier manuellement.**

## Releases

- **v0.2.0** (2026-04-28) — pattern internal-app v2 : Supabase clients, shadcn, Aceternity, Motion+, fonts, Stella tokens, Quality Gates étendus
- **v0.1.0** (2026-04-21) — scaffold initial : Next.js 15 + CF Access + pg + observability + Trivy
