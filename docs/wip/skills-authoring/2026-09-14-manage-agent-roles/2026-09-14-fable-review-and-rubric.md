# Review of the agent-coordination changes, with a selection rubric

Date: 2026-09-14. Author: Fable 5.1 session (design mode, read-only against skills). Status: review and proposal for owner decision; nothing here is implemented. Companion to `proposal.md`, `cohesion-proposal.md`, `remaining-skills-plan.md`, and `../2026-09-13-efficient-agent-coordination/spec.md`.

## 1. What was reviewed

Read in full this session: devfiles PR #4 (`shared/my_agents.md`), ai-tools PR #72 (manage-agents and callers, on this worktree at `f47584d` plus the uncommitted Reviewer-table edit), codex-router PR #57 (canonical `agent-collaboration`), the 30-skill token-efficiency audit, spec draft B and its pressure-test handoff, the session-identity evidence, and the current `implement-plan`, `orchestrator-implementation-goal`, `implementation-review`, `spec-program-review`, `program-design`, `research-swarm`, and PR-wrapup monitor references. Codex source checkout at `ac192cd` (2026-09-06) for native multi-agent tools. Three bounded research lanes (Sonnet, web collection only) under `scratchpad/research/lane{1,2,3}-*.md`; the parent opened the load-bearing sources named in section 5.

## 2. The problem in one picture

The token burn is not caused by the worker transport. It is caused by four instructions that route expensive work to the main agent:

```text
leak                         where                                   effect on a Frontier main
──────────────────────────── ─────────────────────────────────────── ───────────────────────────────
main codes by default        implement-plan/SKILL.md:22,             every orchestrated goal ends
                             execution-and-proof.md:34               with the driver writing code
main reads everything        implementation-review:24,               same bytes read by main, then
                             spec-program-review:133                 reviewers, then main again
ceremony per call            manage-agents step 0 + step 3 + ledger  hundreds of output tokens of
                             (now reduced in #72 for follow-ups)     ritual per dispatch
main waits by polling        no skill says "wait, don't loop"        each check re-pays the cached
                                                                     read of the whole context
```

Every main-agent turn pays a cached read of its whole context (six credits at 300k on Codex). The rail that matters is fewer main turns on a small main context, not only a cheaper model.

## 3. Assessment of the committed changes

| PR | Supported | Concern |
|---|---|---|
| devfiles #4 | Frontier coordinator never edits source or docs; Workers execute inline and do not re-delegate; manual proof reconciled with automated real-path proof; driver identity from harness metadata or owner declaration; per-repo commit/push authority. | Binds only "the main Frontier coordinator". A Balanced driver (Sol medium, Astra low) is uncovered and `implement-plan` still tells it to code inline. |
| codex-router #57 | Cache policy has one owner (manage-agents); collaboration owns Router operations only; `conversation prompt --new` correctly not sold as a launcher. | none |
| ai-tools #72 | Worker and Reviewer replace Delegate; 26-minute Codex maintenance with "active resets the clock"; first-assignment packet, concise follow-ups; Reviewer cross-lineage; emoji display names. | See items below. |

Findings against #72 and the plan, in leverage order:

1. **`implement-plan` still defaults to inline.** Item 2 of `remaining-skills-plan.md`, untouched. After these PRs merge, delegation under a goal still does not happen. This is the single largest lever.
2. **Sol removed from execution tables.** #72 Sidekick and Worker tables on Codex list Terra medium and Luna xhigh only; `proposal.md` says the latest instruction superseded Sol. Owner now states Sol low and Sol medium are strong execution choices and Sol low is sometimes better. Section 4 restores Sol through task category rather than a ranking.
3. **Sidekick may no longer be a native child.** #72: "do not substitute a native child merely because its model is available". Spec D5 and the owner's "subagents are fine as long as they work" say native is acceptable. A native child has a stable thread id, follow-up, interrupt, wait, and a host-enforced depth limit; a separate conversation buys the drawer and survival past the parent at the cost of a second full Codex process. Decision D2 below.
4. **Two selection rules coexist.** "Capability Economics: cheapest at or above the pattern floor" and "the harness sets execution preferences" both claim to pick the model. The rubric replaces the first; the harness sentence then picks lineage only. "Frontier is never a default where a table spans categories" is dead text once no execution table has a Frontier row.
5. **Reviewer lineage rule is flat; evidence says it is directional.** Section 5. Correction: same-family review always for Codex-authored work (cheap, measured gain); add Claude for large or risky changes (measured gain); on Claude-authored work do not add a Codex reviewer (measured loss); use a second Claude context or Grok instead.
6. **Native tool names.** `native-providers-codex.md` documents the V2 set (`spawn`, `followup_task`, `send_message`, `interrupt_agent`, `wait`, `list_agents`) then hedges toward the V1 set (`spawn_agent`, `send_input`, `wait_agent`, `resume_agent`, `close_agent`). Both exist in source behind separate flags; this machine has `multi_agent = false` and `multi_agent_v2` enabled, so V2 is what the model sees here, while a stock install gets V1 by default (`features/src/lib.rs` Collab `default_enabled: true`, MultiAgentV2 `default_enabled: false`; `config/mod.rs:1554` selects exactly one). The reference should say: check `codex features list`, V2 when enabled, else V1. `agents.max_depth` defaults to 1, so Codex enforces "workers do not re-delegate" itself.
7. **Waiting rule is still implicit.** #72 says "do not run a repeated model-turn polling loop" but no phase skill says what to do instead: on Codex, `wait` (V2) or `wait_agent` (V1) with a timeout; on Claude, the harness notification; on Router, a wake. One sentence in `orchestrator-implementation-goal` and `implementation-pr-wrapup` each.
8. **Uncommitted edit:** Reviewer Terra medium to high in the worktree. Consistent with "review needs more thinking"; note it is uncommitted.

## 4. Selection rubric: task category, then role, then model

Guidance test: the packet is *guided* when the parent can write all five of exact files, steps, expected result, validation command, and stop condition. Otherwise it is *judgment*. Role is chosen by continuity (one assignment: Worker, Reviewer, Operator; continuing: Sidekick, Advisor). Design is never assigned.

| Task category | Role | Codex | Claude Code | Cursor | Move up when | Evidence |
|---|---|---|---|---|---|---|
| Operate: run, build, watch, scrape, group | Operator | Luna high | Opus low | Grok medium | Operator returns "undecided"; judgment routes to parent | owner |
| Execute, guided | Worker | Luna xhigh | Opus low | Grok medium (unproven) | worker reports uncertainty, or the packet reveals coupling | lane 1 (Luna on narrow packets; practitioner escalation policy); Opus low unverified fetch |
| Execute, judgment | Worker or Sidekick | Terra medium default; Sol low when packet is tight and repo is clean; Sol medium when first-try fidelity matters | Opus medium | Grok medium (unproven) | Terra needs a second fix pass on the same slice | owner; lane 1 ("Sol medium if Terra needs too many fixes"; CodeRabbit: Terra 40.7% pass at 55,594 output tokens vs Sol 63.7% at 20,968, effort unstated) |
| Research, collect | Worker | Luna xhigh | Opus low | Grok medium | synthesis needed | inference |
| Research, synthesize | Worker | Terra medium or Sol low | Opus medium | Grok medium | conclusion is load-bearing: add a countercheck lane | research-swarm |
| Review, small or routine | Reviewer x1 | same family: Terra high or Sol medium, native child | Opus medium | Grok high | change touches auth, data, money, deletes, public contracts | lane 2 |
| Review, large or risky | Reviewer x2, parallel, same packet | one same-family (above) plus Opus medium over ACPX | one Opus plus one Grok high; not Codex | Grok high plus Opus | high risk: add an adversarial pass naming the specific risk | lane 2 |
| Design and decisions | main agent with owner; Advisor only when owner chooses | Astra medium or high | Fable | n/a | n/a | owner |

Rules the rubric carries:

- No max tier for any worker or reviewer (owner: overthinking). Sol xhigh subagents are sourced as unusably slow (openai/codex#32247, open).
- Frontier drivers (Astra medium or high, Fable) never edit source or docs. Balanced drivers: decision D3.
- A Worker executes inline and never re-delegates; Codex enforces depth 1.
- The parent verifies a receipt by reading the diff hunks and the verbatim proof output and checking write scope. It does not re-read the worker's sources. If it cannot judge from diff plus proof, the packet lacked a stop condition or proof command; fix the packet, not by parent execution.

## 5. Evidence and verification status

| Claim | Source | Parent verified |
|---|---|---|
| Same-family review catches ~52% of high-severity bugs vs ~61% cross-family; effect is within bug category | Greptile dataset via howardism.dev (two 500-PR sets, ~1,500 bugs; vendor ground truth, unreleased) | yes, opened |
| Claude reviewing Codex drafts: 71.6% to 89.7%; Codex self-review: to 84.5%; Codex reviewing Claude drafts: 91.4% to 82.8% | arXiv 2607.21656, 116 LiveCodeBench tasks, controlled | yes, abstract opened |
| Homogeneous LLM review pipelines echo correlated errors | arXiv 2603.25773 (directional, planted bugs) | yes, abstract opened |
| Terra pass rate and output tokens vs Sol | coderabbit.ai benchmark blog | yes, table opened; effort level not stated |
| Sol xhigh subagents unusably slow | openai/codex issue 32247 | yes, open issue |
| Opus 5 low matches or beats Sonnet 5 high on discrete tasks | r/ClaudeAI thread | fetch blocked; unverified |
| GPT-5.6 cache TTL 30 min only; cache writes billed 1.25x on API | developers.openai.com prompt-caching guide | lane 3 primary fetch; Codex-quota treatment of writes not established |
| Claude Code main 1 hour only on subscription within plan usage, else 5 min; subagents 5 min in all billing modes | code.claude.com prompt-caching doc | lane 3 primary fetch |
| Codex V1 vs V2 tool sets and flag defaults; depth default 1 | codex-rs `features/src/lib.rs`, `config/mod.rs:1554`, `agent/registry.rs:91`; local `codex features list` | yes |

Gaps: no A/B of Sol low vs Terra medium anywhere; no user reports for Opus medium or Grok medium as workers; no independent study of "same plus cross" vs "cross only" reviewer setups; no measurement of the 26-minute policy on the actual Codex route.

## 6. Per-harness cache and waiting table

| Harness | TTL | Persistent worker | Keep-alive | Wait primitive |
|---|---|---|---|---|
| Codex (GPT-5.6) | 30 min | native child (D2) or Router session when owner wants a drawer | 26 min, only if the session will be resumed in the next window and is not busy; otherwise let it expire | `wait` (V2) or `wait_agent` (V1) |
| Claude Code main | 1 hour within plan usage | n/a | none until ~50 min | harness notification |
| Claude Code subagent | 5 min | never; persistent workers from Claude are Codex sessions over ACPX or Router | never | harness notification |
| Cursor | provider default | treat as Codex rules for pattern choice | none | native |

A keep-alive is a real agent turn on every harness; there is no cache-touch primitive. Cache expiry never ends a relationship.

## 7. What can change, by owner

| Surface | Change | Run |
|---|---|---|
| `implement-plan` | coordinator assigns, assigned executor works inline; serial delegation allowed; drop the inline default | S4 |
| `manage-agents` | replace Capability Economics with the rubric; restore Sol rows; directional Reviewer rule; Sidekick transport per D2; V1/V2 tool note; waiting rule | S1 follow-up |
| `orchestrator-implementation-goal`, `implementation-pr-wrapup` | one-sentence waiting rule; one Operator owns a watch; reconcile 120s/180s cadence | S5, S11 |
| `implementation-review`, `spec-program-review` | reviewer count by change size; coordinator read bounded to diff plus anchors (option A) or Balanced coordinator (option B, D4) | S9, S10 |
| `program-design` | explorer lane before parent reconstruction | S8 |
| `my_agents.md` | extend the no-edit rule per D3; point at the rubric | companion |

## 8. Decisions needed from the owner

- **D1 Sol low signal.** When is Sol low better than Terra medium? No source answers this; only owner experience does. The last concrete case decides the row.
- **D2 Sidekick transport.** Keep #72's "always a separate conversation", or allow a native child when only the parent steers it, with a Router session when the owner wants a drawer or the worker must outlive the parent. Recommendation: allow native.
- **D3 Balanced driver under a goal.** Same no-edit rule as Frontier once an orchestrated goal is open, with one bounded slice inline only when no goal is open; or no exception at all. Recommendation: the first.
- **D4 Review coordination.** A: parent coordinates with a read bounded to diff plus anchors. B: Balanced Sidekick coordinates, parent verifies accepted findings and samples rejections. Recommendation: A now, B after delegation is proven working.
- **D5 Design-cycle reviews.** Collapse spec-only and program-only reviews into the three-artifact review when `orchestrator-design` runs the whole cycle. Recommendation: yes.
- **D6 Reviewer rule.** Accept the directional correction in finding 5 over the flat cross-lineage rule.
