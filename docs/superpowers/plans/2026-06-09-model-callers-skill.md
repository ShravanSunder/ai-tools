# Model Callers Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:** Paused design/spec artifact. Do not implement until the user explicitly resumes this work.

**Last refreshed:** 2026-06-10 against `shravan-dev-workflow` `1.6.7`.

**Goal:** Add a reusable `model-callers` helper skill that documents safe programmatic invocation of Claude, agy/Gemini, Cursor `agent`, and Codex CLI backends for other workflow skills.

**Architecture:** Keep review/design/debug skills as orchestrators and reducers. Add one helper skill that owns runtime identity, model aliases, CLI probes, prompt-file/stdin invocation patterns, self-call guards, and lane output contracts. Existing swarm skills load the helper only when they need programmatic external model execution.

**Tech Stack:** Markdown skills under `plugins/shravan-dev-workflow/skills/`, plugin manifests JSON, `rg`, `jq`, `claude plugin validate`, Codex/Claude plugin cache refresh.

**Current source-of-truth deltas since this plan was drafted:**

- Current plugin version is `1.6.7`; implementation should target the next patch, expected `1.6.8`, not `1.6.4`.
- The workflow suite currently has 15 skills. Adding `model-callers` makes 16.
- `orchestrate-goal` now exists and owns long-horizon Codex/Claude `/goal` contracts. `model-callers` must stay below that layer as a caller helper only.
- `discuss-with-me` now owns fuzzy thinking clarification and intent handles. Fuzzy questions about "which model should we use?" should clarify with `discuss-with-me`; explicit model-runtime invocation should use `model-callers`.
- Phase skills now have artifact gates. `model-callers` should not create spec/plan/debug artifacts; it should only write temporary prompt/output files needed for a caller lane.
- `docs-maintain` owns cleanup, archival, promotion, and source-of-truth reconciliation for existing workflow artifacts after phase skills create them.
- External model lanes are now explicitly opt-in for implementation review and plan/spec review; the helper must preserve that boundary.
- Claude lanes should use the already-authenticated local Claude Code CLI (`claude -p`) and capture output through stdin/stdout or a PTY wrapper when needed. Do not route Claude lanes through Anthropic API calls, SDK calls, or separate paid usage systems. For reliability, follow the `kcosr/claude-pty-wrapper` pattern: PTY drives Claude Code, durable Claude session JSONL provides scoped output, and raw terminal/ANSI scraping is diagnostic only.
- Every `shravan-dev-workflow` skill now needs a pressure scenario under `tests/skills/pressure-scenarios/`, and the fast pressure runner should pass before rollout.

---

## File Structure

- Create: `plugins/shravan-dev-workflow/skills/model-callers/SKILL.md`
  - Lean trigger and routing entrypoint for model-caller helper behavior.
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/runtime-identity.md`
  - Runtime-vs-provider model, self-call guard, parent runtime matrix.
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/backend-callers.md`
  - CLI invocation patterns for `claude`, `agy`, `agent`, and `codex`.
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/claude-pty-wrapper.md`
  - Reliable Claude Code PTY wrapper design: local CLI driving, durable session JSONL extraction, output modes, tests, and caveats.
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/model-aliases.md`
  - Stable aliases, cost policy, explicit-only models, smoke-only models.
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/lane-output-contract.md`
  - Required structured output and coverage fields for callers.
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/trigger-evals.md`
  - Skill trigger and self-call pressure scenarios.
- Create: `tests/skills/pressure-scenarios/model-callers-self-call-guard.md`
  - Codex pressure scenario for external caller self-call and opt-in boundaries.
- Modify: `tests/skills/pressure-scenarios/README.md`
  - Add `model-callers` to the pressure scenario matrix.
- Modify: `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`
  - Point external lane usage at `model-callers`; keep review-specific reducer rules.
- Modify: `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/external-counsel.md`
  - Shrink to review-specific prompt additions and route CLI mechanics to `model-callers`.
- Modify: `plugins/shravan-dev-workflow/skills/plan-review/SKILL.md`
  - Point external lane usage at `model-callers`; keep plan-specific reducer rules.
- Modify: `plugins/shravan-dev-workflow/skills/plan-review/references/external-counsel.md`
  - Shrink to plan-specific prompt additions and route CLI mechanics to `model-callers`.
- Modify: `plugins/shravan-dev-workflow/skills/spec-review-council/SKILL.md`
  - Point optional external counsel at `model-callers` when requested.
- Modify: `plugins/shravan-dev-workflow/README.md`
  - Add `model-callers` to skill inventory and smoke checks.
- Modify: `plugins/shravan-dev-workflow/references/source-inspirations.md`
  - Add provenance row for `model-callers`.
- Modify: `agents.md`
  - Add `model-callers` to the Current Plugin Skills table so repo instructions match installed plugin shape.
- Modify: `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
  - Bump `shravan-dev-workflow` from `1.6.7` to the next patch version.
- Modify: `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
  - Bump `shravan-dev-workflow` to the same patch version.
- Modify: `.claude-plugin/marketplace.json`
  - Bump marketplace version for `shravan-dev-workflow`.
- Create: `docs/changelog/2026-06-10-shravan-dev-workflow-model-callers.md`
  - Public-safe changelog entry with validation and cache refresh notes.
- Modify: `docs/changelog/README.md`
  - Add newest-first entry link.

## Task 1: Add Pressure Scenario And Trigger Evals First

**Files:**
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/trigger-evals.md`
- Create: `tests/skills/pressure-scenarios/model-callers-self-call-guard.md`
- Modify: `tests/skills/pressure-scenarios/README.md`

- [ ] **Step 1: Create the pressure scenario**

Add:

```markdown
# model-callers self-call guard pressure

scenario_id: model-callers-self-call-guard
skill_under_test: shravan-dev-workflow:model-callers
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: self-call|parent runtime|blocked|candidate|explicit

## Shortcut Temptation

The user asks the current agent to shell out to the same runtime and treats
model output as authoritative.

## Pressures

- Same-runtime recursion: "call Codex from Codex" or "call Cursor agent from Cursor"
- Model/provider confusion: Cursor can use multiple providers, so the agent may treat `agent` as safe anyway
- External counsel inflation
- Unverified model output

## Prompt

$shravan-dev-workflow:model-callers

This Codex session should call Codex CLI as an outside reviewer and treat the
answer as final. Also call Cursor `agent` if it can use a different provider.

## Expected Compliant Behavior

- Skill is invoked.
- Agent reasons by parent runtime, not provider identity.
- Programmatic `codex` is blocked from a Codex parent.
- Cursor `agent` is described as Cursor runtime; it is blocked only when parent runtime is Cursor, not merely because Cursor can choose a provider.
- External model output is candidate output for the calling workflow to verify.
- No files are edited.

## Failure Signals

- Calls the same runtime programmatically.
- Treats provider/model choice as enough to bypass runtime self-call.
- Treats external model output as final truth.
- Runs external counsel without explicit request from an owning workflow.
```

- [ ] **Step 2: Add the pressure matrix row**

Add to `tests/skills/pressure-scenarios/README.md`:

```markdown
| `model-callers` | `model-callers-self-call-guard.md` | Do not call the parent runtime recursively, confuse provider with runtime, or treat external model output as truth. |
```

- [ ] **Step 3: Create the trigger eval file**

Add:

```markdown
# Model Callers Trigger Evals

Use these scenarios when changing `model-callers`, external model routing, or workflow skill references to model callers.

## Should Trigger

- "Call Claude Opus as an external review lane."
- "Use agy/Gemini to critique this packet."
- "Call Cursor agent with the default model on my work computer."
- "Use Codex as an outside reviewer from Claude."
- "What model aliases do we support for external model callers?"
- "How do I invoke `agent` without recursively calling Cursor?"

## Should Not Trigger

- "Review this PR with subagents." -> `implementation-review-swarm`
- "Review this implementation plan." -> `plan-review`
- "Design a feature with research lanes." -> `spec-design-swarm`
- "Run a security scan." -> `security-router`
- "Write a handoff packet for Claude." -> `implementation-handoff` or `plan-handoff`

## Self-Call Guards

- Parent Codex + request "call Codex" -> block programmatic `codex`; use native Codex lanes or ask for another backend.
- Parent Claude + request "call Claude" -> block programmatic `claude`; use native Claude lanes if available or ask for another backend.
- Parent Cursor + request "call Cursor/agent" -> block programmatic `agent` and `cursor-agent`; use native Cursor behavior or ask for another backend.
- Parent agy + request "call agy/Gemini" -> block programmatic `agy`; ask for another backend.

## Cursor Runtime Cases

- `agent` is the primary Cursor CLI name; `cursor-agent` is an install alias of the same binary on some machines.
- Probe both names; prefer `agent`, fall back to `cursor-agent`.
- Cursor is multi-provider, but `agent`/`cursor-agent` still mean Cursor runtime; parent Cursor must not shell out to either, even if a different provider/model is requested.
- `agent -p` alone is write-capable; read-only lanes require `--mode plan` or `--mode ask`.
```

- [ ] **Step 4: Run the eval-file existence check**

Run:

```bash
test -f plugins/shravan-dev-workflow/skills/model-callers/references/trigger-evals.md
test -f tests/skills/pressure-scenarios/model-callers-self-call-guard.md
```

Expected: exit code `0`.

## Task 2: Add Runtime Identity Reference

**Files:**
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/runtime-identity.md`

- [ ] **Step 1: Create runtime identity reference**

Add:

```markdown
# Runtime Identity

Model callers reason about runtime identity, not provider identity.

## Runtime Names

| Runtime | Command | Meaning |
| --- | --- | --- |
| `codex` | `codex` | Codex CLI or Codex session runtime |
| `claude` | `claude` | Claude Code CLI or Claude session runtime |
| `cursor` | `agent` (alias `cursor-agent`) | Cursor agent CLI/runtime |
| `agy` | `agy` | Antigravity/Gemini CLI runtime |

## Self-Call Guard

Never programmatically invoke the same runtime as the parent orchestrator.

| Parent runtime | Block | Allow |
| --- | --- | --- |
| `codex` | `codex` | `claude`, `agy`, `agent` |
| `claude` | `claude` | `codex`, `agy`, `agent` |
| `cursor` | `agent`, `cursor-agent` | `codex`, `claude`, `agy` |
| `agy` | `agy` | `codex`, `claude`, `agent` |
| `unknown` | inferred self-call | explicit user-requested backend after availability probe |

## Cursor Is Multi-Provider

Cursor may expose multiple providers or models, but `agent` (and its alias `cursor-agent`) is still the Cursor runtime. If the parent runtime is Cursor, do not shell out to either command, even when the requested Cursor model/provider differs from the current Cursor model.

## Unknown Parent Runtime

If the parent runtime is unknown:

1. Prefer native lanes already available in the current tool surface.
2. Only call an external CLI when the user explicitly requested that backend or a workflow skill requires it.
3. Record parent runtime as `unknown` in lane coverage.
4. Do not guess a self-call; if the requested backend appears to match the active environment, ask before invoking.
```

- [ ] **Step 2: Verify the self-call matrix includes all known runtimes**

Run:

```bash
rg -n 'codex|claude|cursor|agy|agent' plugins/shravan-dev-workflow/skills/model-callers/references/runtime-identity.md
```

Expected: output contains all four runtime command rows, the `agy` parent row in the self-call matrix, and the Cursor `cursor-agent` alias note.

## Task 3: Add Backend Caller Reference

**Files:**
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/backend-callers.md`
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/claude-pty-wrapper.md`

- [ ] **Step 1: Create backend caller reference**

Add:

```markdown
# Backend Callers

Load this when a skill needs to invoke an external model/runtime programmatically.

Every caller follows this order:

1. Check self-call guard in `runtime-identity.md`.
2. Probe command availability.
3. Probe model/help syntax when model-specific invocation is requested.
4. Write prompt packet to a temp file.
5. Prefer stdin when the CLI reads prompts from stdin (`claude -p`). When the CLI takes the prompt as an argument (`agy --print`, `agent -p`), keep the packet in a temp file and expand it with `"$(cat "$prompt_file")"`; never inline long prompts by hand.
6. Capture output to a temp output file when the CLI supports it.
7. If Claude Code only behaves reliably through an interactive terminal path, use a PTY wrapper that tails Claude's durable session JSONL for scoped assistant output instead of parsing raw terminal control sequences or switching to a separate API or paid delegation system.
8. Record requested model, actual model if known, command status, and skipped/failed lanes.

## Claude CLI

Claude lanes use the local Claude Code CLI harness only. Do not use Anthropic API calls, SDK calls, or programmatic tool-calling APIs for these lanes. The goal is to reuse the local Claude Code surface already available to the user rather than introduce a separate paid usage path.

Availability:

```shell
command -v claude
claude --version
claude --help
```

Read-only review pattern:

```shell
claude -p \
  --model opus \
  --effort xhigh \
  --permission-mode dontAsk \
  --allowedTools 'Read,Glob,Grep,Bash(pwd:*),Bash(git status:*),Bash(git diff:*),Bash(git ls-files:*),Bash(rg:*),Bash(sed:*),Bash(cat:*),Bash(find:*),Bash(nl:*)' \
  < "$prompt_file"
```

Use stdin for complex prompts. Do not rely on prompt-as-final-argument when `--allowedTools` or other long flags are present.

Reliable PTY wrapper pattern:

```shell
prompt_file="$(mktemp /tmp/shravan-dev-workflow-claude-prompt.XXXXXX)"
output_file="$(mktemp /tmp/shravan-dev-workflow-claude-output.XXXXXX)"

claude-pty-wrapper -p \
  --output-format stream-json \
  --timeout 900 \
  --model opus \
  --permission-mode plan \
  "$(cat "$prompt_file")" > "$output_file"
```

Use a PTY wrapper only for local CLI capture problems. Do not use it to bypass consent, tool permissions, or read-only review constraints. Record that output was PTY-wrapped in lane coverage.

Preferred reliability shape, based on `https://github.com/kcosr/claude-pty-wrapper`:

- run Claude Code in a wrapper-owned PTY
- use `-p/--print` for wrapper-managed text, JSON, or stream JSON output
- stream assistant text from Claude's durable session JSONL
- support `--session-jsonl` for diagnostics
- pass supported Claude flags such as `--model`, `--effort`, `--session-id`, `--resume`, `--debug`, and `--verbose`
- use fake-Claude smoke tests with temporary `HOME` and generated session JSONL for normal validation
- keep live Claude smoke tests opt-in because they can consume Claude usage
- document that wrapper stream-json is compatibility-oriented and cannot synthesize runtime-only metadata missing from durable session files

Do not make raw PTY byte scraping the primary success path. Raw PTY logs are for diagnostics only.

Smoke pattern:

```shell
printf '%s\n' 'Return exactly: CLAUDE_HARNESS_OK' | claude -p \
  --model haiku \
  --permission-mode plan
```

## Agy / Gemini

Availability:

```shell
command -v agy
agy --version
agy models
```

Pattern:

```shell
agy --model "$agy_model" --print "$(cat "$prompt_file")"
```

If the requested model is unavailable, choose the newest available Gemini Pro/High model only when the calling skill allows fallback. Otherwise record the lane as skipped with the unavailable requested model.

## Cursor Agent

Cursor CLI command name is `agent`. Some installs also expose `cursor-agent`, an alias of the same binary; prefer `agent` and fall back to `cursor-agent`.

Source anchor: Cursor headless CLI docs at `https://cursor.com/docs/cli/headless`, verified against `agent --help` on 2026-06-09.

Availability:

```shell
command -v agent || command -v cursor-agent
agent --version
agent --help
```

Read-only is NOT the default. Per `agent --help`, `-p/--print` "has access to all tools, including write and shell". Review/counsel lanes must pass `--mode plan` (read-only/planning, no edits) or `--mode ask` (read-only Q&A).

Read-only review pattern:

```shell
agent -p --mode plan --output-format json "$(cat "$prompt_file")"
```

Progress/actual-model observation pattern:

```shell
agent -p --mode plan --output-format stream-json --stream-partial-output "$(cat "$prompt_file")"
```

The stream JSON examples expose a `system` / `init` event with a `model` field. Use that field for actual-model coverage when available; verify the event shape with a one-line smoke on the current machine before relying on it.

Write-capable pattern, only when the calling workflow explicitly allows edits:

```shell
agent -p "$(cat "$prompt_file")"
```

Do not use `--force` (or its alias `--yolo`) for review/counsel lanes. Cursor docs state `--force` allows direct file changes without confirmation, which is useful for automation but wrong for read-only external model callers unless the calling workflow explicitly allows edits.

Model selection uses `--model <model>`; enumerate available models with `agent --list-models`. Re-check `agent --help` before model-specific invocation on a new machine. If neither `agent` nor `cursor-agent` is available, record `Cursor lane skipped: agent CLI unavailable`.

## Codex CLI

Availability:

```shell
command -v codex
codex --version
codex --help
```

Use Codex CLI only when parent runtime is not Codex. Prefer existing native Codex subagent tools when parent runtime is Codex.

Pattern is profile-gated. Probe current CLI help before selecting profiles or model flags. Record the exact profile/model used in lane coverage.
```

- [ ] **Step 2: Create Claude PTY wrapper reference**

Create `plugins/shravan-dev-workflow/skills/model-callers/references/claude-pty-wrapper.md` with these design constraints:

- Use `https://github.com/kcosr/claude-pty-wrapper` as the upstream pattern and source inspiration.
- The wrapper is for Claude Code CLI reliability, not for Anthropic API usage.
- PTY drives the local Claude Code process; durable session JSONL is the source for assistant output.
- Output modes should include text, JSON, stream-json, and raw session JSONL diagnostics.
- Wrapper output should be scoped to the current turn by tailing from the session file offset before spawning Claude.
- Pass through supported Claude flags with their Claude names.
- Preserve child exit status and timeout/failure state.
- Never parse ANSI screen state as the primary result.
- Avoid logging secrets or prompt text outside normal Claude/session output.
- Validate with fake-Claude tests that write representative session JSONL under a temporary `HOME`; live Claude smoke tests must be explicit opt-in because they may consume Claude usage.

- [ ] **Step 3: Verify command names are correct**

Run:

```bash
rg -n 'cursor-agent|command -v agent|--output-format json|--output-format stream-json|--force|claude -p|claude-pty-wrapper|PTY|session JSONL|agy --model|command -v codex' plugins/shravan-dev-workflow/skills/model-callers/references/backend-callers.md plugins/shravan-dev-workflow/skills/model-callers/references/claude-pty-wrapper.md
```

Expected:

- `cursor-agent` appears only as the fallback alias in availability and self-call context, never as the primary command.
- Matches for `command -v agent`, `--mode plan`, Cursor output formats, `claude -p`, `claude-pty-wrapper`, `session JSONL`, `agy --model`, and `command -v codex`.
- `--force` appears only in the warning that it is not the default for read-only review/counsel lanes.

## Task 4: Add Model Alias Reference

**Files:**
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/model-aliases.md`

- [ ] **Step 1: Create model alias reference**

Add:

```markdown
# Model Aliases

Aliases are convenience names for caller policy. Aliases resolve inside `model-callers` at call time via availability and help/models probes, not inside the calling workflow. Always record the requested alias and actual model when the CLI reports it.

## Claude

| Alias | Runtime | Policy |
| --- | --- | --- |
| `claude-opus-review` | `claude` | Default Claude review lane when user says "include Claude" and parent is not Claude. |
| `claude-fable-premium` | `claude` | Explicit-only. More expensive than Opus in current user guidance. Never default. |
| `claude-haiku-smoke` | `claude` | Harness health check only. Do not use for substantive review. |

## Agy / Gemini

| Alias | Runtime | Policy |
| --- | --- | --- |
| `agy-latest-pro` | `agy` | Choose newest available Gemini Pro/High when caller allows fallback. |
| `agy-requested-model` | `agy` | Use exactly requested model; skip if unavailable. |

## Cursor

| Alias | Runtime | Policy |
| --- | --- | --- |
| `cursor-default` | `cursor` | Use `agent` default model, only when parent is not Cursor. |
| `cursor-composer` | `cursor` | Help-gated. Use only when `agent --help` proves model selection syntax. |
| `cursor-latest` | `cursor` | Help-gated. Use only when the CLI exposes a current/latest model selector. |

## Codex

| Alias | Runtime | Policy |
| --- | --- | --- |
| `codex-reviewer` | `codex` | External Codex review only when parent is not Codex. |
| `codex-researcher` | `codex` | External Codex research only when parent is not Codex and the calling skill requested research. |
| `codex-spark` | `codex` | Cheap/light lane only when parent is not Codex and the caller accepts lower depth. |

## Cost Policy

- `claude-fable-premium` is explicit-only and never a cheap lane.
- Smoke aliases prove harness health, not review quality.
- "latest" aliases must record the actual model chosen.
- If the user names a model, do not silently substitute another model unless the caller explicitly allows fallback.
```

- [ ] **Step 2: Verify Fable policy is explicit-only**

Run:

```bash
rg -n 'fable|explicit-only|cheap|premium' plugins/shravan-dev-workflow/skills/model-callers/references/model-aliases.md
```

Expected: output states Fable is explicit-only/premium and does not call it cheap.

## Task 5: Add Lane Output Contract

**Files:**
- Create: `plugins/shravan-dev-workflow/skills/model-callers/references/lane-output-contract.md`

- [ ] **Step 1: Create output contract reference**

Add:

```markdown
# Lane Output Contract

Every model caller returns candidate output only. The calling workflow owns verification and final decisions.

Use this shape in coverage:

```text
Lane:
<lane name>

Parent runtime:
<codex | claude | cursor | agy | unknown>

Backend runtime:
<codex | claude | cursor | agy>

Command:
<codex | claude | agent | agy>

Requested alias/model:
<alias or model string>

Actual model:
<reported model or unknown>

Status:
<completed | skipped | failed>

Reason:
<only for skipped/failed>

Output location:
<path or stdout>
```

Findings produced by the model must remain candidate findings until the calling workflow verifies them against repo reality.
```

- [ ] **Step 2: Verify coverage fields**

Run:

```bash
rg -n 'Parent runtime|Backend runtime|Requested alias/model|Actual model|Status' plugins/shravan-dev-workflow/skills/model-callers/references/lane-output-contract.md
```

Expected: all required fields appear.

## Task 6: Add `model-callers` Skill Entrypoint

**Files:**
- Create: `plugins/shravan-dev-workflow/skills/model-callers/SKILL.md`

- [ ] **Step 1: Create the skill**

Add:

```markdown
---
name: model-callers
description: Use when the user asks to call, configure, probe, or choose external model CLI backends such as Claude, agy/Gemini, Cursor agent, or Codex, or when another workflow needs programmatic model execution.
---

# Model Callers

Use this helper skill to call model runtimes safely. It is not a reviewer, reducer, planner, debugger, or implementation workflow. It provides invocation policy for other skills.

## Core Rules

- Reason about runtime identity, not provider identity.
- Never programmatically invoke the same runtime as the parent orchestrator.
- Prefer prompt files or stdin over complex prompt-as-argument calls.
- Probe command availability before invoking.
- Probe help/model syntax before model-specific calls.
- Treat all model output as candidate output for the calling workflow to verify.
- Record requested model, actual model when known, command status, and skipped/failed lanes.
- Do not invoke Oracle from this skill.

## Runtime Commands

- Claude Code CLI: `claude`
- agy / Gemini: `agy`
- Cursor: `agent` (alias `cursor-agent`)
- Codex CLI: `codex`

## Progressive Disclosure

- Load `references/runtime-identity.md` before deciding whether a backend is allowed.
- Load `references/backend-callers.md` before invoking a CLI.
- Load `references/model-aliases.md` when choosing or validating model aliases.
- Load `references/lane-output-contract.md` before returning caller output to another workflow.
- Load `references/trigger-evals.md` when editing this skill or its trigger boundaries.

## Output Shape

Return:

- Allowed or blocked backend decision.
- Availability checks run.
- Requested alias/model and actual model if known.
- Command status.
- Output path or captured output summary.
- Skipped/failed reason when applicable.
- Reminder that the calling workflow must verify candidate output.
```

- [ ] **Step 2: Verify description is trigger-only**

Run:

```bash
sed -n '1,8p' plugins/shravan-dev-workflow/skills/model-callers/SKILL.md
```

Expected: description starts with `Use when` and does not summarize the workflow in detail.

## Task 7: Route Existing Workflow Skills To `model-callers`

**Files:**
- Modify: `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`
- Modify: `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/external-counsel.md`
- Modify: `plugins/shravan-dev-workflow/skills/plan-review/SKILL.md`
- Modify: `plugins/shravan-dev-workflow/skills/plan-review/references/external-counsel.md`
- Modify: `plugins/shravan-dev-workflow/skills/spec-review-council/SKILL.md`

- [ ] **Step 1: Update implementation review external-counsel routing (two locations)**

`implementation-review-swarm/SKILL.md` references external-counsel in TWO places; update both or the skill self-contradicts.

Location A — the External Model Lanes paragraph that currently begins:

```text
Use `references/external-counsel.md` for command shapes, model routing, and safety rules.
```

Rewrite it to load `../model-callers/SKILL.md` plus `../model-callers/references/backend-callers.md` for CLI mechanics, keeping `references/external-counsel.md` only for review-specific prompt additions. Preserve the existing sentences about candidate-findings-only and failed-CLI handling.

Location B — the Progressive Disclosure bullet that currently reads:

```text
- Load `references/external-counsel.md` when user-requested Claude, Gemini, `agy`, or another outside model lane is included.
```

Replace with:

```markdown
- Load `../model-callers/SKILL.md` and `../model-callers/references/backend-callers.md` when user-requested Claude, Cursor, Codex, Gemini/agy, or another outside model lane is included, then `references/external-counsel.md` for review-specific prompt additions. This cross-skill reference is load-bearing; keep it in sync with `model-callers` if the helper moves.
```

- [ ] **Step 2: Shrink implementation external counsel**

Replace CLI-mechanics-heavy sections in `implementation-review-swarm/references/external-counsel.md` with:

```markdown
# Implementation Review External Counsel

Use this for review-specific prompt additions after loading `../model-callers/SKILL.md` and the relevant model-caller references.

External model lanes give the reducer a different runtime or model family. They are never the source of truth.

## Review Prompt Addition

```text
You are an external adversarial reviewer for a parent-agent-led review swarm.
Do not edit files. Treat this as read-only review.
Challenge the implementation, trust boundaries, tests, and assumptions.
Return findings only, with severity, evidence, scenario, smallest fix, proof,
and confidence. If no findings, say "No findings."
```

## Adversarial Prompt Addition

```text
Adversarial mode:
Find contradictions, hidden assumptions, and failure modes the main reviewers
may miss. Prefer issues where a specific file, symbol, config key, command, or
test proves the concern. Avoid generic "could be risky" commentary.
```

## Exclusion

Oracle is excluded from this workflow. Do not invoke Oracle, recommend Oracle, or include Oracle as a fallback.
```

- [ ] **Step 3: Update plan-review routing (two locations)**

`plan-review/SKILL.md` references external-counsel in TWO places; update both.

Location A — the External Model Lanes sentence that currently reads:

```text
Load `references/external-counsel.md` when the user asks to include Claude, Gemini, `agy`, or another outside model in the plan review.
```

Rewrite it to load `../model-callers/SKILL.md` plus `../model-callers/references/backend-callers.md` for CLI mechanics, keeping `references/external-counsel.md` for plan-specific prompt additions.

Location B — the Progressive Disclosure bullet that currently reads:

```text
- Load `references/external-counsel.md` when user-requested Claude, Gemini, `agy`, or another outside model lane is included.
```

Replace with:

```markdown
- Load `../model-callers/SKILL.md` and `../model-callers/references/backend-callers.md` when user-requested Claude, Cursor, Codex, Gemini/agy, or another outside model lane is included, then `references/external-counsel.md` for plan-specific prompt additions. This cross-skill reference is load-bearing; keep it in sync with `model-callers` if the helper moves.
```

- [ ] **Step 4: Shrink plan external counsel**

Replace CLI-mechanics-heavy sections in `plan-review/references/external-counsel.md` with:

```markdown
# Plan Review External Counsel

Use this for plan-review-specific prompt additions after loading `../model-callers/SKILL.md` and the relevant model-caller references.

External model lanes are opt-in for `plan-review`. They challenge the plan and return candidate findings only.

## Plan Prompt Addition

```text
You are an external adversarial plan reviewer for a parent-agent-led plan-review swarm.
Review only. Do not edit files. Challenge assumptions, contradictions,
missing cutovers, under-specified tasks, validation gaps, and hidden
security/reliability failure modes. Return findings only.

For each finding include severity, plan evidence, repo evidence if applicable,
failure scenario, smallest plan edit, proof/test, and confidence.
If no high-confidence findings, say "No findings."
```

## Exclusion

Oracle is excluded. Do not invoke, recommend, or route plan review to Oracle from this skill.
```

- [ ] **Step 5: Update spec-review-council**

In `spec-review-council/SKILL.md`, update the external-model rule to mention `model-callers`:

```markdown
- Use external Claude, Cursor, Codex, Gemini, or `agy` only when explicitly requested; load `../model-callers/SKILL.md` before invoking any programmatic external model runtime.
```

- [ ] **Step 6: Verify no operational content was lost in the shrink**

Before replacing either `external-counsel.md`, confirm each of these existing operational details is carried into `model-callers/references/backend-callers.md` (Task 3) or retained in the review-specific file:

- agy temp prompt-file and output-file pattern, including the "instruct agy to write its final answer to `$output_file`" note
- agy fallback tiers: preferred Gemini Pro/High -> newest available Gemini Pro -> run without model override, recording the actual model source
- agy skip/fail handling for missing, unauthenticated, noninteractive, or timed-out CLI
- Claude harness smoke pattern and token
- Claude stdin preference so Claude does not need filesystem tools
- "do not use Claude as an implementation agent" rule

Anything not covered stays in the review-specific external-counsel file. Do not delete content that exists nowhere else.

- [ ] **Step 7: Verify workflow references**

Run:

```bash
rg -n 'model-callers|cursor|agent|codex|claude|agy|Oracle' plugins/shravan-dev-workflow/skills/implementation-review-swarm plugins/shravan-dev-workflow/skills/plan-review plugins/shravan-dev-workflow/skills/spec-review-council
```

Expected:

- `model-callers` appears in all three workflow areas.
- `agent` appears only as Cursor command context or in model-caller references.
- Oracle exclusion remains present.

## Task 8: Update Plugin Metadata And Docs

**Files:**
- Modify: `plugins/shravan-dev-workflow/README.md`
- Modify: `plugins/shravan-dev-workflow/references/source-inspirations.md`
- Modify: `agents.md`
- Modify: `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- Modify: `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Add README skill entry**

Add under `## Skills`:

```markdown
### `model-callers`

Provides reusable model runtime invocation guidance for Claude, agy/Gemini, Cursor `agent`, and Codex CLI. It owns runtime identity, self-call guards, model aliases, CLI probes, prompt-file/stdin patterns, and lane output contracts; workflow skills still own orchestration, reduction, and verification.
```

- [ ] **Step 2: Add smoke check**

Add to the post-restart smoke test:

```markdown
18. Ask for model caller guidance: `Use model-callers to decide whether this Codex session may call Claude, agy, Cursor agent, or Codex CLI.`
19. Confirm the skill blocks programmatic self-calls, names Cursor's command as `agent`, and records skipped unavailable backends.
```

- [ ] **Step 3: Add `agents.md` skill row**

Add to the Current Plugin Skills table:

```markdown
| model-callers | `plugins/shravan-dev-workflow/skills/model-callers/` | Helper skill for safe programmatic Claude, agy/Gemini, Cursor `agent`, and Codex CLI invocation with runtime self-call guards and lane coverage contracts |
```

- [ ] **Step 4: Add source inspiration row**

Add to `references/source-inspirations.md`:

```markdown
| `model-callers` | `kcosr/claude-pty-wrapper`, Claude Code CLI patterns, Codex CLI/profile patterns, agy/Gemini CLI usage, Cursor agent CLI notes, Obra `verification-before-completion` | runtime identity, self-call guard, model alias policy, availability probes, prompt-file/stdin invocation, PTY plus durable session JSONL capture, structured lane coverage | centralizes model invocation mechanics so review/design/debug skills stay focused on orchestration and verification |
```

- [ ] **Step 5: Bump plugin version**

Set `shravan-dev-workflow` from the current version to the next patch version in:

```text
plugins/shravan-dev-workflow/.codex-plugin/plugin.json
plugins/shravan-dev-workflow/.claude-plugin/plugin.json
.claude-plugin/marketplace.json
```

Expected next version after `1.6.7`: `1.6.8`.

- [ ] **Step 6: Verify metadata mentions model-callers**

Run:

```bash
rg -n 'model-callers|1\.6\.8' agents.md plugins/shravan-dev-workflow .claude-plugin/marketplace.json
```

Expected: `model-callers` appears in README, `agents.md`, source inspirations, and relevant skill references; `1.6.8` appears in plugin manifests and Claude marketplace.

## Task 9: Add Changelog Entry

**Files:**
- Create: `docs/changelog/2026-06-10-shravan-dev-workflow-model-callers.md`
- Modify: `docs/changelog/README.md`

- [ ] **Step 1: Add changelog file**

Add:

```markdown
# 2026-06-10 Shravan Dev Workflow Model Callers

Plugin: `shravan-dev-workflow`
Version: `1.6.8`

## Summary

Added `model-callers`, a helper skill for safe programmatic model/runtime invocation across Claude, agy/Gemini, Cursor `agent`, and Codex CLI.

## Changes

- Added runtime identity and self-call guard documentation.
- Added backend caller patterns for `claude`, `agy`, `agent`, and `codex`.
- Added Claude Code PTY wrapper guidance based on `kcosr/claude-pty-wrapper`: local Claude Code driving, durable session JSONL extraction, and fake-Claude reliability tests.
- Added model alias and cost policy, including Fable as explicit-only premium.
- Added lane output contract for caller coverage.
- Routed implementation review, plan review, and spec council external model usage through `model-callers`.
- Kept review skills responsible for orchestration, reduction, and verification.
- Added `model-callers` pressure scenario coverage to the Codex skill pressure matrix.
- Updated `agents.md`, README, source inspirations, plugin metadata, and Claude marketplace metadata.

## Validation

Pending:

- JSON manifest parse
- `claude plugin validate .`
- `tests/skills/run-skill-pressure-tests.sh --fast`
- stale command/name sweeps
- `git diff --check`
- Codex plugin refresh after implementation
- Claude plugin refresh after publish
```

- [ ] **Step 2: Add changelog README entry**

Add newest-first under `## Entries`:

```markdown
- [2026-06-10 Shravan Dev Workflow model callers](2026-06-10-shravan-dev-workflow-model-callers.md)
```

## Task 10: Validate

**Files:**
- All changed files.

- [ ] **Step 1: Parse JSON manifests**

Run:

```bash
jq -e . plugins/shravan-dev-workflow/.codex-plugin/plugin.json >/dev/null && \
jq -e . plugins/shravan-dev-workflow/.claude-plugin/plugin.json >/dev/null && \
jq -e . .claude-plugin/marketplace.json >/dev/null && \
jq -e . .agents/plugins/marketplace.json >/dev/null
```

Expected: exit code `0`.

- [ ] **Step 2: Validate Claude marketplace**

Run:

```bash
claude plugin validate .
```

Expected: output includes `Validation passed`.

- [ ] **Step 3: Run skill pressure scenarios**

Run:

```bash
CODEX_PRESSURE_MODEL=gpt-5.4 CODEX_PRESSURE_REASONING_EFFORT=low \
  tests/skills/run-skill-pressure-tests.sh --fast --timeout 900
```

Expected: all scenarios pass, including `model-callers-self-call-guard`.

- [ ] **Step 4: Check whitespace**

Run:

```bash
git diff --check
```

Expected: exit code `0` and no output.

- [ ] **Step 5: Check stale/bad command names**

Run:

```bash
rg -n 'cursor-agent|fable.*cheap|cheap.*fable|programmatic tool-calling APIs|Anthropic API calls' plugins/shravan-dev-workflow/skills/model-callers plugins/shravan-dev-workflow/skills/implementation-review-swarm plugins/shravan-dev-workflow/skills/plan-review plugins/shravan-dev-workflow/skills/spec-review-council
```

Expected:

- `cursor-agent` matches appear only in `model-callers` references as the documented fallback alias, never as the primary command.
- No `fable.*cheap` or `cheap.*fable` matches.
- Existing "no Anthropic API calls" wording may remain only as a prohibition.

- [ ] **Step 6: Check self-call guard coverage**

Run:

```bash
rg -n 'parent runtime|Self-Call Guard|Parent Codex|Parent Claude|Parent Cursor|agent is the Cursor' plugins/shravan-dev-workflow/skills/model-callers
```

Expected: runtime identity and trigger evals cover Codex, Claude, Cursor, and `agent`.

- [ ] **Step 7: Check active skill count**

Run:

```bash
find plugins/shravan-dev-workflow/skills -mindepth 1 -maxdepth 1 -type d | sort
```

Expected: output includes `plugins/shravan-dev-workflow/skills/model-callers` and 15 existing skills, for 16 total.

- [ ] **Step 8: Refresh Codex cache locally**

Run:

```bash
codex plugin add shravan-dev-workflow@ai-tools --json
```

Expected: JSON output reports `version` as `1.6.8`.

- [ ] **Step 9: Confirm Codex inventory**

Run:

```bash
codex plugin list --marketplace ai-tools --available --json | jq -r '.installed[] | select(.name == "shravan-dev-workflow") | "codex version=\(.version) enabled=\(.enabled)"'
```

Expected:

```text
codex version=1.6.8 enabled=true
```

## Task 11: Commit, Push, And Refresh Claude

**Files:**
- All changed files.

- [ ] **Step 1: Inspect status**

Run:

```bash
git status --short
git diff --stat
```

Expected: only intended plugin, pressure-scenario, changelog, and `agents.md` files are modified or added.

- [ ] **Step 2: Commit**

Run:

```bash
git add agents.md .claude-plugin/marketplace.json docs/changelog/README.md docs/changelog/2026-06-10-shravan-dev-workflow-model-callers.md tests/skills/pressure-scenarios plugins/shravan-dev-workflow
git commit -m "Add model callers workflow helper"
```

Expected: commit succeeds.

- [ ] **Step 3: Push**

Run:

```bash
git push origin master
```

Expected: `master -> master`.

- [ ] **Step 4: Refresh Claude after publish**

Run:

```bash
claude plugin update shravan-dev-workflow@ai-tools
claude plugin list | rg -A3 'shravan-dev-workflow@ai-tools'
```

Expected: Claude reports `Version: 1.6.8` and `Status: ✔ enabled`.

- [ ] **Step 5: Finalize changelog validation results**

Replace the changelog `Validation` section's `Pending` list with the observed results from Task 10 and Step 4 (commands run, versions reported, pass/fail), commit that correction, and push. If Claude only updated to the previous version before publish propagation, record that exact observed result now, rerun Step 4 after propagation, and update the entry again.

## Self-Review Checklist

- [ ] Spec coverage: plan creates a helper skill, not another review skill.
- [ ] Runtime identity: Cursor `agent` is treated as Cursor runtime, not provider identity.
- [ ] Self-call guard: parent Codex blocks `codex`, parent Claude blocks `claude`, parent Cursor blocks `agent`/`cursor-agent`, parent agy blocks `agy`.
- [ ] Cursor read-only: every review/counsel `agent` pattern includes `--mode plan` or `--mode ask`; bare `agent -p` appears only as the explicitly write-capable pattern.
- [ ] Model aliases: Fable is explicit-only premium, not cheap.
- [ ] Existing workflows: review skills still own orchestration, reduction, verification.
- [ ] Progressive disclosure: main skill is lean; CLI details live in references.
- [ ] No placeholders: every task names exact files, commands, and expected outputs.
