# Structure du projet

```
next-starter-internal/
├── .github/
│   └── workflows/
│       └── ci.yml              # Lint + typecheck + test + build + Trivy
├── app/
│   ├── globals.css             # Tailwind 4 global import
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page — affiche email opérateur CF Access
├── docs/
│   ├── QUICKSTART.md           # Guide de démarrage rapide
│   └── STRUCTURE.md            # Ce fichier
├── e2e/
│   └── home.spec.ts            # Playwright E2E — home page
├── lib/
│   └── db.ts                   # Pool PostgreSQL + helper query()
├── .env.example                # Variables d'environnement à remplir
├── .nvmrc                      # Node.js 20 LTS
├── forge.manifest.json         # Signature forensique FORGE (INVARIANT-03)
├── instrumentation.ts          # Hook Next.js → @wedooall/observability
├── middleware.ts               # @wedooall/middleware : security + auth + observability
├── next.config.ts              # Config Next.js 15
├── package.json
├── playwright.config.ts        # Config Playwright E2E
├── postcss.config.mjs          # Tailwind 4 PostCSS plugin
└── tsconfig.json               # TypeScript strict + noUncheckedIndexedAccess
```

## Fichiers invariants

| Fichier | Règle |
|---|---|
| `forge.manifest.json` | **Ne jamais modifier manuellement** (INVARIANT-03) |
| `middleware.ts` | Garder les 3 layers minimum : security headers, auth CF Access, observability |
| `instrumentation.ts` | Ne pas supprimer — nécessaire pour Sentry/PostHog côté serveur |

## Ajouter une route

Créer `app/ma-route/page.tsx`. Le middleware s'applique automatiquement.

## Ajouter une query SQL

```typescript
import { query } from '@/lib/db';

const rows = await query<{ id: number; name: string }>('SELECT id, name FROM users WHERE id = $1', [userId]);
```
