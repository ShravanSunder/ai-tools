#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/lib/test-helpers.sh"

scenario="$SCRIPT_DIR/pressure-scenarios/discuss-with-me-fuzzy-intent.md"
run_pressure_scenario_file "$scenario" "${SKILL_PRESSURE_TIMEOUT:-900}"
