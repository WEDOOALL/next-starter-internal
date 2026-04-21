# Quickstart — next-starter-internal

## Temps estimé : < 10 minutes

### Étape 1 — Créer ton app depuis le template

```bash
gh repo create mon-app --template WEDOOALL/next-starter-internal --private --clone
cd mon-app
```

### Étape 2 — Configurer le registry @wedooall

```bash
# Ajouter dans .npmrc (ne pas commiter)
echo "@wedooall:registry=https://registry.wedooall.com" >> .npmrc
echo "//registry.wedooall.com/:_authToken=TON_TOKEN" >> .npmrc
```

### Étape 3 — Variables d'environnement

```bash
cp .env.example .env.local
```

Remplir au minimum :

| Variable | Source |
|---|---|
| `DATABASE_URL` | Supabase → Project Settings → Database |
| `SENTRY_DSN` | Sentry → Project → Client Keys |
| `POSTHOG_API_KEY` | PostHog → Project → API Keys |
| `MOCK_OPERATOR_EMAIL` | Email de dev local (ex: ton-email@wedooall.com) |

### Étape 4 — Installer et démarrer

```bash
pnpm install
pnpm dev
# → http://localhost:3000
```

### Étape 5 — Vérifier

- La page d'accueil affiche ton `MOCK_OPERATOR_EMAIL`
- Pas d'erreur TypeScript : `pnpm typecheck`
- Tests passent : `pnpm test`

## Production

En production, l'app est protégée par Cloudflare Access. L'email de l'opérateur est extrait du JWT `Cf-Access-Jwt-Assertion` côté serveur.

Pour activer la validation JWKS complète, ajouter dans `.env` :
```
CF_ACCESS_TEAM_DOMAIN=monteam.cloudflareaccess.com
```

Et mettre à jour `middleware.ts` :
```typescript
authLayer({ provider: 'cfAccess', cfAccessTeamDomain: process.env.CF_ACCESS_TEAM_DOMAIN })
```

## CI

La CI tourne automatiquement sur chaque PR / push `main` :
- Lint → Typecheck → Tests → Build → Trivy (CRITICAL/HIGH)

Configurer le secret GitHub `WEDOOALL_NPM_TOKEN` dans les settings du repo.

## Modules FORGE (provisionning)

Le `forge.manifest.json` est mis à jour automatiquement par le moteur FORGE lors du provisioning. Ne pas modifier manuellement.
