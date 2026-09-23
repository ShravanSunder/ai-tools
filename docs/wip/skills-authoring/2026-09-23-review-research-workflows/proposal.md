# Reviews and research as workflows, not swarms

Revision 1 (draft, not yet reviewed). Main-authored multi-run skill-change spec. Owner plugin: `shravan-dev-workflow`. Combined PR B + C per owner (2026-09-23). Stacks on PR A ([#91](https://github.com/ShravanSunder/ai-tools/pull/91)); coordinates with the Workhorse PR, which also edits `manage-agents`.

## Problem and evidence

- Review skills run as coordinator-plus-lane swarms: one 🔎 Review Sidekick must fan out fresh native lane 🛠️ Workers (`implementation-review/SKILL.md:32-51`: spec-compliance, one chunk-reviewer per chunk, dispel, proof-challenge, focused; `spec-program-review/SKILL.md:125,133-179`: mode-complete, chunks, dispel, proof-challenge, ten focused lanes; `skills-creation/references/review/spec-review.md:31-48`, `implementation-review.md:13-26`, `review-lane-workflow.md` whole file).
- `research-swarm` assigns one 🛠️ Worker per source lane (`SKILL.md:18,38,45-46`; `references/lane-packets.md`).
- `discuss-pathfinding/references/decisions-and-docs.md:63` and `discuss-clarify-mental-models/SKILL.md:113` each dispatch a one-shot "Reviewer" subagent.
- `manage-agents` authorizes review lane Workers (`SKILL.md:181,194,201,239,267,270-271,291`; `native-providers-codex.md:23,40-44`; Claude/Cursor native files line 5).
- `skills-creation` teaches `MUST dispatch <lane> to a subagent` as a first-class call form (`SKILL.md:52-77`, `reference-lanes-design.md`), so new skills get authored as swarms.
- Earlier accepted specs authorized the fan-out: `docs/wip/skills-authoring/2026-08-30-review-skills-rails-and-coordination.md` (D1-D2), `2026-09-16-persistent-review-workflow-spec.md` (D4).
- Owner direction (2026-09-23): "You should not be doing swarm stuff anymore." The unfinished `origin/research-swarm-source-lanes-spec` (one spec doc, +364) pushes further into swarming; only its source-class checklist and null-result rules are reusable.

## Success definition

A 🔎 Review Sidekick commissioned for design, implementation, or skill-package review walks every required check itself as ordered steps in its own session, records a status per check, hands only prescribed proof commands to a 🔧 Operator, and returns one reduced result. Research runs as one ordered workflow by the researcher, with one optional 🔎 Review Sidekick countercheck for load-bearing conclusions. No skill tells an agent to fan out lane subagents for review or research, and `skills-creation` no longer teaches that form.

## Decisions (owner may strike any row)

| Decision | Rationale |
| --- | --- |
| Review independence comes from a different-lineage 🔎 Review Sidekick with no author history; checks run in its one session, not fresh lanes | Owner decision 2026-09-23. Trade-off stated: later checks can be primed by earlier ones; the per-check status block and reading order are the mitigation. |
| Every former lane mission becomes an ordered checklist step with the same instructions; its file stays and is loaded at that step | Keeps the tested check content; removes only dispatch machinery. |
| Each review returns a per-check status block (`done | skipped: <reason> | blocked`) before the verdict; a missing check blocks `ready` | Replaces "every lane has a terminal receipt" as the mechanical stop so long reviews do not skip dispel or focused checks. |
| Large targets are reviewed as sequential chunk passes; each pass reopens its complete files; seams overlap between passes | Keeps whole-file reading and seam coverage without subagents; addresses context size. |
| Proof commands go to a 🔧 Operator under the existing execution grant, write-set preflight, and `git status` check; the 🔎 Review Sidekick judges claimed vs observed | Owner-authorized exception; the Operator never owns the verdict. |
| Security-surface escalation becomes a commission-time model choice (a default Review row from a lineage different from the author) | No per-lane model switch exists without lanes. |
| `skills-creation` retires `MUST dispatch <lane> to a subagent` for review and research; dispatch remains for 🔧 Operator procedures and genuinely independent work only | Owner decision; prevents new swarms at authoring time. |
| Rename `research-swarm` to `research-workflow` (hard cutover: directory, name, description, callers, marketplace/README tables, fixtures) | Owner decision; the name taught the pattern. |
| Keep the research countercheck as the one review handoff to a 🔎 Review Sidekick | Owner decision; independent disproof of load-bearing claims stays. |
| Supersede the fan-out decisions in the 2026-08-30 and 2026-09-16 specs by marking them superseded in place | Removes competing owners; keeps history. |
| Emoji by example applies to every role mention in these skills | Owner requirement; these skills are excluded from the Workhorse PR's emoji runs. |

## Runs in sequence

Paths beneath `plugins/shravan-dev-workflow/skills/`. One skill per run.

| # | Skill | Class | Main path | Depth | Proof |
| --- | --- | --- | --- | --- | --- |
| 1 | `manage-agents` | behavior-changing | remove review-lane Worker authorization (181, 194, 201, 239, 267, 270-271, 291); Review Sidekick walks its review workflow itself and may assign a 🔧 Operator for prescribed proof commands; research Sidekick/Worker text points to `research-workflow` | `native-providers-*.md` drop "read-only review lane Worker"; Codex example stops being a review lane | rewrite `reviewer-fork-turns-none`, `reviewer-no-coordinator-skill`, `native-reviewer-uses-spawn` to the workflow model (Review Sidekick session and Operator proof); keep `fork_turns="none"` only where still relevant |
| 2 | `implementation-review` | behavior-changing | replace "Choose the Lanes" / "Dispatch" with an ordered check sequence (spec-compliance, chunk passes, proof-challenge via 🔧 Operator, dispel, focused only for a named residual risk) and the per-check status block; blockers updated | `coordination-and-chunking.md` becomes chunk-pass planning; `lanes/*.md` missions become step instructions; `lanes/lane-schema.md` keeps finding/status shapes, drops Worker packet fields | rewrite `complete-source-trace`, `chunk-keeps-contract-with-callers`, `refuse-ready-from-partial-receipt`, `dispel-over-delivery`, `verify-candidate-finding`, `whole-file-read-required` to ordered-check behavior |
| 3 | `spec-program-review` | behavior-changing | same conversion: mode-complete check, chunk passes by seam, dispel, proof-challenge via Operator, focused checks by predicate; status block | same reference split as run 2 | rewrite `chunk-design-seams`, `compose-focused-lanes-by-predicate`, `independence-honors-execution-grant`, `route-only-validated-findings`, `dispel-design-over-delivery` |
| 4 | `skills-creation` | behavior-changing | review stages walk the checklists in the lead's session; Call Grammar keeps `load` forms and a narrowed `dispatch` form for Operator procedures and independent work only; Review section and completion blockers updated | `review/review-lane-workflow.md` deleted; `review/spec-review.md` and `review/implementation-review.md` list checks instead of lanes; `reference-lanes-design.md` narrowed to output/tool shapes; `lanes/lane-schema.md` keeps verdicts and reduction shape | rewrite `review-lane-scaling`, `spec-review-gate`, `evaluate-on-disk-route` |
| 5 | `research-swarm` -> `research-workflow` | behavior-changing (trigger rename) | ordered workflow: frame questions, re-anchor locally, walk source classes one by one, verify, optional countercheck to a 🔎 Review Sidekick, synthesize; description rewritten as a trigger | `lane-packets.md` becomes source-class checklists (reuse the branch's source-class table and null-result rules); `evidence-ledger.md`, `tool-routing.md` kept | rewrite `question-first`, `substantial-stage-artifacts`; update every caller naming `research-swarm` (skills, AGENTS.md, READMEs, marketplace skill tables) |
| 6 | `discuss-pathfinding` | scoped | none | `decisions-and-docs.md:63`: the reader test becomes a step the session walks (fresh re-read of only the record and questions), no subagent | static |
| 7 | `discuss-clarify-mental-models` | scoped | line 113: the divergent pass becomes a last self-check, or hands the close map to the 🔎 Review Sidekick when one is already commissioned | none | static |

Companion (same PR, not skill runs): mark superseded decisions in the two earlier specs; `AGENTS.md` skill table (research-workflow row, review rows); `plugins/shravan-dev-workflow/README.md`; changelog; version bump.

## Authoring basis and proof plan

Basis: user-directed intent. Structural proof: `rg -n 'dispatch .{0,40}(lane|subagent)|lane Worker|research-swarm'` over active skills, fixtures, AGENTS.md and READMEs returns only 🔧 Operator procedure dispatch and history; `pnpm --dir tests/skills run test`, typecheck, `claude plugin validate .`. Behavior proof: live `test:evals` on the rewritten review and research scenarios is the real proof; owner decides whether to run them.

## Coordination

- Base: `feat/model-routing-retier` (PR A). Branch `feat/review-research-workflows` in worktree `~/dev/ai-tools.feat-review-research-workflows`.
- Conflicts: the Workhorse PR also edits `manage-agents` (tables, Latency, emoji). Land Workhorse first, then rebase run 1 here, or sequence run 1 after Workhorse merges.
- Versions: next minor after the Workhorse PR; changelog entry; cache refresh only after merge.

## Non-goals

Model matrix changes, Workhorse/Latency (Workhorse PR), Router changes, rewriting historical changelogs.

## Spec-review record

Not yet reviewed.
