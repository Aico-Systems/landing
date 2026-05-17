#!/usr/bin/env bash
set -euo pipefail

# Forwards `LANDING_*` env vars (sourced from the umbrella repo's
# `.env.dev`) to Vite as `VITE_*`. Used by every `bun run …` script.
#
# Soft-fails on missing config: the landing has runtime fallbacks for
# every external dependency (CMS offline page, "booking not configured"
# panel, AicoFlowWidget no-op), so an incomplete dev env should still
# boot Vite — the user just sees the in-app fallback messages instead
# of the page bombing before it loads. Hard-required vars belong in
# the scripts that genuinely can't run without them (e.g. generate-seo).

cd "$(dirname "$0")/.."

set -a
[[ -f ../.env.dev.generated ]] && . ../.env.dev.generated
[[ -f ../.env.dev ]] && . ../.env.dev
set +a

# Side-effect-import of the widget IIFE (registers <aico-flow> + <aico-orb>)
# expects a pre-built bundle at widget/dist/widget.js. Build it on demand
# if missing — once after a fresh clone is enough; it's cached afterwards.
if [[ ! -f ../widget/dist/widget.js ]]; then
	echo "[with-env] widget bundle missing — building (cd ../widget && bun run build) ..." >&2
	( cd ../widget && bun install --silent && bun run build ) >&2 || {
		echo "[with-env] widget build failed — landing will boot without the embedded widget." >&2
	}
fi

# Surface — but don't fail on — config the landing renders differently
# without. Helps spot misconfig in CI / staging without blocking local dev.
recommended_vars=(
	LANDING_BOOKING_API_URL
	LANDING_BOOKING_WIDGET_URL
	LANDING_BOOKING_WIDGET_ORG
)

for var_name in "${recommended_vars[@]}"; do
	if [[ -z "${!var_name:-}" ]]; then
		echo "[with-env] note: ${var_name} not set — related UI will show its fallback state." >&2
	fi
done

export VITE_BOOKING_API_URL="${LANDING_BOOKING_API_URL:-}"
export VITE_BOOKING_WIDGET_URL="${LANDING_BOOKING_WIDGET_URL:-}"
export VITE_BOOKING_WIDGET_ORG="${LANDING_BOOKING_WIDGET_ORG:-}"
export VITE_DEMO_FLOW_SLUG="${LANDING_DEMO_FLOW_SLUG:-}"
export VITE_DEMO_FLOW_ORG="${LANDING_DEMO_FLOW_ORG:-}"
export VITE_DEMO_API_URL="${LANDING_DEMO_API_URL:-}"

exec "$@"
