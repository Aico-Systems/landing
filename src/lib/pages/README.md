# Landing Pages

All non-home routes for the landing app live here as Svelte page components.

Current app paths:

- `/`
- `/imprint/`
- `/privacy/`
- `/terms/`
- `/policies/`
- `/docs/`
- `/blog/`
- `/security/`
- `/status/`

Routing model:

- client-side navigation via `src/lib/utils/appNavigation.ts`
- lazy-loaded page components from `App.svelte`
- no separate HTML files per legal/docs page

Deployment note:

- direct deep links like `/privacy/` require the host to rewrite unknown paths to
  `/index.html` (standard SPA fallback)
