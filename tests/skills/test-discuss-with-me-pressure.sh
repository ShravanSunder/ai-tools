#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/lib/test-helpers.sh"

failed=0
for scenario in "$SCRIPT_DIR"/pressure-scenarios/discuss-with-me-*.md; do
  echo "Running $(basename "$scenario")"
  run_pressure_scenario_file "$scenario" "${SKILL_PRESSURE_TIMEOUT:-900}" || failed=1
  echo ""
done
exit "$failed"
