# Agent VM Observability Startup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Agent VM beta and `shravan-claw-beta` easy to start with shared observability, while keeping shared stack lifecycle and query recipes in `ai-tools`.

**Architecture:** Agent VM owns config schema, managed-mode behavior, external-mode validation, and generated deployment docs. `shravan-claw-beta` owns deployment opt-in and package freshness. `ai-tools` owns the shared stack, query recipes, and agent-facing runbook skill.

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
| `shravan-claw-beta` startup remains simple | 3 | `pnpm doctor`; `pnpm start` | smoke |
| Query/debug details are not duplicated in Agent VM or deployment docs | 1, 2 | `rg -n "select/logsql/query|api/v1/query|jaeger/api/traces"` returns no app-local recipe docs | static |

## What Belongs Where

Agent VM repo:

- config schema and validation
- managed vs external stack documentation
- generated manual snippet for external shared stack
- doctor output that says whether collector is reachable
- no Victoria query cookbook

`shravan-claw-beta` repo:

- external observability opt-in
- `pnpm` start/validate/doctor path
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
For personal local shared observability, start ~/dev/ai-tools/observability/observability-stack and configure host.observability.stack.mode=external. External mode does not render or start Docker Compose. Managed mode remains deployment-owned by Agent VM. The shared helper/env names use AI_TOOLS_OBSERVABILITY_*. For query recipes and debugging loops, load shravan-dev-workflow:ops-observability-stack.
```

- [ ] **Step 4: Update reference docs**

In `system-json.md`, add the same concise distinction:

- managed mode: Agent VM owns Compose/config/data
- external mode: shared collector already exists
- `ai-tools` is the personal shared-stack path
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

- [ ] **Step 3: Enable beta zone telemetry**

Enable the `beta` zone for OpenClaw logs, metrics, and traces using the schema accepted by the current Agent VM branch. Use a stable service name:

```text
shravan-claw-beta-openclaw
```

Attach the shared resource attributes if the current Agent VM schema supports
resource attributes:

```text
dev.repo.hash
dev.worktree.hash
dev.branch.name
dev.runtime.flavor=beta
dev.release.channel=beta
```

If validation rejects the proposed shape, inspect `packages/agent-vm/src/config/system-config.ts` in the Agent VM worktree and adjust to the accepted schema without changing the intent.

- [ ] **Step 4: Refresh package if required**

From the Agent VM worktree, run:

```bash
pnpm dev:sync-tarballs -- --deployment ../shravan-claw-beta.ai-tools-observability-shravan-claw-beta
```

Expected: `shravan-claw-beta` points at the current local Agent VM tarball only if required by the external observability feature.

## Task 3: Keep Startup Smooth

**Files:**
- Modify: `/Users/shravansunder/Documents/dev/project-dev/shravan-claw-beta.ai-tools-observability-shravan-claw-beta/package.json`
- Modify: `/Users/shravansunder/Documents/dev/project-dev/shravan-claw-beta.ai-tools-observability-shravan-claw-beta/AGENTS.md` only if the repo already uses it for local commands

- [ ] **Step 1: Ensure core scripts are enough**

The smooth startup path should be:

```bash
~/dev/ai-tools/observability/observability-stack up
pnpm validate
pnpm doctor
pnpm start
```

If `package.json` lacks a clear observability check, add one script:

```json
"observability:doctor": "agent-vm doctor --config config/system.jsonc --show-passed"
```

Do not add query scripts. The skill owns queries.

- [ ] **Step 2: Add only a tiny pointer**

If local agent instructions need an update, add only:

```markdown
For shared local observability, start `~/dev/ai-tools/observability/observability-stack`, then run `pnpm observability:doctor` and `pnpm start`. Load `shravan-dev-workflow:ops-observability-stack` for query recipes and debugging.
```

- [ ] **Step 3: Validate**

Run:

```bash
~/dev/ai-tools/observability/observability-stack up
pnpm validate
pnpm observability:doctor
pnpm start
```

Expected: validation and doctor pass. `pnpm start` launches without starting a managed observability stack.

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
pnpm observability:doctor
```

- [ ] **Step 3: Push and open PRs**

Open separate PRs:

- Agent VM branch: `ai-tools-observability-agent-vm`
- `shravan-claw-beta` branch: `ai-tools-observability-shravan-claw-beta`

Each PR description should state: common stack/query knowledge lives in `ai-tools`.
