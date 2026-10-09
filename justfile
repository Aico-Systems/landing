# =============================================================================
# landing/justfile — Mandy's landing page (static SvelteKit, prerendered)
# =============================================================================
# Not in process-compose: the site talks to no AICO service, so it runs on
# its own. Its Vite port (vite.config.js) stays clear of the host plane's
# frontend (5173) and widget (5174).
#
# Deployed as files: a Caddy drop-in on the sandbox box (deploy/landing.caddy)
# serves caddy-conf.d/landing/ at mandy.insight-proglove.com; `just deploy`
# builds, syncs both there and reloads Caddy.
# =============================================================================

BOX := "aico-box"
CONF_DIR := "/opt/aico/caddy-conf.d"
BOX_DIR := CONF_DIR + "/landing"
SITE := "https://mandy.insight-proglove.com"

[private]
default:
    @just --list --unsorted

# Dev server with hot reload (http://localhost:5175)
dev:
    bun install --silent && bun run dev

# Type-check (svelte-check)
check:
    bun run check

# Prerender the static site into build/. Always a production build: the repo's
# direnv sets NODE_ENV=development, which Vite would otherwise build with
build:
    bun install --silent && bun run build

# Serve the built site, as deployed (http://localhost:4173)
preview: build
    bun run preview

# Build, sync the site and its Caddy drop-in to the sandbox box, reload Caddy, check the live page
deploy: build
    #!/usr/bin/env bash
    set -euo pipefail
    echo "==> rsync build/ → {{BOX}}:{{BOX_DIR}}/"
    rsync -az --delete build/ "{{BOX}}:{{BOX_DIR}}/"
    echo "==> deploy/landing.caddy → {{BOX}}:{{CONF_DIR}}/, reload Caddy"
    rsync -a deploy/landing.caddy "{{BOX}}:{{CONF_DIR}}/landing.caddy"
    ssh {{BOX}} docker exec aico-caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
    code=$(curl -s -o /dev/null -w '%{http_code}' "{{SITE}}/en/")
    echo "==> {{SITE}}/en/ → $code"
    [[ "$code" == 200 ]]
