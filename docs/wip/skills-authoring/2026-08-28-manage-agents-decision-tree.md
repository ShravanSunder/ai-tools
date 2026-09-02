# Manage-Agents Decision Tree and Vocabulary Cutover

Status: draft r2 — spec-reviewed (two lanes, verdicts: targeted-revision both; findings folded below). Pending user nod on the resolved OD1–OD4, then accepted-to-implement.
Target skill: `manage-agents` (owner plugin `shravan-dev-workflow`).
Classification: update, behavior-changing.
Authoring basis: user-directed intent (settled in the 2026-08-28 design chat; validated by two independent Advisor consults, Sol and Fable, fresh context).
Success definition: an agent loading `manage-agents` routes any subagent job through one four-leaf decision tree using only observable predicates — single-assignment vs persistent, scriptable vs needs-thinking, executes vs guidance-only — lands on the settled default category per leaf, keeps bounded technical decisions with the parent, and keeps every persistent session cache-warm; no taste word ("strategic", "high-stakes", "ambiguous") remains a routing predicate anywhere in the skill tree.

## Canonical Vocabulary

- **single-assignment** — the relationship ends when the assignment's receipt is accepted. An assignment may contain a whole conversation: the parent can correct, steer, and answer questions mid-task. Replaces "one-shot" everywhere; "one-shot" wrongly implies one message.
- **persistent** — the relationship survives across assignments: named, ledgered, kept cache-warm. Replaces "ongoing" / "multi-turn" as the branch label. Duration never decides the branch: a 2-hour CI watch is single-assignment.
- **scriptable** — every step, selection criterion, branch, stop condition, and report shape can be written before dispatch, and the output contains no source edits. Unexpected states come back undecided.
- **needs thinking** — the packet cannot enumerate the steps; the agent must interpret sources, synthesize across them, choose among readings, or make implementation decisions.
- **guidance-only** — the agent returns candidate guidance and never edits or executes; the parent remains executor.

## The Settled Tree

```text
one job
│
Q1  does the relationship persist beyond this assignment?
│
├─ no (single-assignment)
│   Q2  scriptable?
│   ├─ yes ─► OPERATOR   (default Mini — OpenAI Luna high/xhigh)
│   └─ no  ─► DELEGATE   (default Balanced)
│
└─ yes (persistent)
    Q3  does the agent execute the work, or return guidance only?
    ├─ executes      ─► SIDEKICK  (default Balanced — the default for persistent work)
    └─ guidance-only ─► ADVISOR   (Frontier; guidance across components, systems, architecture)

outside the table:
- a bounded technical decision (merge-despite-flaky-test, a wording pick) routes
  to no subagent — the parent decides it
- persistent scriptable work is not a Sidekick — dispatch a fresh Operator per
  assignment
```

Economic rationale (teaches the bifurcation, lives with Capability Economics): persistent sessions run on providers with prompt caching; a warm session makes each resumed turn cheap, a cold resume repays the whole context. Single-assignment agents have nothing to keep warm — discard them. The parent's interaction model: normal coding is done at Balanced; Operator-type work goes to Mini; Frontier is never a default.

## Decisions

| id | decision | notes |
|----|----------|-------|
| D1 | Vocabulary hard cutover: `one-shot` → `single-assignment`, `ongoing`/`multi-turn` (as branch labels) → `persistent`, across `SKILL.md`, all `references/`, cross-skill callers, and pressure scenarios. No compatibility aliases. | Survey inventory below names every hit. |
| D2 | First cut of the tree is single-assignment vs persistent, defined by relationship survival, never duration or message count. | Both Advisor consults independently flagged the duration misreading. |
| D3 | Single-assignment splits on scriptable vs needs-thinking; leaf defaults Operator@Mini and Delegate@Balanced. | Scriptable definition per Canonical Vocabulary — steps AND selection criteria AND report shape; "find relevant refs" is Operator only when relevance is a written criterion. |
| D4 | Persistent splits on executes vs guidance-only. "Across components/systems/architecture" describes the Advisor's problem domain; "never executes" is the routing predicate. | A Sidekick executing a refactor that spans four components is still a Sidekick. |
| D5 | Advisor is persistent-only. A guidance question that closes in one assignment was not Advisor-complex — it routes to Delegate. "Second opinions" moves out of the Advisor prose; a one-time second opinion is a single-assignment Delegate. | User-settled. Inverts the `pattern-selection-unnamed` scenario lock (see Proof). |
| D6 | Bounded technical decisions route to no subagent; the parent decides. Advisor is never a tax on normal decisions. | Replaces the implicit "parent may decide" with an explicit route. |
| D7 | Taste words removed as routing predicates: `SKILL.md` lines 27, 40, 47, 49 change in the same edit or the old routing re-enters through Capability Economics. | Fable blocker B4; Sol blocker 4. |
| D8 | Persistent scriptable work is repeated independent Operators, one sentence in the tree section. | Fable blocker B1; consistent with existing Operator cardinality. |
| D9 | Cache keep-alive: every persistent session is pinged within the provider's cache TTL — 29 minutes as the default ceiling. The ping is runtime-level continuity maintenance, not a work assignment — it is not a job, takes no packet, and is exempt from D8. Home: one rule sentence in `SKILL.md` (Session Keep-Alive under Context And Access); mechanics in `session-ledger.md`, whose existing `last prompt / last checked` slot extends to `last prompt / last ping / last checked`. Sidekick/Advisor sections name warm-cache amortization as why persistent sessions exist. | User-settled 29 minutes; phrase as TTL-with-default-ceiling so the number lives in one place. Ping-as-maintenance and single-home per review findings Sol-I1, Fable-M2. |
| D10 | Tree categories are defaults, not pins — with two bounds: pattern identity never changes during a category move, and every move is bounded by the pattern's own model table. Operator's table is Mini-only and Advisor's is Frontier-only, so those leaves cannot move; "Frontier is never a default" governs the parent's interaction model and the leaves whose tables span categories (Sidekick, Delegate). | Amended per review findings Sol-B1, Fable-I3. |
| D11 | Advisor dispatch predicate is observable at dispatch time: choose Advisor only when the named relationship is expected to survive the current assignment and remain guidance-only. "The problem cannot close in one assignment" is hindsight and does not appear as a routing predicate. | Per review finding Sol-I2. |
| D12 | D5/D6 boundary predicate: the parent decides (no dispatch) when the options and the evidence needed to choose are already in front of the parent; dispatch a Delegate only when the packet names sources the agent must read or synthesize that the parent has not. | Per review finding Fable-I1; replaces "bounded technical decision" as the operative test — the phrase stays only as illustration. |
| D13 | Delegate Frontier escalation clause: a single-assignment judgment whose packet spans components, systems, or architecture may name Frontier for that assignment, bounded by the Delegate table. Keeps the Delegate Frontier rows reachable without taste words. | Per review finding Fable-I2. |
| D14 | Workspace access states its enforcement level. Read-only (advisors, reviewers, any guidance/design-mode agent): enforceable on every runtime and MUST be enforced, not just instructed — native Codex `--sandbox read-only`; Claude Code `--permission-mode plan` or `dontAsk` with read-only allows; Cursor CLI `workspace_readonly` sandbox or plan mode; ACPX `--approve-reads --no-terminal --non-interactive-permissions fail` (fail-closed on writes; the references stop calling this "read-only"). Path-scoped writes ("read all, write only these paths"): enforceable ONLY on native Claude Code (`dontAsk` + `Edit(<paths>/**)` allow rules); Codex, Cursor CLI, and all ACPX routes cannot enforce it — there the packet carries a declared write scope as a bright-line instruction ("edit only under <paths>; any edit outside them is a stop condition, return blocked"), explicitly marked declared, not enforced. When enforcement of a write scope matters, prefer native Claude Code dispatch; the packet `access:` line records `workspace read-only (enforced)` or `write <paths> (enforced | declared)`. | From two research lanes 2026-08-28 (ACPX capability scan; runtime docs). Post-review addition — covered by the whole-skill review before ship. |

## Open Decisions (resolved by both review lanes; pending user nod)

| id | question | resolution |
|----|----------|------------|
| OD1 | Checklist-driven review: Operator or Delegate? | Split rule, both reviewers concur: Operator only when every checklist item has a predetermined mechanical predicate (a command or grep decides it) and a fixed report shape; any read-and-judge item makes the assignment a Delegate. |
| OD2 | Defaults-not-pins? | Yes, with the D10 bounds: pattern identity fixed, moves bounded by the pattern's own model table. |
| OD3 | Invariant wording without the parent tier? | Yes, both reviewers: the invariant must hold on hosts running any tier; the Balanced statement lives in Capability Economics (L5). |
| OD4 | Advisor cardinality when engaged? | Single persistent cross-lineage seat by default, both reviewers. When a bounded consult needs cross-lineage disagreement (advice the parent cannot verify), dispatch single-assignment Delegates to the second lineage rather than making the Advisor a structural pair; a standing pair requires a named reason. |

## Proposed Language

### L1 — "When To Call What" replacement (SKILL.md lines 21–32)

```markdown
## When To Call What

Invariant above every branch: the parent validates every receipt and is the sole voice that reports to the user. No subagent owns a final claim.

Choose the pattern from the job type, before any thought about model or runtime. First cut: does the relationship persist beyond this assignment (persistent), or end when its receipt is accepted (single-assignment)? An assignment may contain a whole conversation — corrections, questions, steering; duration never decides the cut, and a two-hour CI watch is still single-assignment. Second cut differs per side. Single-assignment splits on whether the packet can enumerate the steps, selection criteria, and report shape up front (scriptable) or the agent must interpret, synthesize, or choose (needs thinking). Persistent splits on whether the agent executes the work or returns guidance only.

Two routes outside the table: the parent decides with no dispatch when the options and the evidence needed to choose are already in front of it ("merge despite this flaky test?", a wording pick); dispatch a Delegate only when the packet names sources the agent must read or synthesize that the parent has not. Persistent scriptable work is not a Sidekick — dispatch a fresh Operator per assignment.

| if the job is | then use | good-selection signal | mis-selection trap |
|---------------|----------|-----------------------|--------------------|
| single-assignment and scriptable: running tests or builds, watching CI or PR checks (`gh` watch), monitoring, scraping, grouping logs by a stated key, collecting references by a written criterion | Operator (default Mini) | the receipt is a faithful report of what ran or was found; unexpected states come back undecided; no source edits | asking the Operator to decide relevance, cause, readiness, or next action — split it: procedure to the Operator, judgment back to you |
| single-assignment and needs thinking: a diff review, research with synthesis, an implementation slice, a second opinion | Delegate (default Balanced) | you can write the stop condition in one sentence and discard the agent after the receipt | calling planned implementation scriptable because its steps are listed — implementation choices are thinking |
| persistent work the agent executes: a named co-worker you resume and steer, which also thinks with you — validating, helping, pushing back at the level of the work at hand | Sidekick (default Balanced) — the default for persistent work | a named relationship with a ledger outlives this assignment and stays cache-warm | a Sidekick for a single-assignment job — that is a Delegate; a Sidekick for a scriptable loop — that is repeated Operators |
| persistent guidance across components, systems, or architecture, where you stay the executor | Advisor (Frontier) | the Advisor returns candidate guidance and never edits; the named relationship is expected to survive this assignment | routing a decision the parent can already make to the Advisor; a one-time guidance question is a Delegate |

Selection is done when every job names its pattern and no model has been named yet.
```

### L2 — Advisor section rewrite (SKILL.md lines 46–52 prose)

```markdown
### Advisor
Use an Advisor for a persistent guidance relationship on a problem that spans multiple components, systems, or architecture. Guidance only — the Advisor never executes or edits; you drive the loop. Choose an Advisor only when the named relationship is expected to survive the current assignment; a one-time guidance question is a single-assignment Delegate.

- **Work:** Candidate guidance, reflection, course correction, and completion checks across a problem that outlives any single assignment, while the parent remains executor.
- **Continuity and cardinality:** Persistent named advisor relationship(s) with ledger, kept cache-warm (see Session Keep-Alive).
- **Authority:** The Advisor returns candidate guidance; the parent validates it and decides.
- **Model category:** Frontier
```

Cardinality (per OD4): one persistent named cross-lineage advisor by default. When a bounded consult needs cross-lineage disagreement — advice the parent cannot verify — dispatch single-assignment Delegates to the second lineage; a standing advisor pair requires a named reason.

### L3 — Sidekick prose touch (SKILL.md line 61)

```markdown
Use a Sidekick for persistent work you will resume and steer; a named co-worker with a ledger that does the work and thinks with you — validating, helping, pushing back — at the level of the work at hand. You coordinate and validate the work.
```

### L4 — Delegate prose touch (SKILL.md lines 76–82)

Cardinality line becomes: `Single or Delegate swarm; single-assignment — the relationship ends when the receipt is accepted, and the assignment may contain a conversation.` The work line adds "a second opinion" to the examples.

### L5 — Capability Economics replacement (SKILL.md line 40 and the interaction model)

```markdown
The parent's interaction model sets the defaults: normal coding runs at Balanced — the parent or its Sidekicks and Delegates; scriptable work runs at Mini; Frontier is never a default where a pattern's table spans categories. Category moves keep the pattern and stay inside the pattern's own model table — Operator's table is Mini-only and Advisor's is Frontier-only, so those leaves do not move. Escalate with a named reason the cheaper tier cannot meet: bounded reasoning with clear anchors stays Balanced; a single-assignment judgment whose packet spans components, systems, or architecture may name Frontier for that assignment (Delegate table). "The task feels important" is not a reason — importance routes verification to the parent, not cost to the model.
```

### L6 — Session Keep-Alive (new subsection under Context And Access or session-ledger.md; ledger owns mechanics)

```markdown
### Session Keep-Alive

Persistent sessions ride provider prompt caches: a warm session makes each resumed turn cheap; a cold resume repays the whole context. Ping every persistent session within the provider's cache TTL — 29 minutes as the default ceiling. The ping is runtime continuity maintenance, not a work assignment: no packet, no job, no Operator. A session not worth keeping warm is not persistent: close it and dispatch Delegates or Operators instead.
```

`references/session-ledger.md` owns the mechanics: the row's timestamp slot becomes `last prompt / last ping / last checked`, and the create-or-resume flow checks staleness against the ceiling before reuse.

### L9 — Workspace Access rewrite (SKILL.md "Workspace Access" subsection)

```markdown
### Workspace Access

Every packet's `access:` line states the scope and its enforcement level: `workspace read-only (enforced)` or `write <paths> (enforced | declared)`.

- Reviewers, Advisors, and any guidance-only agent: read-only, enforced — these agents see everything and edit nothing. Native Codex: `--sandbox read-only`. Claude Code: `--permission-mode plan`, or `dontAsk` with read-only allows. Cursor CLI: `workspace_readonly` sandbox or plan mode. ACPX (any provider): `--approve-reads --no-terminal --non-interactive-permissions fail` — fail-closed on writes and exec, which is the strongest ACPX offers; it is not a read-only mount.
- Writers (Sidekicks, Delegates, Operators that produce files): the parent names the write paths. Path-scoped enforcement exists only on native Claude Code (`Edit(<paths>/**)` allow rules under `dontAsk`); prefer it when enforcement matters. On every other route the scope is declared, not enforced: the packet states "edit only under <paths>; an edit outside them is a stop condition — return blocked instead of editing," and the parent verifies the receipt's diff stayed inside the declared scope.
```

Run 2 companion corrections in references: `acpx.md` and provider files stop describing `--approve-reads` as read-only (it is fail-closed on writes); `acpx-provider-claude.md`'s packet line gains the `(declared)` marker; `building-acp-adapters.md`'s cwd-boundary sentence gains "permission-layer, not an OS sandbox."

### L7 — Frontmatter description touch

"for second opinions from another model" stays as a trigger phrase (it should still load the skill) but the body routes it: second opinion → single-assignment Delegate. No description semantics change beyond the body reroute; re-run the trigger matrix to confirm no drift.

### L8 — Operator bright line addition (SKILL.md line 100)

Append "and produces no source edits" to the mechanical-procedure definition; replace "trivial one-shot commands" with "trivial single commands".

## Survey Inventory (bad-word hits, worktree)

`plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md`
- 3: description — "second opinions" (L7)
- 27: taste words, Advisor row (L1)
- 28: "multi-turn", "one-shot" (L1)
- 40: taste words, Capability Economics (L5)
- 47: "strategic, high-stakes, or ambiguous decisions or second opinions" (L2)
- 49: "Strategic advice" (L2)
- 61: "multi-turn", "ongoing co-worker" (L3)
- 80: "one-shot" Delegate cardinality (L4)
- 100: "trivial one-shot commands" (L8)

Cross-skill callers (same hard cutover, Run 3):
- `plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md:122` — "one-shot `Delegate`"
- `plugins/shravan-dev-workflow/skills/skills-creation/references/review/review-lane-workflow.md:21` — "one-shot Delegates"
- `plugins/shravan-dev-workflow/README.md:171` — "one-shot Delegate pattern"

References:
- `references/acpx.md:28` — "one-shot call" (sessionless ACPX invocation sense, not the pattern): Run 2 renames to "single call" so the Run 3 grep gate passes without exemptions.
- No other hits in `job-planning.md`, `agent-job-packet.md` (packet `pattern` enum unchanged), provider files.

Pressure scenarios:
- `tests/skills/pressure-scenarios/shravan-dev-workflow/manage-agents/pattern-selection-unnamed.md` — CONTRADICTION: locks a one-time second opinion to Advisor and forbids Delegate (lines 9, 19, 25–26, 36, 46–47, 56–57). Under D5 this inverts: expected behavior becomes Delegate (Balanced), failure signal becomes affirmative Advisor routing. Regex care per review: drop `advisor` from `expect_decision_regex`/`expect_proof_regex`; forbid scoped affirmative forms like `(second opinion|opinion).{0,80}advisor`, never the bare token — a compliant answer may say "not an Advisor because...".
- `pattern-selection.md:46` — "ephemeral one-shot subagents"; vocabulary update only (line 46 is the only hit; lines 24/36 are clean), locks unaffected.
- `session-ledger-reduction.md` — SEMANTIC rewrite, not vocabulary-only: the prompt names "sidekicks" for what is one review assignment. Under D2 the pattern comes from the job, not the user's word — the compliant answer routes the reviews to single-assignment Delegates (reviewer bright line: fresh context, read-only) and explains the override. Expected-behavior and lock regexes rewritten accordingly; line 39's "call is one-shot" becomes "single-assignment".
- `capability-economics.md` — regexes unaffected by vocabulary; verify `advisor` token in decision regex still matches compliant output after D5.

## Run Allocation

- **Run 1 — SKILL.md cutover:** L1, L2, L3, L4, L5, L8, L9 in one changeset (D7 requires same-edit); vocabulary cutover inside SKILL.md.
- **Run 2 — keep-alive and references:** L6, `session-ledger.md` row and staleness check, vocabulary sweep across `references/`, D14 enforcement corrections in `acpx.md`, provider files, `building-acp-adapters.md`, and the packet `access:` grammar in `agent-job-packet.md`.
- **Run 3 — callers and proof:** cross-skill caller cutover (three files above), pressure-scenario updates including the `pattern-selection-unnamed` inversion, new scenario for the persistent/single-assignment first cut and the nobody-route, eval run.

## Proof Plan

- Rewrite `pattern-selection-unnamed.md`: one-time second opinion → Delegate @ Balanced; test-and-report stays Operator @ Mini Luna; forbidden (scoped, affirmative forms only): routing the opinion to Advisor/Sidekick, naming a model before the pattern, Terra.
- New scenario `persistent-vs-single-assignment.md`, four legs with job-local proximity regexes so one leg cannot satisfy another's assertion: (a) a long CI watch ("it runs two hours, feels ongoing") — single-assignment Operator (D2); (b) delegated coding work resumed across slices — Sidekick with ledger row and keep-alive: assert the 29-minute ceiling, the `last ping` slot, and the staleness check explicitly, not a generic `ping` match (D9); (c) a merge-despite-flaky-test question — no dispatch, parent decides (D6/D12); (d) "watch CI on every push this week" — repeated independent Operators, forbidden: Sidekick for that leg (D8).
- Rewrite `session-ledger-reduction.md` per the semantic note in the survey inventory (D2 overrides the prompt's "sidekicks"; reviews route to single-assignment Delegates under the reviewer bright line).
- Existing locks retained and re-run: operator-for-mechanical, capability-economics, job-decomposition-before-dispatch, model-thinking-selection.
- D14 assertions folded into the whole-skill review rubric and the retained `capability-economics.md` run: a reviewer dispatch must name an enforced read-only mechanism; a write-scoped ACPX/Codex/Cursor dispatch must mark the scope `declared` and carry the stop condition.
- Static: trigger matrix re-run for L7; grep proves zero remaining `one-shot`/`strategic`/`high-stakes`/`ambiguous` routing tokens in the manage-agents tree (acpx.md renamed in Run 2, so no exemptions needed).

## Implementation-Review Record (2026-08-28)

Whole-skill fresh-context review (Fable seat, full-file reads, 7-point rubric) after Runs 1–3: verdict targeted-fixes-needed, all majors in the proof layer, skill package spec-faithful. Folded: unnamed-scenario Advisor lock added (affirmative-verb forbidden regex, job-anchored Delegate proof); keep-alive assertions split (`29.min`/cache-ceiling and `last ping`/ledger lines, no bare `ping`); fifth leg added to `persistent-vs-single-assignment` (two-hour deploy watch → single-assignment Operator, the D2 duration trap) with job-local proximity regexes and nightly-Sidekick forbidden line; `json-flows-exit-codes.md` retired (its flows/exit-code subject matter no longer exists in the skill); `custom-agent-boundary.md` rewritten against `building-acp-adapters.md` Build Gate and Security Route; `native-providers-codex.md` write line gains `(declared)`; Sol max added to the acpx-codex Frontier mapping; cache-economics sentence deduplicated into Session Keep-Alive; Workflow step 4 load list and completion now include keep-alive. Trigger-matrix note: the shipped frontmatter adds "choosing between a single-assignment delegate or operator and a persistent sidekick or advisor" beyond L7's minimum; the matrix re-run covers that phrase.

## Spec-Review Record

r1 reviewed 2026-08-28 by two independent fresh-context lanes (OpenAI Sol medium; Claude Fable 5). Verdicts: targeted-revision, both. Parent verified every file anchor before accepting. Accepted and folded into r2: Sol-B1 + Fable-I3 (D10 bounds), Sol-I1 + Fable-M2 (D9 ping-as-maintenance, single home, timestamp slot), Sol-I2 (D11 dispatch-time Advisor predicate), Fable-I1 (D12 boundary predicate), Fable-I2 (D13 Delegate Frontier clause), Sol-I3 + Fable-B1 (acpx.md:28 added; Fable's claimed second hit at line 38 does not exist — verified by grep), Sol-I4 + Fable-I4 (proof legs and explicit keep-alive assertions), Sol-I5 + Fable-M4 (session-ledger-reduction semantic rewrite), Sol-M1 + Fable-M3 (scoped forbidden regexes), Fable-M1 (inventory line-list correction, verified). OD1–OD4 resolved with both lanes concurring; recorded in Open Decisions.

## Coordination

Builds on the shipped 2026-08-07 dispatch-discipline changes on this same branch (`feat/manage-agents-dispatch-discipline`, PR #47). Plugin version bumps again on landing (2.3.0 → 2.4.0). Changelog entry ≤20 lines with proof in `docs/changelog/references/`.

## Non-Goals

- No model-table drift reconciliation beyond what D10 requires (Sol-max/Luna-row cleanup is a separate slice).
- No change to the reviewer history bright line, ACPX context provisioning, job-planning content, or packet grammar.
- No fifth pattern; workflow handoffs stay outside manage-agents.
