#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

set -a
[[ -f ../.env.dev.generated ]] && . ../.env.dev.generated
[[ -f ../.env.dev ]] && . ../.env.dev
set +a

export VITE_BOOKING_API_URL="${VITE_BOOKING_API_URL:-${LANDING_BOOKING_API_URL:-}}"
export VITE_BOOKING_WIDGET_URL="${VITE_BOOKING_WIDGET_URL:-${LANDING_BOOKING_WIDGET_URL:-}}"
export VITE_BOOKING_WIDGET_ORG="${VITE_BOOKING_WIDGET_ORG:-${LANDING_BOOKING_WIDGET_ORG:-}}"
export VITE_DEMO_FLOW_SLUG="${VITE_DEMO_FLOW_SLUG:-${LANDING_DEMO_FLOW_SLUG:-}}"
export VITE_DEMO_API_URL="${VITE_DEMO_API_URL:-${VITE_BACKEND_URL:-}}"

exec "$@"
