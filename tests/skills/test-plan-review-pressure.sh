#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/lib/test-helpers.sh"

scenario="$SCRIPT_DIR/pressure-scenarios/plan-review-whole-artifact.md"
run_pressure_scenario_file "$scenario" "${SKILL_PRESSURE_TIMEOUT:-900}"
