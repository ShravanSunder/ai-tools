# Capability revamp: layers, practices, and the session path

Revision 2 (draft; revises Revision 1 after its `significant-rewrite` review). Main-authored multi-run skill-change spec. Owner plugins: `shravan-dev-workflow` and `agent-router` (vendored from codex-router). Companion changes: devfiles `shared/my_agents.md`, codex-router `agent-skills/agent-collaboration`, and the `tests/skills` eval harness.

## Problem and evidence

Sources are current source at `2ac1ff5d` unless labeled. "Session transcript" means Cursor conversation `052d2269-364f-46e9-9269-05bf52bc2adc` (2026-09-23/25).

- No trace reached a board during the session (session transcript: 🐒 Sidekicks reported no board project and skipped tracking; Main never opened a trace). Only the two orchestrators invoke the tracker (`orchestrator-design/SKILL.md:19`, `orchestrator-implementation-goal/SKILL.md:20,37`); the phase list in this spec never mentions it (verified by the Revision 1 reviewer).
- No board project exists for ai-tools: `agent-collaboration board project list` on 2026-09-25 returns four projects (perseus-agent, coordination-platform, Relay Tasks, Chief of Staff), none for this repo.
- The devfiles start trigger is conditional and buried (`shared/my_agents.md:307`). The tracker description fires on trail requests, orchestrator runs, or multi-component work (`track-show-me-your-work/SKILL.md:3`); `agent-collaboration` says "every real orchestration coding session" (`agent-collaboration/SKILL.md:3`).
- Cursor did not auto-list any `shravan-dev-workflow` skill although the plugin cache holds them (`~/.cursor/plugins/cache/shravansunder-ai-tools/shravan-dev-workflow/<hash>/skills/`); the owner attached skills by hand (session transcript). Cause not investigated.
- The graph has upward and two-way names: `agent-collaboration/references/message-board.md:3` names the tracker; `track-show-me-your-work/SKILL.md:3` names both orchestrators; `manage-agents/SKILL.md:194` names `research-workflow` while `research-workflow/SKILL.md:25` commissions through `manage-agents`; `research-workflow/SKILL.md:3,32` name phase skills; `shared-references/requirements-specification-program-design.md` names `spec-design`, `program-design`, `discuss-pathfinding`; `canonical-implementation-plan.md` names `plan-implementation` and `orchestrator-implementation-goal`; `humanizer.md` names `spec-design`, `program-design`, `skills-creation`.
- `agent-collaboration` mixes tool usage with policy: "Always use a shared message board in every real orchestration coding session" (`SKILL.md:14`), seat meanings and resolution rules (`references/message-board.md:13-40`).
- `manage-agents/SKILL.md` is 362 lines. A whole-skill evaluation (Opus 5.5 high 🔎 Review Sidekick, session transcript) returned `significant-rewrite`: rules stated 3-9 times, run-on paragraphs over 600 characters, two organizing principles. Its Waiting section (`SKILL.md:334`) is collaboration policy.
- Live behavior evals did not run in PR #92: non-interactive ACPX stopped a subject with "Permission prompt unavailable in non-interactive mode" although the runner passes `--approve-reads` (`tests/skills/lib/skill-pressure-evaluation/agent-execution/acpx-codex-agent-runner.ts:193-211`; receipt `tmp/agent-packets/luna-workhorse-implementation.receipt.md:32-37` in the main checkout). The subject prompt already points at repo-local source (`render-subject-prompt.ts:102-107`). Separately, today the adapter's `@openai/codex` npm dependency is quarantined by the corporate registry; `CODEX_PATH` to the local CLI works around it (session transcript). Exact cause of the permission stop: undiagnosed.

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
| Qualifying task, no board project or no access | Main | ask the owner once which project to use or create; in the same turn start an explicitly unshared checkpoint in `~/dev/memory-logs/work-trails/<repo>/<work-label>/` | keep working; only work that needs another agent's board-mediated reply waits; reconcile to the board when one exists | ask-once: `practices-collaboration` (returns `no-home: <gap>`); checkpoint and reconcile: `practices-show-me-your-work` |
| Routine small edit | Main | no trace | if a work thread is already in context and the edit changes its state, post the outcome there | `practices-show-me-your-work` |
| Phase skill invoked directly, no work reference in context, task qualifies | Main | phase entry step opens or resumes the trace before phase work | phase completion step records the checkpoint | each phase `SKILL.md` (one entry line, one completion line) |
| Assigned implementation | 🐒 Sidekick | use the supplied execution root; never open a coordination root | post assignment discussion and proof there; checkpoint the assignment; never resolve the coordination root | `practices-collaboration` (seats); `practices-show-me-your-work` (checkpoint) |
| Commissioned review | 🔎 Review Sidekick | use the supplied root if posting is authorized; otherwise none | return the review result to the commissioner | `practices-collaboration` |
| Bounded task | 🛠️ Worker, 🔧 Operator | no trace | return evidence to the owner; post only with explicit authority | `practices-collaboration` |
| Host does not list the plugin's skills | any | read `SKILL.md` from the most recently modified match of the host cache: Cursor `~/.cursor/plugins/cache/*/shravan-dev-workflow/*/skills/<name>/`, Codex `~/.codex/plugins/cache/ai-tools/shravan-dev-workflow/*/skills/<name>/`, Claude `~/.claude/plugins/cache/ai-tools/shravan-dev-workflow/*/skills/<name>/` | none found: tell the owner `skill unavailable: <name>` and follow the devfiles Practices block without it | devfiles host note |

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
  presentation-tui · presentation-webui · ops-linear-tracking · ops-observability-stack · ops-security-review (stand alone)
Tool manuals    how to operate a tool; no when or why
  agent-collaboration (vendored) · native spawn and Router mechanics (references owned by manage-agents until extracted)
Shared references  name no skill; phases and orchestrators load them
```

Direction rule: a skill names skills in its own layer (acyclic) or below, never above. Devfiles is the session root outside the layers and may name any skill.

Edges this rule forces:

- `manage-agents/SKILL.md:194` drops its `research-workflow` pointer (run 4); `practices-research` keeps commissioning through `manage-agents`.
- Role names, emoji, and the title format stay owned by `manage-agents`. `practices-collaboration` applies the title the commissioner supplies and does not name `manage-agents`.
- `practices-collaboration` returns `no-home: <gap>`; `practices-show-me-your-work` owns the unshared checkpoint. The lower practice never names the higher.

**Phase return tokens.** A phase or shared reference that must send work elsewhere returns a token with its payload instead of naming a skill. Vocabulary lives in a new shared reference `shared-references/phase-return-tokens.md` that names no skill:

| Token | Payload | Replaces today |
| --- | --- | --- |
| `requirements-gap` | the missing owner meaning, evidence | route to `discuss-pathfinding` |
| `specification-gap` | the missing observable obligation, evidence | route to `spec-design` |
| `program-design-gap` | the structural gap, evidence | route to `program-design` |
| `ready-for-planning` | reviewed design identities | route to `plan-implementation` |
| `plan-defect` | plan anchor, defect, evidence | route to planning |
| `ready-for-implementation` | plan path and revision | route to `implement-plan` |
| `ready-for-review` | diff, proof, assessment | route to `implementation-review` or `skills-creation` |

Resolver: when an orchestrator invoked the phase, the orchestrator maps the token to the next skill in its own `SKILL.md`. When the phase ran directly, Main maps it through the devfiles skill index, which carries the same seven rows. The Specification vs Program Design distinction in `requirements-specification-program-design.md:21-25` survives as two tokens.

## Session path (what devfiles loads and why)

```text
devfiles shared/my_agents.md
├── Behaviors                 unchanged Soul, trimmed where it repeats skills
├── Concepts (short)          the vocabulary the skills below assume, including "qualifying task"
├── Practices (top): at entry, before other work, by the Session entry map
│     1. qualifying task? load practices-collaboration; find the board thread; none -> ask once and continue
│     2. load practices-show-me-your-work; open or resume the trace (unshared checkpoint when no home)
│     3. record decisions, evidence, and outcomes as you work; checkpoint when you stop
│     4. delegate through manage-agents; coordinate through practices-collaboration
│     5. contributors: 🐒 Sidekick uses its assigned root; 🛠️ Worker and 🔧 Operator return evidence
├── Skill index               situation -> orchestrator or phase skill; phase return token -> next skill
└── Host note                 exact cache paths from the entry map; `skill unavailable: <name>` when none
```

## Proposed descriptions (trigger surface)

- `agent-collaboration`: "Use when operating the agent-collaboration CLI or MCP: identity and sessions, listing or searching projects, boards, topics, and threads, posting or reading messages, inbox, listen and wait, wakes and schedules, or recovering an uncertain mutation. Covers how to call the tool, not when or why to coordinate."
- `practices-collaboration`: "Use at the start of a qualifying task to find the repository's board project and work thread, and whenever agents coordinate: commissioning or messaging another session, choosing a message or a board post, seat meanings, waiting on another agent, or when no board project exists. A qualifying task spans sessions, commissions another agent, crosses components, or makes a decision someone will later inspect. Not for tool syntax."
- `practices-show-me-your-work`: "Use at the start of a qualifying task to open or resume the work trace; when recording a decision, evidence, blocker, or outcome; when stopping or handing off; or when the user says show me your work or asks for a trail or history. A qualifying task spans sessions, commissions another agent, crosses components, or makes a decision someone will later inspect. Not for routine small edits unless a trail is requested."
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

`practices-show-me-your-work`: `SKILL.md` keeps open/resume, publish, checkpoint, resolve, and the unshared fallback with reconcile (tracker `SKILL.md:18-40`, moved not rewritten); `references/markdown-view.md` stays (drops its `manage-agents` name). The board-discovery and seat text moves to `practices-collaboration`.

`manage-agents`: `SKILL.md` keeps one Authority section, roles and title format, selection by table, runtime (native, Router; ACPX in `references/acpx-legacy.md`), handoff and verify. Model tables move to `references/model-catalog.md` (MUST load at selection). Waiting moves out as above.

## Decisions (owner may strike any row)

| Decision | Rationale |
| --- | --- |
| Layers are Orchestrators, Phases, Practices, Tool manuals, plus name-free shared references | Owner, 2026-09-25: layer by the role a skill plays. |
| New `practices-*` family: `practices-show-me-your-work` (renames `track-show-me-your-work`), `practices-research` (renames `research-workflow`), `practices-collaboration` (new) | Owner naming, 2026-09-25. Hard cutover; no aliases. |
| No board or owner away: ask once, keep working with an explicitly unshared checkpoint, reconcile later | Owner, 2026-09-25 (this review round). Preserves today's tracker fallback (`SKILL.md:34-38`). |
| `practices-collaboration` owns where work lives and how agents coordinate; `agent-collaboration` owns only tool operation | Owner: the tool skill is "just about how the tool works". |
| `practices-show-me-your-work` owns the trace; "show me your work" means reading it | Owner: showing work is part of creating the trace. |
| One qualifying-task predicate shared by devfiles and both practice descriptions | Revision 1 review: "every task" vs "substantial" gave two readings. |
| Phase return tokens with payloads, resolved by the invoking orchestrator or by Main through the devfiles index | Revision 1 review: bare tokens lost routing information. |
| Each phase gets one entry line and one completion line for the trace | Revision 1 review: a completion line alone misses directly invoked phases. |
| A rename and every consumer's name swap land in one PR; consumer name swaps ride with the rename run as mechanical edits | Revision 1 review: staged renames shipped a broken intermediate plugin. |
| ACPX stops being a default route: Router for Codex persistent agents; ACPX in one legacy reference until codex-router supports Claude/Cursor model, effort, and titles | Owner intends to drop ACPX; Claude/Cursor Router gaps today. |
| Presentation and ops skills keep their names; classified as practices | Owner named only the three `practices-*` skills. |
| peekaboo and non-dev-workflow plugins are out of scope | Owner, 2026-09-25. |

## Runs in sequence

One target per run. Paths beneath `plugins/shravan-dev-workflow/skills/` unless stated. "Consumers" means every active file naming the old name, inventoried at `2ac1ff5d` with hidden directories included.

| # | Target | Class | Change | Proof |
| --- | --- | --- | --- | --- |
| 0 | eval harness `tests/skills/lib/skill-pressure-evaluation/` | behavior-changing (test infrastructure) | diagnose the non-interactive permission stop; make the subject runner work with the quarantine workaround; no weakened scenario | one existing tracker scenario runs live end to end with a recorded source-read event; `pnpm --dir tests/skills run test` and typecheck |
| 1 | `agent-collaboration` (codex-router `agent-skills/agent-collaboration`, re-vendored to `plugins/agent-router`) | behavior-changing | remove every when/why sentence, seat meaning, and resolution rule; keep calls, identity, seat values, listen/wait, wakes, schedules, uncertain-mutation recovery; drop the tracker name; new description above | trigger scenario `tool-manual-vs-practice-routing`; `diff -r` vendored copy vs pinned SHA |
| 2 | `practices-collaboration` (new) | behavior-changing (create) | teaching owners above; returns `no-home: <gap>` | scenarios `no-board-owner-away-continues`, `listen-not-poll`, `sidekick-uses-assigned-root`, `worker-returns-evidence` |
| 3 | `practices-show-me-your-work` (rename) | behavior-changing (trigger + rename) | new description; drops orchestrator and `manage-agents` names; consumers: `AGENTS.md`, plugin `README.md`, `manage-agents/SKILL.md`, `orchestrator-design/SKILL.md`, `orchestrator-implementation-goal/{SKILL.md,README.md,references/goal-contract-and-routing.md}`, `agents/openai.yaml`, `.codex-plugin`, `.claude-plugin`, `.cursor-plugin` manifests, `tests/skills/lib/minimal-planning-delivery-contract.test.ts`, `tests/skills/pressure-scenarios/README.md`, both orchestrator `cases.ts`, the tracker scenario directory, `agent-collaboration/references/message-board.md` (removed in run 1) | existing tracker scenarios renamed and rerun live; new `new-session-opens-trace-before-editing`, counterexample `routine-edit-no-trace`, `owner-away-unshared-checkpoint` |
| 4 | `manage-agents` | behavior-changing (restructure) | shape above; drop `research-workflow`, `spec-design`, `skills-creation` names; fix stale "Delegate"/"Terra" vocabulary; target about 200 lines | existing manage-agents scenarios rerun live; `reasoning_effort` adapter note checked against a live `acpx set` |
| 5 | `practices-research` (rename) | behavior-changing (trigger + rename) | new description; consumers: `AGENTS.md`, plugin `README.md`, `discuss-clarify-mental-models`, `discuss-pathfinding`, `program-design`, `skills-creation`, `spec-design` `SKILL.md`s, `agents/openai.yaml`, `.codex-plugin` (lines 37, 89) and `.claude-plugin` manifests, `tests/skills/lib/spec-program-design-user-requirements-contract.test.ts`, pressure README, the research scenario directory; phase-name routing at `SKILL.md:32` becomes tokens | renamed scenarios rerun live; new `renamed-research-invocation` |
| 6 | `shared-references/phase-return-tokens.md` (new) | behavior-changing (create) | token vocabulary above; names no skill | static layering check |
| 7-23 | each phase skill, one run each: `discuss-pathfinding`, `discuss-clarify-mental-models`, `spec-design`, `program-design`, `spec-program-review`, `plan-implementation`, `plan-improve-repo`, `implement-plan`, `implementation-review`, `implementation-pr-wrapup`, `spec-handoff`, `plan-handoff`, `implementation-handoff`, `docs-maintain`, `debug-investigation`, `skills-creation`, `skill-audit` | behavior-changing | trace entry line and completion line; upward names and caller loads become return tokens | static layering check per run; representative scenarios `implementation-review-direct-entry-opens-trace` and `spec-program-review-returns-specification-gap` cover the pattern, with the claim boundary named for untested phases |
| 24-25 | `orchestrator-design`, `orchestrator-implementation-goal` | behavior-changing | start the trace through `practices-show-me-your-work`; map return tokens to skills; commission through `manage-agents` | existing orchestrator scenarios rerun live |
| 26 | `shared-references/requirements-specification-program-design.md` | behavior-changing | skill names become tokens | static layering check |
| 27 | `shared-references/canonical-implementation-plan.md` | behavior-changing | skill names become tokens | static layering check |
| 28 | `shared-references/humanizer.md` | behavior-changing | drop the three skill names | static layering check |

Companions:

- devfiles `shared/my_agents.md`: Behaviors, short Concepts, Practices block, skill index with token rows, host note; emoji-once rule; remove the long board section it replaces. Separate private PR. Proof: manual exercise in a fresh Cursor session and a fresh Codex session with a qualifying prompt, a routine-edit prompt, and a no-listed-skills host; transcripts inspected.
- Repo docs: `AGENTS.md` skill table and layer description, plugin `README.md` namespace map, changelog, versions.
- Cursor skill discovery: investigate why cached plugin skills were not auto-listed; fix, or keep the host note as the recorded workaround.

## Authoring basis and proof plan

Basis: user-directed intent, informed by the session's observed failure (no trace recorded) and the two 2026-09-25 audits. No RED is claimed for the historical incident.

Structural proof (every PR): layering check that finds no upward names and no cycles across active skills and shared references; renamed-name search, including hidden directories, returns only history; each PR head passes `pnpm --dir tests/skills run test`, typecheck, and `claude plugin validate .` on its own.

Behavior proof: the scenarios named per run, run live once run 0 lands, with flagged transcripts read by hand. Claims stay on the ladder in `skills-creation/references/testing/pressure-testing.md`: drafted-from-intent until a live run, then observed in named scenarios. If run 0 cannot repair the live route, every behavior claim reports "drafted from user intent; behavior not yet evaluated" with the permission-stop cause as the named gap.

## Security and platform

| Surface | Runs | Decision | Required proof |
| --- | --- | --- | --- |
| Package scripts and subprocess behavior (eval runner) | 0 | allowed; read-only subject, no weakened permission boundary | deterministic unit tests for argument building plus one live run |
| Third-party source adoption (re-vendor from codex-router) | 1 | allowed; owner-owned repo, verbatim copy at a pinned SHA | `diff -r` against the pin |
| Shell commands documented in a tool manual | 1 | allowed; documentation only, no executable resource added | static |
| Installed cache refresh and home-level writes (plugin reinstall, `chezmoi apply`) | ship | deferred to an explicit post-merge step; devfiles uses `chezmoi diff` then targeted apply | readback of installed version |

Plugin manifests and versions follow `skills-creation/references/platform-mechanics.md`.

## Coordination

- ai-tools branch base: `main` at `2023f3f1`. Stacked PRs, each validating on its own head:
  - **P0** run 0 (harness).
  - **A** runs 1-3 with every tracker consumer (after codex-router's run 1 PR merges; re-vendor at its SHA).
  - **B** run 4.
  - **C** run 5 with every research consumer, run 6, runs 7-28.
- Separate worktrees per independent PR; dependent layers use `gh stack`.
- devfiles prompt PR lands after C so it names skills that exist.
- Versions: next minor of `shravan-dev-workflow` per PR; `agent-router` minor for the re-vendor. Changelog entry per PR.

## Open owner decisions

1. A board project for ai-tools: create one or name an existing project. Until then this work keeps an unshared checkpoint per the decision above.
2. PR grouping P0/A/B/C as above.
3. Whether presentation and ops skills join the `practices-*` family now or later.

## Non-goals

Model matrix changes; peekaboo and other plugins; removing ACPX before codex-router closes the Claude/Cursor gaps; extracting gh/Linear/observability tool manuals out of their skills.

## Spec-review record

- Revision 1: GPT-6 Sol high 🔎 Review Sidekick (ACPX session `01a0d98f-2079-7d22-a0df-e8d50c70812b`). Checks: mental-model-fit complete, trigger-routing blocked, rule-agreement complete, depth-coverage blocked. Verdict `significant-rewrite`, decision `restart`. Accepted: entry branches, layer route, run boundaries and cutover, proof allocation. Rejected: line count. Owner authorized a second review by the same lead on 2026-09-25.
- Revision 2: pending.
