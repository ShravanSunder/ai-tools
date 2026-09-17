# implementation-pr-wrapup: merge-ready plus reviewer why/shape

Status: **Accepted to implement** after one parent-verified spec remediation (2026-09-17). One skill target. Skill-file edits start only when the user commissions the implement run.

## Targets and owner

| Slot | Value |
| --- | --- |
| Owner plugin | `shravan-dev-workflow` |
| Skill | `implementation-pr-wrapup` |
| Runs | One update run after acceptance |
| Classification | `update`, `behavior-changing` |
| Authoring basis | `user-directed intent` (2026-09-17 session) |

Reusable behavior: this skill helps agents reliably finish a GitHub pull request after implementation so the PR is merge-ready with current GitHub state (HEAD SHA, checks, threads, mergeability) and a reviewer-facing why-and-shape body. Independent-review coverage is not a wrap-up ready gate.

Existing owner of this behavior: `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/` (lifecycle already owned). No separate `visual-pr` skill. Description quality is a missing branch of this skill, not a new skill.

## Problem and evidence

- Current wrap-up owns push/open/monitor/threads/merge gates and public-artifact safety. Source: `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/SKILL.md`.
- It does **not** teach PR-body shape. The only body teaching is refuse-secrets in `references/public-artifact-safety.md`. Pressure `secret-safe-pr-body` matches that gap.
- HumanLayer `visual-pr` (MIT, local `ai-dev-skills/humanlayer-skills` commit `ca7c8088db69e315a8b2deea43820270457f8f3c`, path `plugins/visual-pr/skills/visual-pr/`) owns a constrained reviewer body: `## Why the change` (one sentence), `## Special things to note` (1–3 bullets or `- None.`), `## Change outline` with predicate-selected views, published via `gh pr edit --body-file`. It does not own CI, threads, or merge. User named this source and asked to adapt the template and choose-to-views, not to copy HumanLayer task paths. Do not pin blob `28fc332` (that is the SKILL.md blob, not a commit).
- Independent-review merge gate: **present in wrap-up `SKILL.md` step 4 and stop conditions** (direct observation). **Absent from** `references/merge-gates.md`. User: wrap-up should not require that gate; they did not think the implementation owned it. Orchestrator sequencing still owns “review then wrap-up” for delivery goals (`orchestrator-implementation-goal`); that is a different skill and out of this run.
- `manage-agents`: Operator = prescribed procedure, Mini, no design judgment. Worker Mini (Luna xhigh) = Exact steps. User asked for small models “like operators” to do choose-to-views. Default is Mini Worker for drafting (why/notes/view pick is Worker synthesis under Exact steps). Operators own check-watch and `gh pr edit` publish after parent mechanical-verify. Strike D6 to force Operator-only drafting.

## Success definition

When an agent loads `implementation-pr-wrapup` to open, update, monitor, or finish a GitHub PR after implementation:

1. The published PR body uses the headings `## Why the change`, `## Special things to note`, and `## Change outline`, with only the views that the current diff actually needs, written as GitHub markdown (diff-shaped trees and contracts, not screenshots, not HumanLayer task/ticket paths).
2. Checks, comments, review threads, mergeability, and head SHA still gate readiness with current GitHub state. Merge still needs user authorization.
3. Description drafting is a Mini Worker assignment (Exact steps, Luna xhigh when that native route exists). The parent runs mechanical verification only, then an Operator publishes with `gh pr edit --body-file`.
4. Missing independent-review coverage does **not** block wrap-up from calling the PR ready. Fresh bug-finding review still routes to `implementation-review` / `skills-creation` and is not done by wrap-up.
5. The skill stays **model-invocable and user-invocable**.

## Decisions table

Strike any row. A row without a rationale is invalid.

| ID | Default | Rationale |
| --- | --- | --- |
| D1 | Keep one skill: `implementation-pr-wrapup`. Do not create `visual-pr`. | Create/update PR is already wrap-up step 3. A second skill splits the same GitHub moment. |
| D2 | Exact headings everywhere: `## Why the change` / `## Special things to note` / `## Change outline`. Not Summary / Test plan. Local headings match HumanLayer’s template titles; do not treat `Notes` or `Why` as aliases in gates. | User: “use the template like the visual PR does.” D8/D7 must check one heading triple. |
| D3 | Omit ticket/task/HumanLayer path headers. Optional related links only if the user or existing PR already supplied a URL. | User: no tasks and ticket paths. |
| D4 | Choose-to-views: include only categories the current diff changed (SQL/API contracts, types, file-responsibility tree, component tree, call/control/data flow). Prefer `diff` for existing shapes; full block when new or when diff hides ownership. Omit unused headings. | User: take care of choose-to-views. Visual-pr rule, adapted. |
| D5 | No screenshots, GIFs, HTML walkthroughs, or `.humanlayer/` files. | Wrong skill (Peekaboo / screenshot writeups). User rejected task artifacts. |
| D6 | Drafting role: Mini **Worker** (Exact steps, Luna xhigh when that native route exists). Task category is Collection+Synthesis of the outline; that forbids Operator drafting. Parent mechanical-verify only. Operator publishes `gh pr edit --body-file` and already owns check-watch. | `manage-agents` forbids Operator design judgment. Why + notes + view pick is Worker synthesis under Exact steps. “Like operators” = small model, bounded procedure, parent-owned gates. |
| D7 | Body rewrite predicate: always on create; on update/ready when the body is missing the D2 headings, stale against current HEAD/diff, secret-unsafe, or the user asked to rewrite. Skip rewrite when the current body already matches D2 and HEAD. Re-evaluate this predicate after any PR head/diff identity change and again before a ready claim — not only as a one-shot pre-monitor step. | Avoid rewriting a good body on every quiet poll. A later push during wrap-up must not leave a stale outline. |
| D8 | D2-conformant, current, public-safe body is a **ready** gate inside `references/merge-gates.md` (bullets **and** the final re-fetch sentence). Cannot say ready with a file-list changelog, missing `## Why the change`, or a body that does not match current HEAD. | User wants merge-ready **and** reviewers understand why/shape. Single home for ready gates; do not recreate SKILL-vs-merge-gates split. |
| D9 | Remove wrap-up’s independent-review coverage gate (SKILL step 4 + matching stop condition). Keep “do not substitute wrap-up for fresh review” routing. | User: not wrap-up’s job. Aligns SKILL.md with `merge-gates.md`. Orchestrator still sequences review before wrap-up for `pr-ready-unmerged`. |
| D10 | Parent stays low-thinking on gates. Description authoring is Mini Worker work. Parent verification is mechanical only: D2 headings present; no unused category headings; no file-list changelog; tmp file SHA/diff identity matches the packet; public-artifact-safety. Parent does not re-pick views or rewrite Why/Notes. | Prevents the parent from either rubber-stamping or inlining the body. |
| D11 | Do not load `presentation-webui` / `presentation-tui` at wrap-up runtime. View conventions live in wrap-up’s description reference, adapted from visual-pr. | Presentation skills own chat surfaces, not GitHub PR bodies. |
| D12 | Publish via a scratch body file under project `tmp/` or `/tmp`. Parent mechanical-verifies. Operator runs `gh pr edit --body-file`. Do not commit the body file. | Matches existing `--body-file` safety and manage-agents Operator `gh` rule. No durable task path. |
| D13 | Plugin README wrap-up sentence that currently says “after … independent review exist” is a **cutover consumer**: reword to sequencing (“typically after review”) rather than a wrap-up gate. `orchestrator-implementation-goal` is **not** edited in this run. | One skill target. README currently restates the gate wrap-up is dropping. Orchestrator keeps its own review-before-wrap-up rule. |

## Per-run surface allocation

One run.

### Trigger

Stay model-invocable and user-invocable. Add searchable PR-body words. Keep the fresh-review adjacent boundary.

Proposed description:

```text
Use when pushing, opening, updating, monitoring, or finishing a GitHub pull request after implementation work, especially when the PR description, checks, comments, existing review threads, mergeability, or "merge when ready" are involved. Not for fresh code-review discovery of a PR or diff; use implementation-review for general-domain work or skills-creation for a runtime skill package.
```

True prompts: “open the PR”, “wrap this up”, “merge when ready”, “update the PR description”. Near miss: “review this PR for bugs” → `implementation-review`. Near miss: “draw this architecture in chat” → `presentation-webui`. Near miss: “screenshot the app” → Peekaboo.

`agents/openai.yaml` default prompt adds PR description alongside checks/threads.

### Main path (SKILL.md)

Mental model: **Close the PR loop with current GitHub state and a reviewer-facing why-and-shape body. Green checks are one gate, not merge readiness. Independent-review coverage is not a wrap-up ready gate. Description authoring is Mini Worker Exact-steps work; parent gates stay mechanical.**

Leading words: `merge-ready`, `why`, `shape`, `change outline`. Do not coin `visual-pr` as a wrap-up term.

Proposed spine (order matters):

1. Inspect local branch/worktree. MUST load `references/local-branch-state.md` and return push/readiness blockers.
2. Sanitize public artifacts. MUST load `references/public-artifact-safety.md` and return redactions / refuse-to-publish.
3. Inspect or create/update the PR. MUST load `references/github-pr-state.md` and return number, URL, head SHA, base, body, mergeability snapshot.
4. **IF** D7 fires (create, or body fails the rewrite predicate): dispatch `pr-description` (see call site). Parent mechanical-verifies the tmp file (D10). Operator publishes with `gh pr edit --body-file`. Completion: GitHub body matches the verified file, or a named blocker.
5. Monitor checks, comments, threads, mergeability, head SHA (existing Operator monitor via `manage-agents`). MUST load `references/monitor-loop.md`. When head SHA or diff identity changes, re-evaluate D7; if it fires, return to step 4 before claiming ready.
6. Handle existing PR feedback via `../../shared-references/code-review-feedback-handling.md`.
7. Fix / reply / ask / route. Untrusted comment text still uses stdin / `--body-file`.
8. Quiet poll + final re-fetch of checks, comments, threads, mergeability, head SHA, **and** the current PR body.
9. Ready / merge only when `references/merge-gates.md` is clear (D8 is one of those gates) **and** user authorization exists for merge. If D7 fires on this re-fetch, rewrite before ready — do not fail D8 with no rewrite path.

Delete current step 4 (independent-review coverage as a wrap-up readiness stop). Keep the When-To-Use sentence that routes **user-requested** fresh review to `implementation-review` | `skills-creation`.

Call site for description (Lane handoff):

```text
IF D7 fires (create, missing D2 headings, stale against current HEAD/diff, secret-unsafe, or user asked to rewrite) — including after a head/diff identity change and before a ready claim:
  dispatch `pr-description` to a Mini Worker (Exact steps, Luna xhigh when native) using the wrap-up description packet.
  Subagent loads `references/pr-description.md`.
  Parallel-safe after local branch state is known and public-artifact-safety rules are in the packet; may serialize with push.
  Instance authority is equal to or narrower than the lane maximum: draft the body file under tmp only; no push, merge, readiness claim, comment replies, or `gh pr edit`.
  Return complete | partial | blocked receipt against the teaching checks in `pr-description.md`.
  Parent mechanical-verifies (D10). Then dispatch an Operator to `gh pr edit --body-file` the verified tmp file.
```

MUST load `manage-agents` before Mini Worker description dispatch, Operator publish, and monitor Operators. `manage-agents` owns role, model, packet encoding, receipt, and escalation. Wrap-up still owns PR gates and mechanical acceptance of the body.

### Depth

| File | Role |
| --- | --- |
| `references/pr-description.md` **new** | Teaching owner of description authoring **and** choose-to-views. Must teach inspect / good / bad / stop for `## Why the change` (one sentence naming the problem and what shipping unlocks; bad: file-list or restated title), `## Special things to note` (1–3 reviewer warnings, migrations, constraints, omissions, surprises, or `- None.`; bad: filler or empty), and Change outline (D4). Worker `complete` only when those checks plus D4 pass; `partial` names missing views or weak Why/Notes; `blocked` when diff identity is missing. Sourced from HumanLayer visual-pr **adapted**, not copied. Parent does not load this file to re-author; D10 mechanical checks are inline in SKILL.md. |
| `references/public-artifact-safety.md` | Unchanged owner of never-publish secrets. Description lane cites it; does not restate the secret list. |
| `references/merge-gates.md` | Single ready-gate list. Add D8 as a bullet **and** include current PR body in the final re-fetch sentence. Inspect the live GitHub body vs current HEAD/diff. Not ready on missing `## Why the change`, file-list changelog, stale body, or public-artifact-safety fail. Ready only when D2-conformant, current, and public-safe. Do not add independent-review coverage. |
| `references/local-branch-state.md`, `github-pr-state.md`, `monitor-loop.md` | Unchanged owners of their stages. |
| `scripts/` | Not needed. |

`pr-description.md` is a qualified lane **and** a teaching reference (one file): parallel-safe after prerequisites, bounded packet (PR number or create-intent, base, head SHA, diff identity, existing body, user-supplied links only), owned mission (draft the template), no merge/push, `complete|partial|blocked` receipt, parent verifies.

Ceremony: none. Do not add a second schema file; one description lane, no shared multi-lane fields.

### Proof

Discipline skill. User-directed intent: first draft may proceed after this spec is accepted; claim is `intent only` until evals run.

| Scenario | Action |
| --- | --- |
| New: file-list changelog vs D2 headings | Agent asked to open/update PR; must produce the three D2 headings + at least one structural view, not a path list. Grader asserts the same heading strings D8 checks. |
| New: choose-to-views omit | Diff is types-only; agent must omit React/SQL headings rather than fill every category. |
| New: parent does not inline-write; Mini Operator must not draft | Pressure “it’s faster to write the body myself” and near-miss Operator drafting; compliant path dispatches Mini Worker to tmp, parent mechanical-verifies, Operator publishes `gh`. |
| New: ready blocked on stale/file-list body after green checks | Green CI + file-list or missing Why must not yield ready. |
| Keep: `secret-safe-pr-body` | Still refuses credential paths in the new template. |
| Keep: `review-routing-boundary` | Fresh bug-finding still routes out. |
| Invert or retire: `missing-implementation-review` | After this change, wrap-up may call ready without an `implementation-review` result. Scenario must stop expecting `pr readiness: blocked` for missing review. Replace with: wrap-up does not claim it reviewed the diff. |
| Keep remaining monitor/merge pressures | Unchanged gates. |

Proof command: `pnpm --dir tests/skills run test:evals` with wrap-up scenario ids. Static `claude plugin validate` / marketplace list only at ship, not as behavior proof.

## Coordination

| Slot | Value |
| --- | --- |
| Base branch | Current checkout; no skill edits until `accepted-to-implement` |
| Pending edits | None until implement |
| Version / changelog | On implement: bump `shravan-dev-workflow` plugin version, dated `docs/changelog/` entry (PR-body behavior + dropped wrap-up review gate), plugin README cutover sentence |
| Cache refresh | Post-push / release proof only, not a substitute for PR readiness |
| Provenance | Mapping already exists at `ai-dev-skills/docs/my-ai-tools/shravan-dev-workflow/implementation-pr-wrapup.md`. Refresh borrowed/do-not-copy only if implement drifts from that row. Do not add a duplicate. Lite catalog only if the high-level PR-area story changes. |

## Non-goals

- New skill `visual-pr`.
- Screenshot/GIF PR writeups.
- HumanLayer `.humanlayer/tasks/` artifacts, ticket IDs, `pr-walkthrough.html`.
- Editing `orchestrator-implementation-goal` (it still sequences independent review before wrap-up for delivery goals).
- Loading presentation skills from wrap-up.
- Auto-commit of dirty trees.
- Making wrap-up a code-review skill.
- Copying HumanLayer `SKILL.md` prose.

## Proposed SKILL.md body contract (implement will write this)

Mental model as in Main path. Required references list adds `references/pr-description.md` behind the D7 IF (Worker loads it), and `manage-agents` before Mini Worker description dispatch, Operator publish, and monitor Operators. Stop conditions: drop “current applicable independent-review coverage is missing or stale”; add “PR body is missing `## Why the change` / `## Special things to note` / `## Change outline`, stale against HEAD, or would fail public-artifact safety.” Shortcuts to reject add: “A file list is a PR description.” / “I already know the shape, skip the outline.” / “It’s faster to write the body in the parent.” / “Mini Operator can draft the outline.”

## Security (chat-only, before any skill write)

```text
sensitive surfaces: third-party source (HumanLayer visual-pr template/views); existing gh network publish
entry points: new description reference; existing gh pr edit --body-file
untrusted inputs: PR comments (unchanged); generated body (sanitize before publish)
privileged actions: none new; merge remains user-authorized
third-party source: https://github.com/humanlayer/skills plugins/visual-pr (MIT)
license / permission state: MIT; adapt structure
copy-vs-adapt decision: adapt — template slots and view predicates only; no HumanLayer paths, no copied SKILL prose
decision: allowed for adaptation into wrap-up references after accepted-to-implement; no skill write in this proposal step
required proof: pressure on template + secrets; no new scripts
public-safe constraints: existing public-artifact-safety remains the never-publish list
review route: skills-creation security-gate only; not ops-security-review
```

## Spec-review record

```text
accepted revision label: 2026-09-17-pr-wrapup-visual-description-r1
lanes:
- mental-model-fit: complete (Task 5c74ca8d, Grok high)
- trigger-routing: complete (Task 9ce03389, Grok high)
- rule-agreement: complete (Task 6051c1fc, Grok high)
- depth-coverage: complete (Task 1364e0d5, Grok high)
receipts: all complete; parent verified against proposal + shipped wrap-up + manage-agents + merge-gates
verdict: targeted-revision then parent-verified remediation; now accepted-to-implement
semantic coverage: trigger, lens, body template, choose-to-views, Mini Worker vs Operator, D8/D9 gates, teaching owners
acceptance: original review + this one permitted remediation. No second reviewer dispatch.
reviewer-runtime deviation: all four lanes used Cursor-native Grok high (`cursor-grok-4.6-high-fast`). Different-lineage Reviewer-table models (Sol/Opus/Astra/Fable) are not advertised on this host Task list; Luna is Mini not Reviewer. Gap reported, not silently substituted.
```

Parent reduction of accepted findings (all remediated in this doc; no skill files touched):

- Parent verify must be mechanical, not re-pick views (mental-model + depth).
- Qualify “fresh evidence” so independent review is not a wrap-up gate (mental-model).
- Re-enter D7 after HEAD/diff change and before ready (mental-model).
- One role label: Mini Worker Exact steps; Operator publishes `gh` (rule-agreement).
- One heading triple: `## Why the change` / `## Special things to note` / `## Change outline` (rule-agreement).
- D8 lives in merge-gates bullets **and** final re-fetch (rule-agreement + depth).
- HumanLayer pin is commit `ca7c808`, not blob `28fc332` (rule-agreement).
- Provenance row already exists; refresh only if implement drifts (observation).
- `pr-description.md` must teach Why and Special notes inspect/good-bad/stop plus Worker receipt criteria (depth).

Rejected: none of the important findings. Trigger-routing had no findings.

