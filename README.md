# next-starter-internal

Template WEDOOALL pour apps internes — Next.js 15 App Router, CF Access, Postgres, observability pré-câblés.

## Quickstart

### 1. Fork le template

```bash
gh repo create mon-app --template WEDOOALL/next-starter-internal --private --clone
cd mon-app
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
# Remplir DATABASE_URL, SENTRY_DSN, POSTHOG_API_KEY
```

### 3. Lancer en local

```bash
pnpm install
pnpm dev
# → http://localhost:3000
```

En développement, le middleware CF Access est désactivé. La page affiche `MOCK_OPERATOR_EMAIL` (défaut : `dev@local`).

### Sécurité JWT CF Access

Le JWT CF Access est décodé côté server component **uniquement pour afficher l'email opérateur** (`app/page.tsx`). La validation de signature est faite au niveau **edge Cloudflare Access** — le JWT ne peut pas atteindre l'origin sans être signé par CF Access si le tunnel/WARP est correctement configuré.

⚠️ **Pour défense-en-profondeur en prod :** configure `CF_ACCESS_TEAM_DOMAIN` dans `.env` et passe l'option à `authLayer({ provider: 'cfAccess', cfAccessTeamDomain: process.env.CF_ACCESS_TEAM_DOMAIN })` dans `middleware.ts` — cela activera la vérification JWKS côté app aussi.

## Stack

| Couche | Techno |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript strict |
| Styling | Tailwind CSS 4 |
| Auth | Cloudflare Access (JWT) |
| Database | PostgreSQL via `pg` |
| Observability | Sentry + PostHog via `@wedooall/observability` |
| Middleware | `@wedooall/middleware` (security headers, auth, observability) |

## Prérequis registry

Les packages `@wedooall/*` sont publiés sur le registry privé WEDOOALL.
Configurer `.npmrc` avec :

```
@wedooall:registry=https://registry.wedooall.com
```

## Structure

Voir [`docs/STRUCTURE.md`](docs/STRUCTURE.md).

## CI

GitHub Actions : lint → typecheck → test → build → Trivy (voir `.github/workflows/ci.yml`).

## forge.manifest.json

Fichier forensique géré par le moteur FORGE. **Ne pas modifier manuellement.**
