# `lib/integrations/` — convention WEDOOALL

Tout client SDK ou wrapper d'intégration tierce vit ici. **1 service = 1 dossier**.

## Pattern

```
lib/integrations/
├── README.md                   ← ce fichier
├── <service-a>/
│   ├── client.ts               ← classe ou factory exposant l'API
│   ├── types.ts                ← interfaces TypeScript des payloads
│   ├── index.ts                ← barrel export
│   └── __tests__/
│       └── client.test.ts      ← tests unitaires (mock fetch)
└── <service-b>/
    └── …
```

## Règles

1. **Isolable** : une intégration doit pouvoir être désactivée par feature flag
   ou suppression du dossier sans casser le reste de l'app.
2. **Aucun import croisé** entre `<service-a>/` et `<service-b>/`. Si deux clients
   ont besoin de types communs, ils vivent dans `lib/types.ts` racine.
3. **Pas d'API call hors `lib/integrations/`** — Server Actions, Route Handlers,
   Edge Functions doivent passer par les clients exportés ici.
4. **Lecture des secrets via `process.env.*` UNIQUEMENT dans la factory** —
   les types et fonctions n'y ont pas accès directement.
5. **Tests unitaires obligatoires** — chaque méthode de client testée en mockant
   `fetch` (Vitest `vi.fn()`).

## Exemples

```typescript
// lib/integrations/dataforseo/client.ts
export interface DataForSEOClientOpts {
  login: string;
  password: string;
  fetchImpl?: typeof fetch;
}

export class DataForSEOClient {
  constructor(private opts: DataForSEOClientOpts) {}

  async getKeywordVolume(keyword: string): Promise<{ volume: number }> {
    /* ... */
  }
}

export function createDataForSEOClient(): DataForSEOClient | null {
  const login = process.env["DATAFORSEO_LOGIN"];
  const password = process.env["DATAFORSEO_PASSWORD"];
  if (!login || !password) return null;
  return new DataForSEOClient({ login, password });
}
```

```typescript
// app/api/seo/audit/route.ts
import { createDataForSEOClient } from "@/lib/integrations/dataforseo";

export async function POST() {
  const client = createDataForSEOClient();
  if (!client) {
    return new Response("DataForSEO not configured", { status: 503 });
  }
  // ...
}
```

## Inspirations

- `engine/src/integrations/` du repo `001- FORGE` — 5 clients (GitHub, Coolify,
  Cloudflare, Infisical, Hetzner) suivent ce pattern à la lettre.
