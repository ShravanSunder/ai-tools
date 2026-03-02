#!/usr/bin/env bash
set -euo pipefail

AGENT_VM_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENTRYPOINT="${AGENT_VM_ROOT}/dist/bin/agent-vm.js"

if [[ ! -f "${ENTRYPOINT}" ]]; then
	echo "agent_vm build output missing: ${ENTRYPOINT}" >&2
	echo "Run: pnpm --dir ${AGENT_VM_ROOT} build" >&2
	exit 1
fi

exec node "${ENTRYPOINT}" "$@"
