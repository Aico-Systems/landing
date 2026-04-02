#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

set -a
[[ -f ../.env.dev.generated ]] && . ../.env.dev.generated
[[ -f ../.env.dev ]] && . ../.env.dev
set +a

required_vars=(
	LANDING_SITE_URL
	LANDING_BOOKING_API_URL
	LANDING_BOOKING_WIDGET_URL
	LANDING_BOOKING_WIDGET_ORG
)

for var_name in "${required_vars[@]}"; do
	if [[ -z "${!var_name:-}" ]]; then
		echo "[with-env] Missing required env var: ${var_name}" >&2
		exit 1
	fi
done

export VITE_BOOKING_API_URL="${LANDING_BOOKING_API_URL}"
export VITE_BOOKING_WIDGET_URL="${LANDING_BOOKING_WIDGET_URL}"
export VITE_BOOKING_WIDGET_ORG="${LANDING_BOOKING_WIDGET_ORG}"
export VITE_DEMO_FLOW_SLUG="${LANDING_DEMO_FLOW_SLUG:-}"
export VITE_DEMO_API_URL="${LANDING_DEMO_API_URL:-}"

exec "$@"
