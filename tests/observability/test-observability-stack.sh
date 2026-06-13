#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
STACK="$ROOT/observability/observability-stack"
COMPOSE="$ROOT/observability/docker-compose.yml"
COLLECTOR="$ROOT/observability/otel-collector.yaml"

fail() {
  echo "[FAIL] $*" >&2
  exit 1
}

assert_file() {
  local path="$1"
  [ -f "$path" ] || fail "missing file: $path"
}

assert_no_devfiles() {
  local path="$1"
  if grep -R "devfiles" "$path" >/dev/null 2>&1; then
    fail "devfiles reference found under $path"
  fi
}

assert_contains() {
  local path="$1"
  local needle="$2"
  grep -F "$needle" "$path" >/dev/null || fail "missing '$needle' in $path"
}

assert_rendered_ports_are_loopback() {
  local rendered_config="$1"
  local bad_ports
  bad_ports="$(
    printf '%s\n' "$rendered_config" |
      awk '/published: "[0-9]+"/ || /published: [0-9]+/ { in_port = 1 }
           in_port && /host_ip:/ && $0 !~ /127[.]0[.]0[.]1/ { print; bad = 1 }
           in_port && /target:/ { in_port = 0 }
           END { exit bad ? 0 : 1 }' || true
  )"
  [ -z "$bad_ports" ] || fail "non-loopback published port found: $bad_ports"
}

assert_single_shared_data_root() {
  local rendered_config="$1"
  local data_root_count
  data_root_count="$(
    printf '%s\n' "$rendered_config" |
      grep -F "$AI_TOOLS_OBSERVABILITY_DATA_DIR" |
      sed -E 's#.*source: (.*)/[^/]+#\1#' |
      sort -u |
      wc -l |
      tr -d ' '
  )"
  [ "$data_root_count" = "1" ] || fail "expected one shared data root, found $data_root_count"
}

main() {
  export AI_TOOLS_OBSERVABILITY_DATA_DIR="${AI_TOOLS_OBSERVABILITY_DATA_DIR:-$ROOT/tmp/observability-test-data}"
  export AI_TOOLS_OBSERVABILITY_PROJECT_NAME="${AI_TOOLS_OBSERVABILITY_PROJECT_NAME:-ai-tools-observability-test}"
  export RETENTION_PERIOD="${RETENTION_PERIOD:-15d}"
  export LOGS_MAX_BYTES="${LOGS_MAX_BYTES:-10737418240}"
  export TRACES_MAX_BYTES="${TRACES_MAX_BYTES:-10737418240}"
  export METRICS_MIN_FREE_BYTES="${METRICS_MIN_FREE_BYTES:-10737418240}"

  assert_file "$STACK"
  [ -x "$STACK" ] || fail "stack helper is not executable: $STACK"
  assert_file "$COMPOSE"
  assert_file "$COLLECTOR"

  assert_no_devfiles "$ROOT/observability"
  bash -n "$STACK"

  "$STACK" collector-url | grep -Fx 'http://127.0.0.1:4318' >/dev/null
  "$STACK" env | grep -Fx 'OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318' >/dev/null

  rendered_config="$(docker compose --file "$COMPOSE" config)"
  printf '%s\n' "$rendered_config" | grep -F '127.0.0.1:' >/dev/null
  printf '%s\n' "$rendered_config" | grep -F -- '-retentionPeriod=15d' >/dev/null
  printf '%s\n' "$rendered_config" | grep -F -- '-storage.minFreeDiskSpaceBytes=10737418240' >/dev/null
  printf '%s\n' "$rendered_config" | grep -F -- '-retention.maxDiskSpaceUsageBytes=10737418240' >/dev/null

  assert_rendered_ports_are_loopback "$rendered_config"
  assert_single_shared_data_root "$rendered_config"

  assert_contains "$COMPOSE" "127.0.0.1:"
  assert_contains "$COMPOSE" "ai-tools-otel-collector"
  assert_contains "$COMPOSE" "ai-tools-victoria-metrics"
  assert_contains "$COMPOSE" "ai-tools-victoria-logs"
  assert_contains "$COMPOSE" "ai-tools-victoria-traces"

  assert_contains "$COLLECTOR" "VL-Stream-Fields"
  assert_contains "$COLLECTOR" "VL-Ignore-Fields"
  assert_contains "$COLLECTOR" "http://ai-tools-victoria-metrics:8428/opentelemetry/v1/metrics"
  assert_contains "$COLLECTOR" "http://ai-tools-victoria-logs:9428/insert/opentelemetry/v1/logs"
  assert_contains "$COLLECTOR" "http://ai-tools-victoria-traces:10428/insert/opentelemetry/v1/traces"
  assert_contains "$COLLECTOR" "delete"
  assert_contains "$COLLECTOR" "redact"

  if grep -F "down -v" "$STACK" >/dev/null; then
    fail "stack helper must not run docker compose down -v"
  fi
  if grep -E "rm -rf .*(DATA_DIR|AI_TOOLS_OBSERVABILITY_DATA_DIR)" "$STACK" >/dev/null; then
    fail "stack helper must not delete the shared data root"
  fi
}

main "$@"
