# Skill Pressure Testing System Implementation Plan

Status: executable at S3; CP2 authentic ACPX pair proven

Source: `docs/specs/2026-07-10-skill-pressure-judge-system-spec.md`

Goal: hard-cut over the current flat self-grading runner to one ACPX-backed
Vitest Evals system that measures whether skills improve mini-model behavior
across repeated RED/GREEN pressure trials.

## Scope

- `tests/test-utils/skill-pressure/` for the standalone runner package.
- `tests/<plugin>/<skill>/` for all migrated scenario owners.
- `tests/skills/` only for migration input and final hard cutover.
- Exact plugin metadata, changelog, manifests, and docs required by the cutover.

Non-goals:

- generalized agent-host isolation;
- plugin-command, exec-policy-rule, or MCP poison testing;
- hostile-code or credential containment;
- a replacement evaluation framework;
- dual runners or compatibility reducers;
- unrelated skill rewrites;
- installed home-cache mutation without explicit authorization;
- PR merge.

## Current-State Correction

The untracked runner tree contains useful exploratory infrastructure mixed with
an overbuilt capability-gate design. Infrastructure unit tests are green, but no
real skill pressure scenario has yet produced RED/GREEN behavioral proof and no
legacy scenario has yet been migrated into the new owner layout.

The implementation must first separate useful runner mechanics from machinery
that does not measure skill performance.

Current implementation proof (2026-07-13):

- S0 pruning is complete: Gate 0, poison/capability receipts, owner-risk policy,
  direct-Codex execution, and the obsolete capability-probe directory are gone.
- ACPX execution, subject/review profiles, transcript facts, process cleanup,
  and structured review parsing now have retained owners.
- Scenario contracts and discovery now use the behavioral R3 fields and
  `tests/<plugin>/<skill>/scenarios/` owner paths without a separate manifest or
  behavior-source graph.
- Parent verification after S2 hardening: typecheck exit 0; 15 unit files and
  39 tests passed; one integration file and 9 tests passed; schema check exit 0;
  `git diff --check` exit 0.
- Live CP2 attempts reached ACPX, proved project installation and pair input
  construction, then failed on Codex transport/DNS. The first attempt exposed
  an exit-0 false-positive and the bounded retry correctly reduced to
  `infrastructure_error`; CP2 remains open.
- Fresh host checks on 2026-07-13 still fail DNS resolution for both
  `chatgpt.com` and `api.anthropic.com` (`curl` exit 6). No independent S2 work
  remains, and S3 must not begin before CP2 succeeds.
- After network recovery, live pair 5 completed two fresh ACPX Codex Luna/xhigh
  sessions with equal common inputs, distinct repositories and session IDs,
  treatment-only skill installation, meaningful usage, empty MCP, `end_turn`,
  no transport diagnostics, and complete process cleanup. CP2 is complete and
  implementation advances to S3.
- Behavioral RED/GREEN ACPX scenarios executed: 0. Migration remains 0/107.

## Keep And Simplify

Retain one clear owner for each required job:

| Job | Retained surface |
| --- | --- |
| Project skill installation | `lib/installation/` |
| ACPX process execution | `lib/runtime/` |
| Process-group timeout and cleanup | `lib/runtime/process-group-supervisor.ts` |
| ACPX event and visible-response collection | `lib/collector/` |
| Scenario contracts | `lib/contracts/` |
| Recursive owner discovery | `lib/discovery/` |
| Legacy ID accounting | `lib/migration/` |
| RED/GREEN repetitions and comparison | new `lib/evaluation/` |
| Deterministic file/tool/artifact checks | new `lib/evidence/` |
| Parent or blind review packets | new `lib/review/` |
| Final outcomes and reports | new `lib/reduction/` and `lib/reporting/` |
| Vitest Evals entrypoint | new `evals/skill-pressure.eval.ts` |

Simplification rules:

- one ACPX command executor, not provider-specific process wrappers;
- provider profiles contain only exact model, reasoning, permissions, cwd,
  prompt, skill install, and scenario-required MCP/tool configuration;
- receipts contain facts needed to compare RED and GREEN;
- no source or configuration digest unless it protects pair equality or proves
  the installed baseline/treatment source;
- no reviewer receives authoring discussion or expected conclusions;
- no subject receives grader criteria or self-grade fields.

## Delete Completely

Delete or remove from runner reachability:

- `lib/capability-probes/gate0-cli.ts`
- `lib/capability-probes/gate0-runner.ts`
- `lib/capability-probes/gate0-runner.test.ts`
- `lib/capability-probes/acpx-codex-attribution-probe.ts`
- `lib/capability-probes/acpx-codex-attribution-probe.test.ts`
- `lib/capability-probes/codex-prompt-input-inventory.ts`
- `lib/capability-probes/codex-prompt-input-inventory.test.ts`
- `lib/capability-probes/functional-capability-receipt.ts`
- `lib/capability-probes/functional-capability-receipt.test.ts`
- the five-class poison receipt and every plugin-command, `.rules`, MCP-poison,
  approved-command-inventory, and global Gate 0 concept;
- `config/owner-risk-inventory.yaml`
- `schemas/owner-risk-inventory.schema.json`
- owner-risk inventory tests and loading code;
- direct-Codex exploratory primary runner code that is not used by ACPX;
- duplicate provider-specific collectors or process runners after their useful
  parsing logic is folded into the shared ACPX collector;
- any schema or contract field used only by the removed capability system;
- plan/spec prose requiring all five behavior-source classes, broad source-graph
  security, or a capability gate before scenario execution.

Do not delete the ACPX subject/judge transcript parsers until their useful model,
effort, response, tool, usage, and structured-review parsing has been moved into
the retained collector/review modules.

## Execution DAG

```text
gate A: revised spec and plan accepted
  |
Sidekick deletion pass 1
  scope: fully dead files and mechanical owner-risk decoupling
  proof: named paths absent; typecheck and focused tests pass
  |
parent extraction and simplification
  scope: move useful ACPX behavior into retained owners
  proof: no retained import points into capability-probes
  |
Sidekick deletion pass 2
  scope: remaining obsolete capability-probe shell
  proof: capability-probes absent; typecheck and focused tests pass
  |
slice 1: RED/GREEN coordinator and five-repetition comparison
  |
slice 2: evidence checks, rationalizations, review, and reduction
  |
slice 3: Vitest Evals entrypoint and focused live behavior smoke
  |
slice 4: migrate 107 scenarios across 23 owners
  |
hard-cutover gate: exact 107-of-107 accounting
  |
delete old authoritative runner and legacy reducer
  |
full validation and implementation-review-swarm
  |
implementation-pr-wrapup; PR-ready and unmerged
```

## S0. Prune The Wrong Architecture

Source: spec Explicitly Removed Architecture.

### Sidekick deletion lane

The same persistent Sidekick receives two exact deletion packets and may not
redesign retained modules. The parent reviews every returned diff.

Pass 1 deletes these fully dead files:

```text
lib/capability-probes/gate0-cli.ts
lib/capability-probes/gate0-runner.ts
lib/capability-probes/gate0-runner.test.ts
lib/capability-probes/acpx-codex-attribution-probe.ts
lib/capability-probes/acpx-codex-attribution-probe.test.ts
lib/runtime/codex-primary-runner.ts
lib/runtime/codex-primary-runner.test.ts
config/owner-risk-inventory.yaml
schemas/owner-risk-inventory.schema.json
lib/contracts/owner-risk-inventory.test.ts
```

Pass 1 removes only direct references made invalid by those deletions:

- remove the `gate0` package script;
- remove owner-risk schema generation and schema-parity cases;
- remove `OwnerRiskInventory`, owner-risk loading, and owner-risk reconciliation;
- keep migration accounting based on the migration inventory and live legacy
  files, with the owner set derived from migration rows;
- remove imports, exports, fixtures, or tests whose only purpose was one of the
  deleted files.

The parent then moves the useful behavior into these exact retained owners:

```text
lib/runtime/acpx-command-executor.ts
lib/runtime/acpx-subject-profile.ts
lib/collector/acpx-transcript-collector.ts
lib/review/acpx-review-result.ts
```

The moved behavior is limited to ACPX execution, exact model/effort and skill
configuration, visible response/tool/usage collection, and structured review
parsing. Poison/source-class capability reduction is not moved.

Pass 2 deletes the entire remaining `lib/capability-probes/` directory only
after `rg` proves no retained import points into it. Until that gate, do not
delete or redesign these migration-source files:

```text
lib/capability-probes/acpx-command-executor.ts
lib/capability-probes/acpx-command-executor.test.ts
lib/capability-probes/acpx-codex-primary-profile.ts
lib/capability-probes/acpx-codex-primary-profile.test.ts
lib/capability-probes/acpx-codex-primary-probe.ts
lib/capability-probes/acpx-codex-primary-probe.test.ts
lib/capability-probes/acpx-codex-judge-profile.ts
lib/capability-probes/acpx-codex-judge-profile.test.ts
lib/capability-probes/acpx-codex-judge-probe.ts
lib/capability-probes/acpx-codex-judge-probe.test.ts
lib/capability-probes/acpx-claude-judge-profile.ts
lib/capability-probes/acpx-claude-judge-profile.test.ts
lib/capability-probes/acpx-claude-judge-probe.ts
lib/capability-probes/acpx-claude-judge-probe.test.ts
lib/capability-probes/probe-redaction.ts
```

Those files contain the useful behavior named above plus obsolete probe shells.
The parent moves only the useful behavior; the Sidekick removes the old files in
pass 2.

The Sidekick returns:

```text
deleted paths
direct import repairs
files intentionally left for parent migration
tests run and exit codes
concerns requiring parent decision
```

### Parent simplification lane

The parent:

1. Moves reusable ACPX command construction and transcript parsing out of
   `capability-probes/` into the four exact retained owners named above.
2. Consolidates process execution under `runtime/` and preserves process-group
   timeout/cleanup proof.
3. Reduces scenario contracts to behavioral fields from R3.
4. Removes owner-risk policy in favor of scenario `standard | high`.
5. Keeps discovery and migration only when they serve owner layout and exact
   accounting: 108 Markdown files in the legacy directory means 107 active
   scenarios plus the non-scenario `README.md`.

Checkpoint CP0: removed architecture is absent, retained modules have one job,
typecheck passes, and unit tests describe the behavioral runner rather than Gate
0 capabilities.

## S1. Scenario Contract And Discovery

Source: R1-R4 and R27.

1. Add RED contract tests for missing prompt/rubric, rubric leakage into subject
   input, repetitions below five, invalid baseline, invalid risk, duplicate
   global ID, and owner path mismatch.
2. Implement the smallest versioned scenario schema carrying the R3 fields.
3. Implement recursive deterministic discovery under `tests/`, excluding
   `test-utils` and the legacy input tree.
4. Preserve selected, skipped, invalid, and migration-accounting receipts.
5. Verify the legacy directory contains exactly 107 scenario fixtures across 23
   owners plus one excluded `README.md` before any scenario move.

Checkpoint CP1: fixture discovery and live legacy inventory are deterministic.

## S2. ACPX Subject Runtime And Minimal Isolation

Source: R5-R14 and R17.

1. Add RED integration tests for baseline/treatment install state, grader leakage,
   stale repository reuse, session reuse, model/reasoning mismatch, timeout, and
   descendant process cleanup.
2. Retain the repo-owned regular-file project installer and its digest receipt.
3. Build one shared ACPX executor using global `acpx`, with `pnpm dlx` then
   `npx --yes` only as fallback.
4. Implement Codex Luna/xhigh as the default subject profile and Claude Sonnet
   low/medium as optional Claude-specific coverage.
5. Create a fresh disposable Git repository and fresh ACPX `exec` call for every
   repetition.
6. Install only no skill, the accepted previous version, or the current target
   version according to the pair side.
7. Use neutral instructions, hidden grader criteria, and empty MCP unless the
   scenario explicitly declares MCP.
8. Preserve runner-owned timeout, TERM/KILL cleanup, drained streams, and cleanup
   receipt.

Checkpoint CP2: one no-skill and one treatment repetition return authentic ACPX
responses from equal inputs with only the skill source differing.

## S3. RED/GREEN Repetitions And Evidence

Source: R5-R9 and R15-R17.

1. Add RED tests for fewer than five executions, reused session IDs, unequal pair
   inputs, lucky one-off GREEN, missing RED failure/proof gap, and mixed outcomes.
2. Implement a pair fingerprint over scenario, prompt, fixture, model, reasoning,
   permissions, repetitions, runner version, baseline/treatment source mode, and
   immutable selected-source revision/content digests. Every repetition must
   match the selected source digest for its side.
3. Run at least five fresh RED and five fresh GREEN contexts.
4. Normalize visible response, tools, usage, process outcome, file changes,
   artifacts, and rationalization excerpts.
5. Implement deterministic checks for required/forbidden actions and artifacts.
6. Store only redacted bounded evidence and safe digests.

Checkpoint CP3: a fixture pair distinguishes consistent improvement from
variance, mixed results, and infrastructure failure.

## S4. Review And Reduction

Source: R18-R22.

1. Add RED tests proving rubric packets exclude authoring discussion, expected
   conclusions, and another reviewer's reasoning.
2. Implement the parent-review receipt shape for manually reviewed transcripts.
   It enumerates every RED and GREEN repetition ID and transcript digest; a
   partial acknowledgement is invalid.
3. Implement a fresh-context blind-review packet containing only scenario ID,
   hidden rubric, deterministic facts, and bounded RED/GREEN results.
4. Use ACPX for model reviewers. Standard automated runs may use a mini or
   balanced fresh reviewer. High-risk runs require Claude Opus/high.
5. Implement deterministic precedence and outcomes: pass, behavior_fail,
   inconclusive, infrastructure_error, not_evaluated.
6. Record rationalization, behavior risk, smallest wording change, and retest.

Checkpoint CP4: known pass, failure, variance, missing-evidence, and high-risk
review fixtures reduce correctly.

## S5. Vitest Evals Integration

Source: R23-R26.

1. Add the pinned `vitest-evals` dependency and one evaluator entrypoint.
2. Map each discovered scenario to one RED/GREEN evaluation case.
3. Keep grader criteria out of subject input and expose them only to review.
4. Implement `--fast`, `--scenario`, `--jobs`, and `--serial` selection.
5. Use bounded parallelism for independent scenarios/repetitions.
6. Persist per-scenario evidence and aggregate exact counts.
7. Keep the fake backend only for plumbing tests and label it non-behavioral.

Checkpoint CP5: one focused scenario executes end to end through Vitest Evals.

## S6. Scenario Migration And Hard Cutover

Source: R27-R29.

1. Generate and parent-review a 107-row immutable migration map.
2. Move scenarios into `tests/<plugin>/<skill>/` without changing their behavioral
   intent during the mechanical move.
3. Convert each scenario to the new behavioral schema, adding skill type,
   baseline, repetitions, hidden rubric, deterministic checks, and risk.
4. Verify global uniqueness, owner/path agreement, and exact 107-of-107 discovery.
5. Run representative discipline, technique, pattern, and reference scenarios.
6. Remove the old flat scenario directory, self-grade prompt, regex reducer,
   legacy shell authority, and duplicate package only after accounting passes.
7. Update `tests/skills/README.md` or replace it with the new runner contract and
   update every repo reference.

Checkpoint CP6: one authoritative runner discovers all 107 scenarios across 23
owners; old authority is absent.

## S7. Shipping Proof

1. Run package typecheck and all unit tests.
2. Run integration tests for Git fixtures, installation, processes, collection,
   evidence, review packets, and migration.
3. Run one live Luna/xhigh scenario with five RED and five GREEN repetitions.
4. Run one standard blind-review scenario.
5. Run one high-risk Claude Opus/high review scenario.
6. Run the full standard suite with exact accounting; record provider failures as
   infrastructure errors, never behavioral passes.
7. Update plugin version metadata, manifests, README, and changelog.
8. Route the complete diff through `implementation-review-swarm`; address or
   explicitly reject findings and rerun affected proof.
9. Use `implementation-pr-wrapup` to push/open/update the PR, monitor checks and
   comments, verify review threads and mergeability, and report readiness.
10. Do not merge.

## Requirements/Proof Matrix

| Requirement | Owner | Proof | Evidence source | Freshness guard |
| --- | --- | --- | --- | --- |
| R1-R4 scenario ownership and hidden rubric | S1 | unit schemas + live discovery | parent-run Vitest | tree and schema digest |
| R5-R9 authentic repeated RED/GREEN | S2-S3 | integration + live ACPX smoke | repetition and pair receipts | model/prompt/fixture/source fingerprint |
| R10-R14 minimal isolation | S2 | disposable repo integration | install and input receipt | repository and installed-file digest |
| R15-R17 evidence and cleanup | S2-S3 | collector unit + process integration | tool/file/artifact/process facts | event and fixture digest |
| R18-R22 parent/blind review and reduction | S4 | packet tests + calibrated result fixtures | review and reduction receipts | rubric/reviewer/result digest |
| R23-R26 Vitest Evals runner | S5 | focused end-to-end eval | Vitest result artifacts | evaluator/config digest |
| R27-R29 exact migration and cutover | S6 | 107-row accounting + absence checks | discovery/migration receipt | legacy/new tree digest |
| PR-ready unmerged delivery | S7 | checks, review, threads, mergeability | GitHub PR state | current head SHA |

## Validation Commands

The final package should expose these stable commands:

```bash
pnpm --dir tests/test-utils/skill-pressure typecheck
pnpm --dir tests/test-utils/skill-pressure test:unit
pnpm --dir tests/test-utils/skill-pressure test:integration
pnpm --dir tests/test-utils/skill-pressure test:behavior --scenario <id>
pnpm --dir tests/test-utils/skill-pressure test:standard
pnpm --dir tests/test-utils/skill-pressure test:high-risk
pnpm --dir tests/test-utils/skill-pressure test:migration
```

Every command reports exit code and exact executed/passed/failed/inconclusive/
infrastructure-error counts. Missing higher-layer proof prevents a completion
claim.

## Recovery And Stop Rules

- Use the two-pass pruning order above. The parent reviews every deletion and
  direct reference repair; pass 2 cannot start until retained imports no longer
  point into `capability-probes/`.
- Do not weaken or delete behavioral proof to make validation pass.
- Provider unavailability is `infrastructure_error`; continue independent local
  work and use bounded retries.
- Stop for user input only if the revised behavioral contract changes again,
  required provider access remains unavailable after bounded retries and no
  independent work remains, or a home-cache/history/destructive action requires
  authorization.
- Final terminal remains PR-ready and unmerged.
