# Agent VM Observability Startup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Agent VM beta and `shravan-claw-beta` easy to start with shared observability, while keeping shared stack lifecycle and query recipes in `ai-tools`.

**Architecture:** Agent VM owns config schema, managed-mode behavior, external-mode validation, and generated deployment docs. `shravan-claw-beta` owns deployment opt-in, package freshness, and strict observable start breadcrumbs. `ai-tools` owns the shared stack, query recipes, and agent-facing runbook skill.

**Tech Stack:** Agent VM TypeScript/Vitest, JSONC deployment config, pnpm scripts, Agent VM generated manuals, `shravan-dev-workflow:ops-observability-stack`.

---

## Scope

Implementation work happens in two clean worktrees:

```text
/Users/shravansunder/Documents/dev/project-dev/agent-vm.ai-tools-observability-agent-vm
branch: ai-tools-observability-agent-vm

/Users/shravansunder/Documents/dev/project-dev/shravan-claw-beta.ai-tools-observability-shravan-claw-beta
branch: ai-tools-observability-shravan-claw-beta
```

This plan is stored in `ai-tools` because it is part of the common observability rollout. The Agent VM repo should not gain large Victoria query recipes. Those live in `ops-observability-stack`.
The shared design source is
`docs/superpowers/specs/2026-06-13-shared-observability-dev-loop-design.md`.

## Requirements / Proof Matrix

| Requirement | Task | Proof Gate | Layer |
| --- | --- | --- | --- |
| Agent VM docs explain external shared stack without changing managed behavior | 1 | `pnpm exec vitest run packages/agent-vm/src/cli/manual-templates.unit.test.ts` | unit |
| Agent VM generated manual points agents to ai-tools and the skill | 1 | manual template test | unit/docs |
| `shravan-claw-beta` opts into external observability | 2 | `pnpm validate` | integration |
| Shared external mode has required repo/worktree identity | 2 | `pnpm validate`; config/schema tests | integration |
| Shared external mode rejects non-loopback collector overrides | 2 | config/schema tests | unit/integration |
| `shravan-claw-beta` strict observable start writes reattachable state | 3 | `pnpm observability:start -- --detach`; state file inspection | smoke |
| `shravan-claw-beta` startup proof is bounded | 3 | `pnpm observability:status`; `pnpm stop` | smoke |
| Plain `pnpm start` remains fail-open and is not observability proof | 3 | AGENTS/package wording | docs/static |
| Query/debug details are not duplicated in Agent VM or deployment docs | 1, 2 | `rg -n "select/logsql/query|api/v1/query|jaeger/api/traces"` returns no app-local recipe docs | static |

## What Belongs Where

Agent VM repo:

- config schema and validation
- managed vs external stack documentation
- generated manual snippet for external shared stack
- doctor output that says whether collector is reachable
- external-mode schema support for the shared baseline resource attributes
- no Victoria query cookbook

`shravan-claw-beta` repo:

- external observability opt-in
- `pnpm` start/validate/doctor path
- strict observable start helper with marker, PID, log, endpoint, and state file
- service names for OpenClaw telemetry
- no Docker Compose stack and no query cookbook

`ai-tools`:

- `observability/observability-stack`
- `ops-observability-stack` skill
- Victoria query recipes
- safety/cardinality guidance

## Shared Resource Contract

Agent VM and `shravan-claw-beta` should consume the ai-tools stack contract
instead of defining a second local observability namespace.

```text
AI_TOOLS_OBSERVABILITY_STACK_HELPER=~/dev/ai-tools/observability/observability-stack
AI_TOOLS_OBSERVABILITY_COLLECTOR_HEALTH_URL=http://127.0.0.1:13133/
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318
```

OpenClaw beta producer attributes should follow the shared ai-tools skill:

```text
service.name=shravan-claw-beta-openclaw
dev.repo.hash=<hash of repo root>
dev.worktree.hash=<hash of worktree root>
dev.branch.name=<current branch>
dev.runtime.flavor=beta
dev.release.channel=beta
```

Do not create Agent VM-specific Victoria containers for this shared local mode.
Managed mode can still own its deployment-local stack when explicitly selected.
External shared mode must reject non-loopback collector endpoint or health URL
overrides. `dev.repo.hash` and `dev.worktree.hash` are hard requirements for
shared local mode; if the current schema cannot emit them, this rollout includes
the schema work rather than shipping without them.

`host.observability.stack.mode` is the stack ownership axis:

```text
managed  -> Agent VM owns deployment-local Compose/config/data
external -> a shared collector already exists and Agent VM must not start Compose
```

`host.observability.mode` is the runtime telemetry wiring axis. For this rollout
it remains `collector` so OpenClaw telemetry is emitted to the external
collector.

## Task 1: Make Agent VM External Mode Discoverable

**Files:**
- Modify: `/Users/shravansunder/Documents/dev/project-dev/agent-vm.ai-tools-observability-agent-vm/docs/reference/configuration/system-json.md`
- Modify: `/Users/shravansunder/Documents/dev/project-dev/agent-vm.ai-tools-observability-agent-vm/packages/agent-vm/src/cli/manual-templates.ts`
- Modify: `/Users/shravansunder/Documents/dev/project-dev/agent-vm.ai-tools-observability-agent-vm/packages/agent-vm/src/cli/manual-templates.unit.test.ts`

- [ ] **Step 1: Add manual test expectations**

In `manual-templates.unit.test.ts`, assert the generated observability manual contains:

```text
~/dev/ai-tools/observability/observability-stack
shravan-dev-workflow:ops-observability-stack
AI_TOOLS_OBSERVABILITY_STACK_HELPER
Managed mode remains deployment-owned
External mode does not start Docker Compose
host.observability.stack.mode chooses stack ownership
host.observability.mode chooses telemetry wiring
dev.repo.hash
dev.worktree.hash
plain pnpm start is fail-open and not proof
pnpm observability:start is the strict proof path
```

Also assert it does not contain `devfiles`.

- [ ] **Step 2: Run red**

Run:

```bash
pnpm exec vitest run packages/agent-vm/src/cli/manual-templates.unit.test.ts
```

Expected: fails before manual wording is added.

- [ ] **Step 3: Update manual template**

Update `manual-templates.ts` with a short external-mode paragraph:

```text
For personal local shared observability, start ~/dev/ai-tools/observability/observability-stack and configure host.observability.stack.mode=external. External mode does not render or start Docker Compose. Managed mode remains deployment-owned by Agent VM. host.observability.stack.mode chooses stack ownership; host.observability.mode chooses runtime telemetry wiring and remains collector for OpenClaw telemetry. Shared local mode requires dev.repo.hash and dev.worktree.hash. Plain pnpm start is fail-open and not proof; pnpm observability:start is the strict marker/state proof path. The shared helper/env names use AI_TOOLS_OBSERVABILITY_*. For query recipes and debugging loops, load shravan-dev-workflow:ops-observability-stack.
```

- [ ] **Step 4: Update reference docs**

In `system-json.md`, add the same concise distinction:

- managed mode: Agent VM owns Compose/config/data
- external mode: shared collector already exists
- `ai-tools` is the personal shared-stack path
- `host.observability.stack.mode` chooses ownership; `host.observability.mode` chooses telemetry wiring
- plain `pnpm start` may degrade/fail open and is not proof
- strict observable starts must write marker/state/PID/log breadcrumbs
- query recipes live in the skill

Keep the section under one screen. Do not paste curl recipes.

- [ ] **Step 5: Validate**

Run:

```bash
pnpm exec vitest run packages/agent-vm/src/cli/manual-templates.unit.test.ts
pnpm check
rg -n "select/logsql/query|api/v1/query|jaeger/api/traces" docs/reference/configuration packages/agent-vm/src/cli
```

Expected: tests/check pass; `rg` exits nonzero because no Victoria query cookbook was added.

## Task 2: Configure `shravan-claw-beta` For External Shared Observability

**Files:**
- Modify: `/Users/shravansunder/Documents/dev/project-dev/shravan-claw-beta.ai-tools-observability-shravan-claw-beta/config/system.jsonc`
- Modify: `/Users/shravansunder/Documents/dev/project-dev/shravan-claw-beta.ai-tools-observability-shravan-claw-beta/package.json` only if package sync changes it
- Modify: lockfile only if package sync changes it

- [ ] **Step 1: Inspect current deployment**

Run:

```bash
git status --short --branch
rg -n "host\\.observability|observability|@agent-vm/agent-vm|zone|beta" config/system.jsonc package.json
```

Expected: confirms current package and zone state before edits.

- [ ] **Step 2: Add host external observability**

In `config/system.jsonc`, merge this under `host`:

```jsonc
"observability": {
  "enabled": true,
  "stack": {
    "mode": "external",
    "scrubbing": { "responsibility": "external-collector" }
  },
  "mode": "collector",
  "bindAddress": "127.0.0.1",
  "controllerStartPolicy": "degraded",
  "startupCheckTimeoutMs": 30000
}
```

This keeps ordinary controller startup fail-open/degraded. Do not describe this
path as observability proof; proof uses the strict `pnpm observability:start`
helper in Task 3.

- [ ] **Step 3: Enable beta zone telemetry**

Enable the `beta` zone for OpenClaw logs, metrics, and traces using the schema accepted by the current Agent VM branch. Use a stable service name:

```text
shravan-claw-beta-openclaw
```

Attach the shared resource attributes. They are not optional for shared external
mode:

```text
dev.repo.hash
dev.worktree.hash
dev.branch.name
dev.runtime.flavor=beta
dev.release.channel=beta
```

If validation rejects the proposed shape, inspect `packages/agent-vm/src/config/system-config.ts` in the Agent VM worktree and adjust to the accepted schema without changing the intent.
If the current Agent VM schema cannot represent these attributes, add the schema
support in this branch before enabling `shravan-claw-beta` external shared mode.

Add or update config/schema tests so external shared mode rejects non-loopback
collector endpoint or health URL overrides.

- [ ] **Step 4: Refresh package if required**

From the Agent VM worktree, run:

```bash
pnpm dev:sync-tarballs -- --deployment ../shravan-claw-beta.ai-tools-observability-shravan-claw-beta
```

Expected: `shravan-claw-beta` points at the current local Agent VM tarball only if required by the external observability feature.

## Task 3: Keep Startup Smooth

**Files:**
- Modify: `/Users/shravansunder/Documents/dev/project-dev/shravan-claw-beta.ai-tools-observability-shravan-claw-beta/package.json`
- Create: `/Users/shravansunder/Documents/dev/project-dev/shravan-claw-beta.ai-tools-observability-shravan-claw-beta/scripts/run-observable-openclaw-beta.sh`
- Modify: `/Users/shravansunder/Documents/dev/project-dev/shravan-claw-beta.ai-tools-observability-shravan-claw-beta/AGENTS.md` only if the repo already uses it for local commands

- [ ] **Step 1: Keep plain start simple and fail-open**

The normal startup path should remain:

```bash
pnpm validate
pnpm doctor
pnpm start
```

Plain `pnpm start` is not observability proof. It may use the configured
external collector when available, but it must not be the strict marker/state
proof path.

- [ ] **Step 2: Add strict observable scripts**

Add scripts:

```json
"observability:doctor": "agent-vm doctor --config config/system.jsonc --show-passed",
"observability:start": "bash scripts/run-observable-openclaw-beta.sh",
"observability:status": "agent-vm controller status --config config/system.jsonc && agent-vm controller health --config config/system.jsonc --zone beta && agent-vm controller service-health --config config/system.jsonc --zone beta"
```

Do not add query scripts. The skill owns Victoria queries.

- [ ] **Step 3: Add observable start helper**

Create `scripts/run-observable-openclaw-beta.sh` with this behavior:

- require `~/dev/ai-tools/observability/observability-stack` unless overridden by `AI_TOOLS_OBSERVABILITY_STACK_HELPER`
- check collector health before launching and reject non-loopback overrides
- create a marker and query start time
- compute `dev.repo.hash`, `dev.worktree.hash`, and `dev.branch.name`
- set `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318`
- set resource attributes for `service.name=shravan-claw-beta-openclaw`, repo hash, worktree hash, branch, runtime flavor, and release channel
- launch `agent-vm controller start --config config/system.jsonc --zone beta`
- support `--detach` for smoke proof
- write `tmp/observability/latest-observability.env` with the generic portable keys:

```text
OBSERVABILITY_MARKER
OBSERVABILITY_QUERY_START
OBSERVABILITY_PID
OBSERVABILITY_SERVICE_NAME
OBSERVABILITY_RUNTIME_FLAVOR
OBSERVABILITY_RELEASE_CHANNEL
OBSERVABILITY_OTLP_ENDPOINT
OBSERVABILITY_BACKEND
OBSERVABILITY_REPO_HASH
OBSERVABILITY_WORKTREE_HASH
OBSERVABILITY_BRANCH_NAME
OBSERVABILITY_APP_PATH
OBSERVABILITY_LOG_PATH
OBSERVABILITY_DATA_DIR
OBSERVABILITY_RUNTIME_DIR
```

The helper prints collector URL, marker, PID, log path, state path, and runtime
root. It cleans up only the process it launched.

- [ ] **Step 4: Add only a tiny pointer**

If local agent instructions need an update, add only:

```markdown
For shared local observability, start `~/dev/ai-tools/observability/observability-stack`, then run `pnpm observability:doctor` and `pnpm observability:start -- --detach`. Use `pnpm observability:status` for bounded readiness and load `shravan-dev-workflow:ops-observability-stack` for Victoria query proof by marker.
```

- [ ] **Step 5: Validate**

Run:

```bash
~/dev/ai-tools/observability/observability-stack up
pnpm validate
bash -n scripts/run-observable-openclaw-beta.sh
pnpm observability:doctor
pnpm observability:start -- --detach
pnpm observability:status
pnpm stop
```

Expected: validation and doctor pass. Observable start launches without starting
a managed observability stack, writes a complete state file, readiness is checked
through bounded controller commands, and `pnpm stop` shuts down the launched
controller. Use `ops-observability-stack` from ai-tools to query Victoria by
marker and prove the OpenClaw beta telemetry landed on the shared stack.

## Task 4: Final Proof And PRs

- [ ] **Step 1: Agent VM proof**

Run in Agent VM worktree:

```bash
pnpm exec vitest run packages/agent-vm/src/cli/manual-templates.unit.test.ts
pnpm check
```

- [ ] **Step 2: shravan-claw-beta proof**

Run in `shravan-claw-beta` worktree:

```bash
pnpm validate
bash -n scripts/run-observable-openclaw-beta.sh
pnpm observability:doctor
pnpm observability:start -- --detach
pnpm observability:status
pnpm stop
```

- [ ] **Step 3: Push and open PRs**

Open separate PRs:

- Agent VM branch: `ai-tools-observability-agent-vm`
- `shravan-claw-beta` branch: `ai-tools-observability-shravan-claw-beta`

Each PR description should state: common stack/query knowledge lives in `ai-tools`.
