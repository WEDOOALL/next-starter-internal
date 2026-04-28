# Structure du projet — v0.2

```
next-starter-internal/
├── .github/
│   └── workflows/
│       └── ci.yml                    # 6 jobs : quality, security, gitleaks, audit, lighthouse, a11y
├── .husky/
│   └── pre-commit                    # lint-staged auto avant commit
├── app/
│   ├── api/
│   │   └── health/route.ts           # healthcheck (contrat FORGE)
│   ├── globals.css                   # Stella tokens @theme (dark + indigo)
│   ├── layout.tsx                    # fonts Inter Variable + Geist Mono
│   └── page.tsx                      # home — email opérateur CF Access
├── components/
│   └── ui/                           # shadcn components (vide à init)
├── docs/
│   ├── QUICKSTART.md
│   └── STRUCTURE.md                  # ce fichier
├── e2e/
│   ├── home.spec.ts                  # Playwright — home
│   └── a11y.spec.ts                  # Playwright + axe-core — WCAG 2.1 AA
├── lib/
│   ├── db.ts                         # pg Pool global (legacy, optionnel)
│   ├── utils.ts                      # cn() helper (clsx + tailwind-merge)
│   ├── supabase/
│   │   ├── client.ts                 # createBrowserClient (Client Components)
│   │   └── server.ts                 # createServerClient (Server Comp/Actions)
│   └── integrations/
│       └── README.md                 # convention "1 service = 1 dossier"
├── supabase/
│   ├── config.toml                   # Supabase CLI config
│   ├── migrations/                   # SQL versionnées
│   ├── functions/                    # Edge Functions
│   └── seed.sql                      # données dev/CI
├── .env.example                      # variables d'environnement à remplir
├── .gitignore                        # node_modules, .env*, .npmrc, .husky/_/, .lighthouseci/
├── .npmrc.example                    # registries @wedooall + @aceternity
├── .nvmrc                            # Node.js 20 LTS
├── .trivyignore                      # CVE acceptées
├── components.json                   # shadcn config + registry @aceternity
├── forge.manifest.json               # signature FORGE (INVARIANT-03)
├── instrumentation.ts                # hook → @wedooall/observability
├── lighthouserc.json                 # budgets Lighthouse (perf 90, a11y 95)
├── middleware.ts                     # @wedooall/middleware (3 layers)
├── next.config.ts                    # Next.js 15 + headers + remotePatterns
├── package.json                      # 31 deps + 18 devDeps
├── playwright.config.ts              # config E2E
├── postcss.config.mjs                # Tailwind 4 PostCSS
└── tsconfig.json                     # TS strict + noUncheckedIndexedAccess
```

## Fichiers invariants

| Fichier               | Règle                                                               |
| --------------------- | ------------------------------------------------------------------- |
| `forge.manifest.json` | **Ne jamais modifier manuellement** (INVARIANT-03)                  |
| `middleware.ts`       | Garder les 3 layers minimum : security headers, auth, observability |
| `instrumentation.ts`  | Ne pas supprimer — nécessaire Sentry/PostHog server-side            |
| `app/api/health/`     | Endpoint contrat FORGE — utilisé par Coolify + forge-ops            |

## Ajouter une route

Créer `app/ma-route/page.tsx`. Le middleware s'applique automatiquement.

## Ajouter un composant UI

```bash
# shadcn standard (Button, Card, Dialog, etc.)
pnpm exec shadcn@latest add button card dialog

# Aceternity Pro (registry configuré dans components.json)
pnpm exec shadcn@latest add @aceternity/bento-grid
```

## Ajouter une query Supabase (Server Component)

```typescript
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function Page() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.from('users').select('*').limit(10);
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## Ajouter une query Supabase (Client Component)

```typescript
'use client';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    const sb = createSupabaseBrowserClient();
    sb.from('users').select('*').limit(10).then(({ data }) => setUsers(data ?? []));
  }, []);
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

## Ajouter une intégration tierce

Suivre la convention dans `lib/integrations/README.md`. **1 service = 1 dossier.**

```
lib/integrations/
└── stripe/
    ├── client.ts       # createStripeClient() + types
    ├── types.ts
    ├── index.ts        # barrel export
    └── __tests__/
        └── client.test.ts
```
