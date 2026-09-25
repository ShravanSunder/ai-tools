# Capability revamp: layers, practices, and the session path

Revision 1 (draft, not yet reviewed). Main-authored multi-run skill-change spec. Owner plugins: `shravan-dev-workflow` and `agent-router` (vendored from codex-router). Companion changes: devfiles `shared/my_agents.md` and codex-router `agent-skills/agent-collaboration`.

## Problem and evidence

- Nothing from the 2026-09-23/25 session reached a board. The 🐒 Sidekicks reported no board project for this repo and skipped tracking; Main never opened a trace. Only the two orchestrators invoke the tracker (`orchestrator-design/SKILL.md:19`, `orchestrator-implementation-goal/SKILL.md:20,37`); no phase skill mentions it (search over `spec-design`, `program-design`, `plan-implementation`, `implement-plan`, `implementation-review`, `research-workflow`, `discuss-pathfinding`, `skills-creation` returns zero).
- The devfiles start trigger is conditional and buried: "At the start or resumption of substantial work, use `agent-collaboration`…" (`shared/my_agents.md` "Shared Work and Message Boards", about line 307). The Featured Skills rows for `agent-collaboration` and `track-show-me-your-work` describe capability, not when to start.
- Skill descriptions fire narrowly: the tracker triggers on work-trail requests or orchestrator runs; `agent-collaboration` says "every real orchestration coding session".
- In the Cursor session, the auto-listed skills did not include any `shravan-dev-workflow` skill although the plugin is installed; the owner attached them by hand (observed this session; cause not yet investigated).
- The skill graph is not layered. Upward and circular references (layering audit, 2026-09-25): `agent-collaboration/references/message-board.md:3` names the tracker; the tracker names `manage-agents` (`references/markdown-view.md:11`) and both orchestrators (`SKILL.md:3`); `manage-agents` names `skills-creation` (`references/building-acp-adapters.md:11`) and `spec-design` (`SKILL.md:132`); about a dozen two-way name cycles between phase skills; `shared-references/requirements-specification-program-design.md:21,25,37` routes to named phases.
- `agent-collaboration` mixes tool usage with policy ("always use a shared message board in every real orchestration coding session", "use direct messages for assignments", seat meanings, who resolves threads).
- `manage-agents` is 363 lines and incoherent: a whole-skill evaluation (Opus 5.5 high, 2026-09-25) returned `significant-rewrite`: about a dozen rules each stated 3-9 times, 15 run-on paragraphs over 600 characters, and two competing organizing principles.
- ACPX is the persistent cross-provider route today; the owner intends to stop using it. Research (2026-09-25): the Router already creates Codex conversations with model, effort, access, title, and follow-ups; Claude/Cursor ACP (codex-router 0.1.36+) cannot yet set model or effort or titles, and permission mapping is unverified.

## Success definition

A new session in any host, for any substantial task:

1. learns the owner's behaviors, core concepts, and always-on practices from a short devfiles prompt;
2. at the start, finds the repo's board thread (asking the owner once if none exists) and opens or resumes the trace;
3. picks the right entry point from a skill index: an orchestrator for a whole job, a phase skill for one step;
4. while working, delegates through `manage-agents`, coordinates through `practices-collaboration`, and records decisions, evidence, and outcomes in the trace;
5. closes the trace with proof and a continuation checkpoint.

No skill names a skill in a higher layer, and `agent-collaboration` teaches only how to operate the tool.

## Concepts, behaviors, and practices (owner-confirmed buckets)

| Bucket | Contents | Home |
| --- | --- | --- |
| Behaviors | Soul (ground truth first, curiosity, tradeoffs, directness), design vs act modes, drift vs break, never escalate a model or widen scope unasked, never skip silently: ask once | devfiles prompt |
| Concepts | roles and emoji, authority (Main authors and accepts; owner decides and merges), model tiers (Workhorse, Daily driver, Frontier; tables decide), skill layers, where work lives (project, board, topic, thread; coordination and execution threads; seats), the trace, done and proof | devfiles prompt (short summary); detail in the owning practice |
| Practices | find the work home, keep the trace, show evidence, collaborate with agents, delegate, present clearly, prove before done | practice skills listed below |

## Layers

```text
Orchestrators   run a whole job; drive phases
  orchestrator-design · orchestrator-implementation-goal
Phases          the steps of the work
  discuss-pathfinding · discuss-clarify-mental-models
  spec-design · program-design · spec-program-review
  plan-implementation · plan-improve-repo · implement-plan
  implementation-review · implementation-pr-wrapup
  spec-handoff · plan-handoff · implementation-handoff
  docs-maintain · debug-investigation · skills-creation · skill-audit
Practices       always on; any phase or orchestrator uses them
  practices-research · manage-agents · practices-show-me-your-work · practices-collaboration
  presentation-tui · presentation-webui · ops-linear-tracking · ops-observability-stack · ops-security-review
Tool manuals    how to operate a tool; no when or why
  agent-collaboration (vendored) · native spawn and Router mechanics (references owned by manage-agents until extracted)
```

Direction rule: a skill may name skills in its own layer (acyclic) or below, never above. A phase returns a destination token ("route to design" / "route to planning") instead of loading its caller or orchestrator. Practice order, lowest first: `practices-collaboration` < `practices-show-me-your-work` < `manage-agents` < `practices-research`; presentation and ops practices stand alone.

## Session path (what devfiles loads and why)

```text
devfiles shared/my_agents.md
├── Behaviors                 unchanged Soul, trimmed where it repeats skills
├── Concepts (short)          the vocabulary the skills below assume
├── Practices (top, unconditional): at the start of every task, before other work
│     1. load practices-collaboration; find this repo's board project and thread; none? ask the owner once
│     2. load practices-show-me-your-work; open or resume the trace in that thread
│     3. record decisions, evidence, and outcomes in the trace as you work; close it when you stop
│     4. delegate through manage-agents; coordinate through practices-collaboration
├── Skill index               situation -> orchestrator or phase skill (replaces the 7-row Featured table)
└── Host note                 if a listed skill is missing from the host's skill list, read it from the installed plugin path
```

## Decisions (owner may strike any row)

| Decision | Rationale |
| --- | --- |
| Layers are Orchestrators, Phases, Practices, Tool manuals | Owner, 2026-09-25: layer by the role a skill plays, not by who calls whom. |
| New `practices-*` family: `practices-show-me-your-work` (renames `track-show-me-your-work`), `practices-research` (renames `research-workflow`), `practices-collaboration` (new) | Owner naming, 2026-09-25. Hard cutover; no aliases. |
| `practices-collaboration` owns how collaboration works: board home, coordination and execution threads, seat meanings per role, messages vs posts, waiting and listening, applying titles, asking the owner when no board exists | Policy leaves `agent-collaboration`, the tracker's board parts, and `manage-agents`' waiting section. |
| `agent-collaboration` becomes a tool manual only (upstream in codex-router, then re-vendored) | Owner: it is "just about how the tool works". |
| `practices-show-me-your-work` owns the trace: open or resume at start, record as you go, close with proof; "show me your work" is reading it | Owner: showing work is part of creating the trace. Its description triggers at the start of any substantial task. |
| `manage-agents` is rebuilt around one Authority section, roles, model tables in a catalog reference, runtime, handoff and verify; waiting moves to `practices-collaboration` | Whole-skill evaluation's trim proposal; owner: "it's huge and incoherent". |
| ACPX stops being a default route: Router for Codex persistent agents now; ACPX kept only in one legacy reference for Claude/Cursor until codex-router supports model, effort, and titles for them | Owner intends to drop ACPX; research shows Claude/Cursor Router gaps today. |
| Each phase skill gets one completion line: record the checkpoint through `practices-show-me-your-work` | Catches phases run directly, as happened this session. |
| Presentation and ops skills keep their names; they are classified as practices | Owner named only the three new `practices-*` skills. |
| Emoji: the first role mention per paragraph carries its emoji | Already merged in #92; devfiles prompt follows. |
| peekaboo and non-dev-workflow plugins are out of scope | Owner, 2026-09-25. |

## Runs in sequence

One skill per run. Paths beneath `plugins/shravan-dev-workflow/skills/` unless stated.

| # | Target | Class | Change | Proof |
| --- | --- | --- | --- | --- |
| 1 | `agent-collaboration` (codex-router `agent-skills/agent-collaboration`, then re-vendor to `plugins/agent-router`) | behavior-changing | remove every when/why sentence and seat-meaning/resolve rule; keep CLI/MCP usage, identity, sessions, boards/topics/threads calls, seat values, listen/wait, wakes, schedules, uncertain-mutation recovery; drop the tracker name; description says how to operate the tool | static; `diff -r` vendored copy vs pin |
| 2 | `practices-collaboration` (new) | behavior-changing (create) | board home and ask-once rule, thread structure, seat meanings, messages vs posts, waiting/listening, titles; loads `agent-collaboration` for mechanics | new scenarios: no board project -> asks owner once; waits on a listener instead of polling |
| 3 | `practices-show-me-your-work` (rename `track-show-me-your-work`) | behavior-changing (trigger + rename) | owns the trace; start-of-task trigger; uses `practices-collaboration` for the thread; drops names of orchestrators and `manage-agents` | rename fixtures; new scenario: new session opens the trace before editing |
| 4 | `manage-agents` | behavior-changing (restructure) | Authority section, roles, model catalog reference, runtime (native + Router; ACPX legacy reference), handoff and verify; waiting to `practices-collaboration`; drop `spec-design` and `skills-creation` names; target about 200 lines | existing scenarios reworded; stale "Delegate"/"Terra" vocabulary fixed |
| 5 | `practices-research` (rename `research-workflow`) | behavior-changing (trigger + rename) | hard cutover of name, description, callers, fixtures | rename fixtures |
| 6-22 | each phase skill (`discuss-pathfinding`, `discuss-clarify-mental-models`, `spec-design`, `program-design`, `spec-program-review`, `plan-implementation`, `plan-improve-repo`, `implement-plan`, `implementation-review`, `implementation-pr-wrapup`, `spec-handoff`, `plan-handoff`, `implementation-handoff`, `docs-maintain`, `debug-investigation`, `skills-creation`, `skill-audit`), one run each | scoped or behavior-changing per skill | add the trace completion line; replace upward names and caller loads with destination tokens; update renamed callers | static layering search |
| 23-24 | `orchestrator-design`, `orchestrator-implementation-goal` | behavior-changing | start the trace via `practices-show-me-your-work`; commission through `manage-agents`; renamed callers | static |
| 25 | shared references (`requirements-specification-program-design.md`, `diagram-rendering-and-fallbacks.md`, `generated-document-visuals.md`) | behavior-changing | remove phase-skill names; return destination tokens | static |

Companions:

- devfiles `shared/my_agents.md`: Behaviors, short Concepts, top Practices block, skill index, host note; emoji-once rule; remove the long board section it replaces. Separate private PR.
- Repo docs: `AGENTS.md` skill table and layer description, `plugins/shravan-dev-workflow/README.md` namespace map (new `practices` family), changelog, versions.
- Cursor skill discovery: investigate why installed plugin skills were not auto-listed; report the cause and fix or record the host note.

## Authoring basis and proof plan

Basis: user-directed intent, informed by this session's observed failure (no trace recorded) and the two 2026-09-25 audits. Structural proof: a layering check that finds no upward names and no cycles across active skills and shared references; renamed-skill search returns only history; `pnpm --dir tests/skills run test`, typecheck, `claude plugin validate .`. Behavior proof: live `test:evals` for the new practice scenarios once the eval harness can read branch-local skills (known harness gap from #92); otherwise the gap is named.

## Coordination

- ai-tools branch `feat/capability-revamp` in `~/dev/ai-tools.feat-capability-revamp` (from `main` at `2023f3f1`). One PR per ordered group: A = runs 1-3 (collaboration foundation), B = run 4 (`manage-agents`), C = run 5 plus runs 6-25 (renames, phases, orchestrators, shared references). Stacked in that order.
- codex-router: run 1 upstream PR first; ai-tools re-vendors with a pinned SHA in PR A.
- devfiles: prompt PR lands after PR A so it names skills that exist.
- Versions: next minor of `shravan-dev-workflow` per PR; `agent-router` minor for the re-vendor.

## Open owner decisions

1. A board project for ai-tools (none exists): create one or name an existing project.
2. PR grouping A/B/C as above, or one PR per run group of your choosing.
3. Whether presentation and ops skills should also join the `practices-*` family now or later.

## Non-goals

Model matrix changes; peekaboo and other plugins; removing ACPX before codex-router closes the Claude/Cursor gaps; extracting gh/Linear/observability tool manuals out of their skills (later).

## Spec-review record

Not yet reviewed.
