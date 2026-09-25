# Capability revamp: layers, practices, and the session path

Revision 2.2, accepted-to-implement 2026-09-25 (Revision 2 plus its bounded remediation and one owner-authorized fix round; Revision 1 was `significant-rewrite`). Main-authored multi-run skill-change spec. Owner plugins: `shravan-dev-workflow` and `agent-router` (vendored from codex-router). Companion changes: devfiles `shared/my_agents.md`, codex-router `agent-skills/agent-collaboration`, and the `tests/skills` eval harness.

## Problem and evidence

Sources are current source at `2ac1ff5d` unless labeled. "Session transcript" means Cursor conversation `052d2269-364f-46e9-9269-05bf52bc2adc` (2026-09-23/25).

- No trace reached a board during the session (session transcript: 🐒 Sidekicks reported no board project and skipped tracking; Main never opened a trace). Only the two orchestrators invoke the tracker (`orchestrator-design/SKILL.md:19`, `orchestrator-implementation-goal/SKILL.md:20,37`); the phase list in this spec never mentions it (verified by the Revision 1 reviewer).
- No board project exists for ai-tools: `agent-collaboration board project list` on 2026-09-25 returns four projects (perseus-agent, coordination-platform, Relay Tasks, Chief of Staff), none for this repo.
- The devfiles start trigger is conditional and buried (`shared/my_agents.md:307`). The tracker description fires on trail requests, orchestrator runs, or multi-component work (`track-show-me-your-work/SKILL.md:3`); `agent-collaboration` says "every real orchestration coding session" (`agent-collaboration/SKILL.md:3`).
- Cursor did not auto-list any `shravan-dev-workflow` skill although the plugin cache holds them (`~/.cursor/plugins/cache/shravansunder-ai-tools/shravan-dev-workflow/<hash>/skills/`); the owner attached skills by hand (session transcript). Cause not investigated.
- The graph has upward and two-way names: `agent-collaboration/references/message-board.md:3` names the tracker; `track-show-me-your-work/SKILL.md:3` names both orchestrators; `manage-agents/SKILL.md:194` names `research-workflow` while `research-workflow/SKILL.md:25` commissions through `manage-agents`; `research-workflow/SKILL.md:3,32` name phase skills; `shared-references/requirements-specification-program-design.md:21,76,82` routes gaps to `spec-design`, `discuss-pathfinding`, and `program-design`; `canonical-implementation-plan.md:51` states `orchestrator-implementation-goal` behavior. Other shared-reference names (`humanizer.md:9,11`, presentation `Consumers:` lines, `generated-document-visuals.md:11` loading `imagegen`, the plan's `originating planner` field) are consumer declarations, downward loads, or data values.
- `agent-collaboration` mixes tool usage with policy: "Always use a shared message board in every real orchestration coding session" (`SKILL.md:14`), seat meanings and resolution rules (`references/message-board.md:13-40`).
- `manage-agents/SKILL.md` is 362 lines. A whole-skill evaluation (Opus 5.5 high 🔎 Review Sidekick, session transcript) returned `significant-rewrite`: rules stated 3-9 times, run-on paragraphs over 600 characters, two organizing principles. Its Waiting section (`SKILL.md:334`) is collaboration policy.
- No live behavior eval passed or established the revised fixtures in PR #92: one early subject response came from a fixture that later failed the prompt-leak check, then non-interactive ACPX stopped a subject with "Permission prompt unavailable in non-interactive mode" although the runner passes `--approve-reads` (`tests/skills/lib/skill-pressure-evaluation/agent-execution/acpx-codex-agent-runner.ts:193-211`; receipt `tmp/agent-packets/luna-workhorse-implementation.receipt.md:32-37` in the main checkout). The subject prompt already points at repo-local source (`render-subject-prompt.ts:102-107`). Separately, today the adapter's `@openai/codex` npm dependency is quarantined by the corporate registry; pointing the adapter at the local Codex CLI works around it (session transcript). The harness's supported setting for that is `SKILL_PRESSURE_CODEX_PATH`; it ignores an inherited `CODEX_PATH` (`tests/skills/README.md:19`). Exact cause of the permission stop: undiagnosed.

## Success definition

A new session in any host, for any qualifying task:

1. learns the owner's behaviors, core concepts, and always-on practices from a short devfiles prompt;
2. at entry, acts by role and condition per the Session entry map below, including when no board exists or the owner is away;
3. picks the right entry point from a skill index: an orchestrator for a whole job, a phase skill for one step;
4. while working, delegates through `manage-agents`, coordinates through `practices-collaboration`, and records decisions, evidence, and outcomes in the trace;
5. closes with proof and a continuation checkpoint.

No skill names a skill in a higher layer. `agent-collaboration` teaches only how to operate the tool.

**Qualifying task** (one predicate, used verbatim by devfiles and the tracker description): the work spans more than one session, commissions another agent, crosses components, or makes a decision someone will later inspect; or the user asks for a trail. A routine small edit does not qualify.

## Session entry map

| Condition | Seat | Entry action | Continuation | Owner of the rule |
| --- | --- | --- | --- | --- |
| Qualifying task, repo has a board project | Main | find or reuse the work thread; open or resume the trace with goal, scope, and worktree | record as it works; checkpoint at stop | home: `practices-collaboration`; trace: `practices-show-me-your-work` |
| Qualifying task, no board project or no access | Main | ask the owner once which project to use or create; in the same turn create the wip trace folder `docs/wip/work-trails/<yyyy-mm-dd-work-label>/` in Main's worktree and start `main.md` there, marked unshared | keep working; only work that needs another agent's board-mediated reply waits; when a board exists, Main transfers the folder (below) | ask-once: `practices-collaboration` (returns `no-home: <gap>`); wip folder and transfer: `practices-show-me-your-work` |
| Routine small edit | Main | no trace | if a work thread is already in context and the edit changes its state, post the outcome there | `practices-show-me-your-work` |
| Phase skill invoked directly, no work reference in context, task qualifies | Main | phase entry step opens or resumes the trace before phase work | phase completion step records the checkpoint | each phase `SKILL.md` (one entry line, one completion line) |
| Assigned implementation, board root exists | 🐒 Sidekick | use the supplied execution root; never open a coordination root | post assignment discussion and proof there; checkpoint the assignment; never resolve the coordination root | `practices-collaboration` (seats); `practices-show-me-your-work` (checkpoint) |
| Assigned implementation, no board yet | 🐒 Sidekick | the commission carries the absolute path of Main's wip trace folder and grants write access to that one file; write only its own `<assignment-label>.md` there, marked unshared; no write access means return state to Main instead | record assignment discussion and proof in that file; when Main transfers the folder, the file becomes the execution root's opening content | `practices-show-me-your-work` |
| Commissioned review | 🔎 Review Sidekick | use the supplied root if posting is authorized; otherwise none | return the review result to the commissioner | `practices-collaboration` |
| Bounded task | 🛠️ Worker, 🔧 Operator | no trace | return evidence to the owner; post only with explicit authority | `practices-collaboration` |
| Host does not list the plugin's skills | any | read `SKILL.md` from the active install: Codex `~/.codex/plugins/cache/ai-tools/shravan-dev-workflow/<version>/skills/<name>/` where `<version>` is `.installed[]` for `shravan-dev-workflow` in `codex plugin list --marketplace ai-tools --json`; Claude `<installPath>/skills/<name>/` from `~/.claude/plugins/installed_plugins.json`; Cursor has no active-install readback, so read `~/.cursor/plugins/cache/*/shravan-dev-workflow/<hash>/skills/<name>/` only when exactly one hash directory exists and tell the owner that copy is unverified with its hash | none found or several Cursor hashes: tell the owner `skill unavailable: <name>` (or the ambiguous paths) and follow the devfiles Practices block without it | devfiles host note |

**Wip trace folder transfer.** When a board project exists, Main creates the coordination root from `main.md` and one execution root per assignment file, posting each file's concise current state under Main's own verified session identity, quoting the file and naming its author session and file path (not a replay). A still-live 🐒 Sidekick then continues on its execution root as itself. Main records the returned message IDs at the top of each file and marks it transferred; the folder then stops receiving updates. Files are public-safe in public repos and follow the tracker's existing sanitize rule.

## Concepts, behaviors, and practices (owner-confirmed buckets)

| Bucket | Contents | Home |
| --- | --- | --- |
| Behaviors | Soul (ground truth first, curiosity, tradeoffs, directness), design vs act modes, drift vs break, never escalate a model or widen scope unasked, never skip silently: ask once | devfiles prompt |
| Concepts | roles and emoji, authority (Main authors and accepts; owner decides and merges), model tiers (Workhorse, Daily driver, Frontier; tables decide), skill layers, where work lives (project, board, topic, thread; coordination and execution roots; seats), the trace, qualifying task, done and proof | devfiles prompt (short); detail in the owning practice |
| Practices | find the work home, keep the trace, show evidence, collaborate with agents, delegate, present clearly, prove before done | practice skills below |

## Layers and routing

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
Practices       always on; any phase or orchestrator uses them (lowest first)
  practices-collaboration < practices-show-me-your-work < manage-agents < practices-research
Ops and presentation  own families at the practices level; any phase or orchestrator uses them
  ops-* (tickets and operations): ops-linear-tracking · ops-observability-stack · ops-security-review
  presentation-* (output): presentation-tui · presentation-webui
Tool manuals    how to operate a tool; no when or why
  agent-collaboration (vendored) · native spawn and agent-router mechanics (references owned by manage-agents until extracted)
Shared references  follow the DAG: a module of its callers at its lowest caller's layer; its edges point down
```

Direction rule: a skill names skills in its own layer (acyclic) or below, never above. An edge is a load, a route, or a commission. A shared reference is a module of its callers and takes the layer of its lowest-layer caller: it may load practices and tools below that layer (`presentation-*`, `imagegen`), declare its consumers or non-consumers (`Consumers: presentation-tui, presentation-webui`), and carry data values (`originating planner: plan-implementation | plan-improve-repo`); it routes work only through return tokens and never states behavior an orchestrator owns. Devfiles is the session root outside the layers and may name any skill.

Edges this rule forces:

- `manage-agents/SKILL.md:194` drops its `research-workflow` pointer (run 4); `practices-research` keeps commissioning through `manage-agents`.
- Role names, emoji, and the title format stay owned by `manage-agents`. `practices-collaboration` applies the title the commissioner supplies and does not name `manage-agents`.
- `practices-collaboration` returns `no-home: <gap>`; `practices-show-me-your-work` owns the wip trace folder and transfer. The lower practice never names the higher.

**Phase return tokens.** A phase or shared reference that must send work elsewhere returns a token with its payload instead of naming a phase. Vocabulary lives in a new shared reference `shared-references/phase-return-tokens.md` that names no phase or orchestrator:

| Token | Payload | Replaces today |
| --- | --- | --- |
| `requirements-gap` | the missing owner meaning, evidence | route to `discuss-pathfinding` |
| `specification-gap` | the missing observable obligation, evidence | route to `spec-design` |
| `program-design-gap` | the structural gap, evidence | route to `program-design` |
| `ready-for-planning` | reviewed design identities | route to `plan-implementation` |
| `plan-defect` | plan anchor, defect, evidence, and the plan's existing `originating planner` field (`canonical-implementation-plan.md:17`) | the planner that field names |
| `ready-for-implementation` | plan path and revision | route to `implement-plan` |
| `ready-for-review` | diff, proof, assessment, and the existing classification `general-domain \| runtime-skill-package` (`implementation-review/SKILL.md:14`) | `general-domain` -> `implementation-review`; `runtime-skill-package` -> `skills-creation` |

Resolver: when an orchestrator invoked the phase, the orchestrator maps the token to the next skill in its own `SKILL.md`. When the phase ran directly, Main maps it through the devfiles skill index, which carries the same seven rows. Mapping names the next owner; it does not widen the requested task (a review-only request that returns `specification-gap` ends with that return). The Specification vs Program Design distinction in `requirements-specification-program-design.md:21-25` survives as two tokens.

## Session path (what devfiles loads and why)

```text
devfiles shared/my_agents.md
├── Behaviors                 unchanged Soul, trimmed where it repeats skills
├── Concepts (short)          the vocabulary the skills below assume, including "qualifying task"
├── Practices (top): at entry, before other work, by the Session entry map
│     1. qualifying task? load practices-collaboration; find the board thread; none -> ask once and continue
│     2. load practices-show-me-your-work; open or resume the trace (wip trace folder when no home)
│     3. record decisions, evidence, and outcomes as you work; checkpoint when you stop
│     4. delegate through manage-agents; coordinate through practices-collaboration
│     5. contributors: 🐒 Sidekick uses its assigned root or its file in Main's wip trace folder; 🛠️ Worker and 🔧 Operator return evidence
├── Skill index               situation -> orchestrator or phase skill; phase return token -> next skill
└── Host note                 exact cache paths from the entry map; `skill unavailable: <name>` when none
```

## Proposed descriptions (trigger surface)

- `agent-collaboration`: "Use when operating the agent-collaboration CLI or MCP: identity and sessions, listing or searching projects, boards, topics, and threads, posting or reading messages, inbox, listen and wait, wakes and schedules, or recovering an uncertain mutation. Covers how to call the tool, not when or why to coordinate."
- `practices-collaboration`: "Use at the start of a qualifying task to find the repository's board project and work thread, and whenever agents coordinate: commissioning or messaging another session, choosing a message or a board post, seat meanings, waiting on another agent, or when no board project exists. A qualifying task spans sessions, commissions another agent, crosses components, or makes a decision someone will later inspect. Not for tool syntax."
- `practices-show-me-your-work`: "Use at the start of a qualifying task to open or resume the work trace; while a trace is open, when recording a decision, evidence, blocker, or outcome, or when stopping or handing off; or when the user says show me your work or asks for a trail or history. A qualifying task spans sessions, commissions another agent, crosses components, or makes a decision someone will later inspect. Not for routine small edits unless a trail is requested."
- `practices-research`: "Use when a task needs source gathering, prior-art research, current docs or web evidence, memory or session-log mining, or saved-reader research before design, planning, review, or discussion can continue. Not for extracting unwritten owner meaning or repairing a shared model already held." (drops the two phase names in today's description.)

Near misses each trigger must reject: "how do I post to a thread" loads the tool manual, not the practice; "should I post this decision to the board" loads `practices-collaboration`; "fix this typo" loads neither practice.

## Teaching owners (depth)

`practices-collaboration`:

| Stage | Teaching owner | Source text moved in |
| --- | --- | --- |
| Mental model: project, board, topic, thread; coordination vs execution roots; seats | `SKILL.md` | tracker `SKILL.md:8,14-16` |
| Find the work home: supplied reference first, repository association, descriptions, ambiguity; stop at a chosen thread or `no-home` | `references/work-home-discovery.md` (MUST load at entry) | `message-board.md:5-12` |
| Ask once when no home, and what to return | `SKILL.md` | owner decision 2026-09-25 |
| Seats by role, message vs post, applying a supplied title | `SKILL.md` | `message-board.md:13-27`; tracker `SKILL.md:22` |
| Waiting on a real dependency: listen, timed wake, never poll | `references/waiting-and-listening.md` (IF waiting on another agent) | `manage-agents/SKILL.md:334-`; `message-board.md:28-37` |
| Finish a discussion vs resolve | `SKILL.md` | `message-board.md:38-40`; tracker `SKILL.md:30` |
| Tool calls | loads `agent-collaboration` | vendored manual |

`practices-show-me-your-work`: `SKILL.md` keeps open/resume, publish, checkpoint, and resolve (tracker `SKILL.md:18-30`, moved not rewritten); its unshared fallback (`SKILL.md:34-38`) becomes the wip trace folder, the pre-board 🐒 Sidekick file, and the transfer procedure from the entry map; `references/markdown-view.md` stays (drops its `manage-agents` name). The board-discovery and seat text moves to `practices-collaboration`.

`manage-agents`: `SKILL.md` keeps one Authority section, roles and title format, selection by table, runtime (native, agent-router; ACPX in `references/acpx-legacy.md`), handoff and verify. Model tables move to `references/model-catalog.md` (MUST load at selection). Waiting moves out as above.

## Decisions (owner may strike any row)

| Decision | Rationale |
| --- | --- |
| Layers are Orchestrators, Phases, Practices, Tool manuals; shared references are modules of their callers under the same edge rule | Owner, 2026-09-25: layer by the role a skill plays. |
| New `practices-*` family: `practices-show-me-your-work` (renames `track-show-me-your-work`), `practices-research` (renames `research-workflow`), `practices-collaboration` (new) | Owner naming, 2026-09-25. Hard cutover; no aliases. |
| No board or owner away: ask once, keep working in a repo `docs/wip/work-trails/<date-label>/` trace folder, transfer to the board later | Owner, 2026-09-25 : "create wip folder then transfer later". Replaces the tracker's `~/dev/memory-logs/work-trails/` location for unshared checkpoints (`SKILL.md:24,36`); long-form views may stay there. |
| A 🐒 Sidekick commissioned before a board writes its own file in Main's wip trace folder; Main transfers the folder | Owner, 2026-09-25. One writer per file avoids concurrent edits; the transfer keeps authorship. |
| Shared references follow the DAG from their lowest caller's layer; consumer declarations and data values are not edges | Owner, 2026-09-25: "according to dag". Keeps `imagegen`, presentation-consumer, `humanizer` consumer, and plan-field contracts intact; only routing and orchestrator-owned behavior change. |
| Phase runs use two representative live scenarios plus static checks; the gap for the other 15 phases is accepted | Owner, 2026-09-25. |
| Research ledgers move from `tmp/research-workflows/` to `tmp/practices-research/`; existing ledgers stay where they are | Hard cutover names the path after the skill; old ledgers are history. |
| Each devfiles prompt name change ships paired with the plugin release that renames the skill | Revision 2 review: an installed plugin must never meet a prompt naming a missing skill. |
| `practices-collaboration` owns where work lives and how agents coordinate; `agent-collaboration` owns only tool operation | Owner: the tool skill is "just about how the tool works". |
| `practices-show-me-your-work` owns the trace; "show me your work" means reading it | Owner: showing work is part of creating the trace. |
| One qualifying-task predicate shared by devfiles and both practice descriptions | Revision 1 review: "every task" vs "substantial" gave two readings. |
| Phase return tokens with payloads, resolved by the invoking orchestrator or by Main through the devfiles index | Revision 1 review: bare tokens lost routing information. |
| Each phase gets one entry line and one completion line for the trace | Revision 1 review: a completion line alone misses directly invoked phases. |
| A rename and every consumer's name swap land in one PR; consumer name swaps ride with the rename run as mechanical edits | Revision 1 review: staged renames shipped a broken intermediate plugin. |
| ACPX stops being a default route: agent-router (never "Router") carries persistent Codex and Claude relationships over ACP; ACPX stays in one legacy reference only for providers agent-router does not yet cover (Cursor today) | Owner, 2026-09-25: "call it agent-router not router; it has acp for claude and codex now till I have all of it". Replaces the earlier Codex-only default. |
| Each native provider page (`native-providers-{codex,claude,cursor}.md`) lists the exact allowed model ids, like the ACPX pages; an id the host advertises but the page does not list (deprecated `gpt-5.x`, Codex 5.3, Opus 5, `-fast` variants) is never used | Owner, 2026-09-25: "some models are deprecated so don't want it to use that". |
| Cursor native: Opus and Fable only on explicit owner request. When a host's native lineup lacks the catalog model for a role (Cursor has no Luna, Sol, or Astra), do not substitute a native stand-in: launch that 🛠️ Worker or 🔧 Operator through agent-router with Luna, as a bounded assignment that finishes after acceptance | Owner, 2026-09-25: "for cursor ... fable or opus is only used on request; if it doesn't have native we don't use it because it can use agent router and luna". Replaces "an unavailable native lineup is a reported gap". |
| `ops-*` (tickets and operations) and `presentation-*` (output) stay separate families, not `practices-*`; they sit at the practices level for the direction rule | Owner, 2026-09-25: "ops-* is separate (for tickets and stuff). presentation-* is separate too". |
| Board home: project `shravan-developer-workflows` (`01a0d9c3-1e9d-7b70-8880-06c89c6391c2`), board `Plugin and skill work` (`01a0d9c3-3b24-7212-a71b-df57bcdda357`), one topic per workstream | Owner created the project on 2026-09-25; Main chose board and topic layout. |
| peekaboo and non-dev-workflow plugins are out of scope | Owner, 2026-09-25. |

## Runs in sequence

One target per run. Paths beneath `plugins/shravan-dev-workflow/skills/` unless stated. "Consumers" means every active file naming the old name, inventoried at `2ac1ff5d` with hidden directories included.

Prerequisite (not a skill run): **eval harness repair** in `tests/skills/lib/skill-pressure-evaluation/`. Diagnose the non-interactive permission stop and run with `SKILL_PRESSURE_CODEX_PATH` for the quarantine workaround, keeping the read-only subject and permission boundary. Proof: one existing tracker scenario runs live end to end with a recorded source-read event, plus `pnpm --dir tests/skills run test` and typecheck. This proves the harness operates, not any practice or phase behavior.

| # | Target | Class | Change | Proof |
| --- | --- | --- | --- | --- |
| 1 | `agent-collaboration` (codex-router `agent-skills/agent-collaboration`, re-vendored to `plugins/agent-router`) | behavior-changing | remove every when/why sentence, seat meaning, and resolution rule; keep calls, identity, seat values, listen/wait, wakes, schedules, uncertain-mutation recovery; drop the tracker name; new description above | trigger scenario `tool-manual-vs-practice-routing`; `diff -r` vendored copy vs pinned SHA |
| 2 | `practices-collaboration` (new) | behavior-changing (create) | teaching owners above; returns `no-home: <gap>` | scenarios `no-board-owner-away-continues`, `listen-not-poll`, `sidekick-uses-assigned-root`, `worker-returns-evidence` |
| 3 | `practices-show-me-your-work` (rename) | behavior-changing (trigger + rename) | new description; drops orchestrator and `manage-agents` names; consumers: `AGENTS.md`, plugin `README.md`, `manage-agents/SKILL.md`, `orchestrator-design/SKILL.md`, `orchestrator-implementation-goal/{SKILL.md,README.md,references/goal-contract-and-routing.md}`, `agents/openai.yaml`, `.codex-plugin`, `.claude-plugin`, `.cursor-plugin` manifests, `tests/skills/lib/minimal-planning-delivery-contract.test.ts`, `tests/skills/pressure-scenarios/README.md`, both orchestrator `cases.ts`, the tracker scenario directory, `agent-collaboration/references/message-board.md` (removed in run 1) ; wip trace folder and transfer replace the memory-logs unshared checkpoint | existing tracker scenarios renamed and rerun live; new `new-session-opens-trace-before-editing`, counterexample `routine-edit-no-trace` (typo fix, then the same with an explicit trail request), `owner-away-wip-folder`, `preboard-sidekick-own-file-then-transfer` |
| 4 | `manage-agents` | behavior-changing (restructure) | shape above; drop `research-workflow`, `spec-design`, `skills-creation` names; fix stale "Delegate"/"Terra" vocabulary; target about 200 lines | existing manage-agents scenarios rerun live; `reasoning_effort` adapter note checked against a live `acpx set` |
| 5 | `practices-research` (rename) | behavior-changing (trigger + rename) | new description; consumers: `AGENTS.md`, plugin `README.md`, `discuss-clarify-mental-models`, `discuss-pathfinding`, `program-design`, `skills-creation`, `spec-design` `SKILL.md`s, `agents/openai.yaml`, `.codex-plugin` (lines 37, 89) and `.claude-plugin` manifests, `tests/skills/lib/spec-program-design-user-requirements-contract.test.ts`, pressure README, the research scenario directory; ledger path `tmp/research-workflows/` becomes `tmp/practices-research/` (`SKILL.md:28`, `references/evidence-ledger.md:3`, `references/lane-packets.md:18`); phase-name routing at `SKILL.md:32` becomes tokens | renamed scenarios rerun live; new `renamed-research-invocation` |
| 6-22 | each phase skill, one run each: `discuss-pathfinding`, `discuss-clarify-mental-models`, `spec-design`, `program-design`, `spec-program-review`, `plan-implementation`, `plan-improve-repo`, `implement-plan`, `implementation-review`, `implementation-pr-wrapup`, `spec-handoff`, `plan-handoff`, `implementation-handoff`, `docs-maintain`, `debug-investigation`, `skills-creation`, `skill-audit` | behavior-changing | trace entry line and completion line; upward names and caller loads become return tokens | static layering check per run; representative live scenarios `implementation-review-direct-entry-opens-trace` and `spec-program-review-returns-specification-gap` (review-only request ends at the return); the other 15 phases carry the owner-accepted gap "pattern observed in two representative phases; not evaluated per phase" |
| 23-24 | `orchestrator-design`, `orchestrator-implementation-goal` | behavior-changing | start the trace through `practices-show-me-your-work`; map return tokens to skills, including the `plan-defect` and `ready-for-review` discriminators; commission through `manage-agents`; `orchestrator-implementation-goal` takes the terminal-default rule from `canonical-implementation-plan.md:51` | existing orchestrator scenarios rerun live |

Integration companions (not separate runs; each lands in the same PR as the run that owns it):

- `shared-references/phase-return-tokens.md` (new): lands with run 6, the first phase run in PR 2; consumed by every phase run and runs 23-24. Proof: static layering check plus run 10's (`spec-program-review`) representative scenario.
- `shared-references/requirements-specification-program-design.md`: routing at lines 21, 76, 82 becomes tokens; lands with run 8 (`spec-design`). Proof: static layering check.
- `shared-references/canonical-implementation-plan.md`: line 51's orchestrator terminal default moves to run 24; the `originating planner` field stays. Lands with run 11 (`plan-implementation`). Proof: static layering check.
- Consumer-declaring references (`humanizer.md`, `diagram-semantics.md`, `mermaid-usage.md`, `markdown-presentation-baseline.md`, `diagram-rendering-and-fallbacks.md`, `generated-document-visuals.md`) are unchanged under the DAG rule.

Companions:

- devfiles `shared/my_agents.md`: Behaviors, short Concepts, Practices block, skill index with token rows, host note; emoji-once rule; remove the long board section it replaces. One private PR paired with ai-tools PR 1: swaps `track-show-me-your-work` (today at `my_agents.md:127,293,315`), adds the Practices block and the skill index with token rows, merged and applied together with PR 1's plugin install. Proof: manual exercise in a fresh Cursor session and a fresh Codex session with a qualifying prompt, a routine-edit prompt, and a no-listed-skills host; transcripts inspected.
- Repo docs: `AGENTS.md` skill table and layer description, plugin `README.md` namespace map, changelog, versions.
- Cursor skill discovery: investigate why cached plugin skills were not auto-listed; fix, or keep the host note as the recorded workaround.

## Authoring basis and proof plan

Basis: user-directed intent, informed by the session's observed failure (no trace recorded) and the two 2026-09-25 audits. No RED is claimed for the historical incident.

Structural proof (every PR): layering check that classifies each skill-name occurrence in active skills and shared references as load, route, commission, consumer declaration, or data value, and finds no upward or cyclic load, route, or commission edge; renamed-name search, including hidden directories, returns only history; each PR head passes `pnpm --dir tests/skills run test`, typecheck, and `claude plugin validate .` on its own.

Behavior proof: the scenarios named per run, run live once the harness prerequisite lands, with flagged transcripts read by hand. Claims stay on the ladder in `skills-creation/references/testing/pressure-testing.md`: drafted-from-intent until a live run, then observed in named scenarios. Phase runs carry the owner-accepted representative gap above. If the harness repair fails, every behavior claim reports "drafted from user intent; behavior not yet evaluated" with the permission-stop cause as the named gap. Release proof per PR: validate the PR head, then check that the paired devfiles prompt names only skills present in that head.

## Security and platform

| Surface | Runs | Decision | Required proof |
| --- | --- | --- | --- |
| Package scripts and subprocess behavior (eval runner) | harness prerequisite | allowed; read-only subject, no weakened permission boundary | deterministic unit tests for argument building plus one live run |
| Third-party source adoption (re-vendor from codex-router) | 1 | allowed; owner-owned repo, verbatim copy at a pinned SHA | `diff -r` against the pin |
| Shell commands documented in a tool manual | 1 | allowed; documentation only, no executable resource added | static |
| Installed cache refresh and home-level writes (plugin reinstall, `chezmoi apply`) | ship | deferred to an explicit post-merge step; devfiles uses `chezmoi diff` then targeted apply | readback of installed version |

Plugin manifests and versions follow `skills-creation/references/platform-mechanics.md`.

## Coordination

- ai-tools branch base: `main` at `2023f3f1`. Two stacked PRs at most (owner, 2026-09-25), each validating on its own head:
  - **PR 1** (`feat/capability-revamp`): this spec, the harness prerequisite, and runs 1-4 with every tracker consumer (re-vendor after codex-router's run 1 PR merges, at its SHA); paired with the single devfiles PR.
  - **PR 2** (stacked on PR 1): run 5 with every research consumer, runs 6-24, and the integration companions. devfiles names no research skill today, so PR 2 needs no devfiles pairing; the devfiles skill index carries the token rows from PR 1 onward.
- One worktree per PR.
- Installation pairing: a plugin release and its paired devfiles PR are applied in the same step (plugin reinstall, then targeted `chezmoi apply` of `shared/my_agents.md`), and no new agent session starts until both are done; no shim keeps old names alive.
- Versions: next minor of `shravan-dev-workflow` per PR; `agent-router` minor for the re-vendor. Changelog entry per PR.

## Open owner decisions

None. Board project, PR grouping (owner: "make worktrees and prs"), and the ops/presentation families were settled on 2026-09-25.

## Non-goals

Model matrix changes; peekaboo and other plugins; removing ACPX before agent-router covers every provider; extracting gh/Linear/observability tool manuals out of their skills.

## Spec-review record

- Revision 1: GPT-6 Sol high 🔎 Review Sidekick (ACPX session `01a0d98f-2079-7d22-a0df-e8d50c70812b`). Checks: mental-model-fit complete, trigger-routing blocked, rule-agreement complete, depth-coverage blocked. Verdict `significant-rewrite`, decision `restart`. Accepted: entry branches, layer route, run boundaries and cutover, proof allocation. Rejected: line count. Owner authorized a second review by the same lead on 2026-09-25.
- Revision 2 (`f74cdcf0`): same lead, owner-authorized second review. All four checks complete. Verdict `targeted-revision`, decision `revise-first`. Accepted: shared-reference rule scope, pre-board 🐒 Sidekick path, release boundary and non-skill runs, tracker clauses and token discriminators and phase proof. Rejected: line count, cache age, naming style. Owner decisions 2026-09-25: DAG rule for shared references; wip folder then transfer; representative phase proof accepted.
- Revision 2.1 (`a6b9cd65`): lead verification returned `targeted-revision`, findings 1-4 partly resolved; new issues: merged run 2/3 row, `product-code` classifier, transfer authorship. Stopped at `review-permission-required`; owner authorized one more bounded fix round with lead verification on 2026-09-25.
- Revision 2.2 (`b134213b`): lead verified all five open items resolved, no new issues. Verdict `great`, implementation decision `accepted-to-implement`. Proof boundary: planned live scenarios, per-PR validation, owner-accepted gap for 15 phases.
