# Main-agent design and planning ownership

## Purpose and authorized outcome

The user-facing main agent owns the engineering work: it understands the problem, designs and writes the governing artifacts, writes the implementation plan, directs implementation, assesses actual changes and proof, resolves findings, and verifies completion. The user may select Frontier or Balanced and may explicitly assign an Advisor; those choices do not change ownership.

The main agent may use Workers, Operators, and search for research and ancillary tasks. Only the main agent designs and writes Requirements, Specification, Program Design, their diagrams, and the implementation plan. Even already-settled sections are not delegated. Here, prohibited delegated authoring includes writing, organizing, rewriting, or choosing the expression of governing design/plan content, even from fully mapped notes. Allowed mechanical rendering runs tools on unchanged main-authored input and contributes no prose, diagram source, layout decisions, or design meaning. An Advisor may challenge and advise without authoring or accepting the governing artifacts. Independent reviewers provide findings, not replacement designs or normative prose.

An implementation plan may divide delivery into several PRs, each assigned to a persistent implementation Sidekick. Each Sidekick may implement directly and use bounded Workers or inexpensive Operators. Independent scopes may run concurrently; dependent work waits for verified prerequisites. The main agent remains responsible for integrated behavior across PRs.

This is a user-directed intent change. The approved conversation is the authority; earlier incidents explain the pressure cases but are not claimed as faithfully reproduced failures. The delivery terminal is reviewable, unmerged PRs for workflow skills, canonical Router collaboration guidance, and shared instructions. No merge, release, cache refresh, home apply, or production process action is authorized by this spec.

## Ownership and flow

```text
User <-> main agent (Frontier or Balanced)
          |-- optional user-assigned Advisor: advice and challenge
          |-- Workers / Operators / search: evidence and ancillary support
          |
          +-- main authors Requirements, Specification, Program Design
          +-- independent design review -> main corrects -> review verifies
          +-- main authors implementation plan and PR boundaries
          +-- implementation Sidekick A -> PR A -> implementation + real proof
          +-- implementation Sidekick B -> PR B -> implementation + real proof
          +-- main assesses contributions and integration against intent/design/plan
          +-- different-lineage independent implementation review
          +-- corrections -> implementer -> fresh proof -> main/reviewer verification
          +-- main verifies the agreed delivery boundary and reports evidence
```

The existing design-review-before-detailed-planning sequence is retained; the change is planning ownership. The main answers normal questions within agreed direction. A missing design decision, mental-model break, material scope expansion, public-contract change, or weakened proof returns to the main and, where owner meaning is needed, the user before dependent work continues. Bounded reversible implementation repairs remain with implementers under the existing scope gate.

## Observable requirements

| ID | Required behavior | Evidence of success |
| --- | --- | --- |
| O1 | Main may be Frontier or Balanced, with or without an explicitly assigned Advisor; topology is unchanged. | Pressure cases cover both main categories and optional Advisor without another author or approval gate. |
| O2 | Main itself loads design/plan skills and authors all governing design and planning content, including diagrams and settled sections. | Source and behavioral evidence show no design-author, section-writer, modeler, or plan-author dispatch. Research/tool rendering is allowed when it contributes no design meaning or prose. |
| O3 | Workers/Operators may assist the main throughout; each assignment is bounded ancillary work and returns evidence. | Positive controls permit source collection, test/build procedures, and mechanical checks rather than banning delegation. |
| O4 | The main may commission multiple persistent implementation Sidekicks for planned PRs. | A two-PR case assigns separate work, names real dependencies, and keeps main integration responsibility. |
| O5 | Sidekicks implement, test, prove real behavior, and correct; they may use bounded Workers/Operators. | Existing proof gates remain; implementation packets carry main-authored design/plan, scope, and proof obligations. |
| O6 | Implementation proof precedes main assessment; assessment precedes different-lineage independent implementation review. | Both ordinary delivery and skill-authoring pressure cases reject review as a substitute for missing implementation proof or main assessment. |
| O7 | Main verifies fidelity, complexity, and evidence, resolves routine questions, and escalates mental-model breaks and owner decisions. | Cases retain the scope gate and stop dependent work on design breaks. No reviewer or implementer accepts the whole project. |
| O8 | Threads carry discussion, questions, decisions, progress, evidence, and continuation across agents. | Exact work references travel with assignments and receipts; saved posts are not acceptance or delivery evidence. |
| O9 | Multiple PR assignments fit the current one-implementer-per-thread Router contract without restricting project-wide Sidekick count. | Shared coordination root links execution roots; each execution root has main as orchestrator and its assigned Sidekick as implementer. |
| O10 | The canonical Router skill is edited upstream and vendored exactly into ai-tools with a real source commit pin. | Canonical and vendored Markdown match; local plugin UI metadata is retained; source commit is present in the Router PR. |
| O11 | Explicit human instructions retain precedence. Portability does not silently transfer authorship. A successor-main handoff names the recipient, the design/plan scope transferred, and the explicit user direction authorizing that transfer; the main records that direction rather than inventing it. Without that evidence, the recipient has only the assigned research, implementation, or review scope and returns authoring gaps to the current main. | Keep the main-authorship rule; replace the pending refusal of an explicit human instruction with this default and exception. Pressure cases distinguish a user-designated successor from an executor asking to continue planning. |

## Current source and gap

- `manage-agents/SKILL.md` and shared host instructions assign planning to the implementation Sidekick. The generic executor path can be mistaken for design dispatch. The pending authorship patch helps but still permits section expression and retains Sidekick planning.
- `orchestrator-design/SKILL.md` permits phase-owner/drafting interpretations and commissions one implementation Sidekick before clearly assigning main-agent planning. `orchestrator-implementation-goal` and `references/goal-contract-and-routing.md` explicitly dispatch planning to the implementer.
- `spec-design/SKILL.md` allows section writers. `program-design/SKILL.md` dispatches section-writing, target-view modeling, alternatives, and risk-realization lanes. These produce governing design rather than ancillary evidence.
- `skills-creation/SKILL.md` and its implementation-review reference explicitly review changed skill files before proof. That ordering conflicts with O6. Proposal review before implementation remains required.
- `plan-handoff` allows another agent to continue planning without identifying it as a successor main. Plan-producing entry points must preserve authorship even when invoked directly.
- `track-show-me-your-work` binds a whole-work account to one root and one implementer. Router actually scopes its unique implementer seat to a thread, not a project. The existing `Participant` role and linked roots support coordination without a new database or hierarchy mechanism.
- `agent-router/README.md` makes `codex-router/agent-skills/agent-collaboration` canonical and `plugin-sources.json` the vendor pin. The transport skill carries conversation/board operations; it must not become a second role-policy owner.

Supporting historical evidence is the inspected session and earlier authorship incident. Public artifacts summarize behavior without private session transcripts, credentials, account metadata, or private-repository URLs. The old worktree proposal is superseded by this user-directed specification, not silently treated as accepted for the new scope.

## Decisions and boundaries

| Decision | Selected behavior and rationale |
| --- | --- |
| Main identity | Frontier or Balanced by user choice. Model category is not authority. |
| Governing authorship | Main authors all design and planning; no delegated authoring even for settled text. Remove the Worker-drafting exception in `manage-agents/SKILL.md`, the mapped-section-expression exception in `orchestrator-design/SKILL.md`, and the Section-writers allowance in `spec-design/SKILL.md`, plus the program-design writer/modeler allowance and four obsolete lane callers. Mechanical rendering consumes unchanged main-authored input and makes no content or layout decisions. |
| Review order | Preserve independent design review before detailed planning. For implementation, proof then main assessment then independent review, including skill packages. |
| Multiple implementers | One continuing Sidekick per useful planned PR assignment, with no global one-Sidekick cap. Separate PRs are not automatically independent. |
| Threads | Reuse a relevant coordination root; link bounded execution roots when simultaneous implementers need separate seats. Discussion stays on the appropriate root, integration on coordination. No forced thread per command or Worker. |
| Other main agents | Additional conversations/threads with other main agents and their teams follow user direction. Posts and role labels do not create assignment authority. |
| Exceptions | Replace `orchestrator-design/SKILL.md`'s pending sentence "If the user asks to spawn a Sidekick to write the spec, refuse; keep authorship here" with the main-authorship default and explicit-user-direction exception. Do not delete the main-authorship guard. A successor-main packet names recipient, transferred design/plan scope, and the user's authorizing direction. A current-main assertion, role label, handoff, or assistant continuation alone cannot grant that authority. There is no corresponding refusal sentence in current devfiles to delete. |
| Scope | Update all active contradictory consumers. Preserve unrelated skill methods, model catalogs, review lineage, proof strength, and current new domain-entity guidance. |
| Proof posture | Characterize approved behavior with realistic pressure scenarios and current source reads; do not claim historical RED-to-GREEN or treat fake-backend output as behavior proof. |
| Publication | Three PRs; Router upstream commit before final ai-tools vendoring pin. No merge. Shared host instructions remain source-only until separately applied. |

No new roles, stores, lifecycle protocols, scheduler, generic packet schema, CLI flags, Router runtime behavior, or board-seat migration are introduced. Continuation-hook changes and broader historical incident remediation are outside this cut. Existing anti-invention/source-authority checks remain in force.

## Sequenced skill runs and surface allocation

Each numbered run targets exactly one skill under `skills-creation`; one reviewed spec binds the coordinated cutover. All runs are behavior-changing, user-directed intent. Trigger descriptions remain unchanged unless the current description explicitly contradicts authorship; no new skill or implicit-invocation policy is introduced. Each run keeps its all-run obligation in `SKILL.md`, uses existing references for mechanics, and adds/updates fitting pressure proof. No new executable scripts or schema are needed.

| Run | Plugin / skill | Main path and depth change | Proof focus |
| --- | --- | --- | --- |
| 1 | shravan-dev-workflow / manage-agents | Main-only design/plan authorship; ancillary help; plural planned-PR Sidekicks; guidance-only optional Advisor; per-assignment threads. Remove superseded drafting/refusal wording. Existing job packet/session references carry scope and continuity. | Both main tiers; Advisor optional; no section writing; multiple implementers with ancillary helpers. |
| 2 | shravan-dev-workflow / orchestrator-design | In-session design authorship, no writer dispatch; design review stays separate; main owns planning before implementation commission. | Whole-artifact and settled-section delegation pressure; actual phase-source reads. |
| 3 | shravan-dev-workflow / spec-design | Main authors Requirements/Specification and views. Remove section-writer allowance and update blockers. Preserve newly merged domain-entity method. | Main authors; evidence collection allowed; no outsourced normative text. |
| 4 | shravan-dev-workflow / program-design | Main owns structure, alternatives, risk realization, target diagrams and prose. Remove four design-producing lane callers and their obsolete lane files; retain current-system/external evidence lanes and narrow their shared packet accordingly. Optional owner-assigned Advisor may advise under manage-agents. | Research lanes allowed; all target design/model/section writing stays main; no dead references. |
| 5 | shravan-dev-workflow / plan-implementation | Main loads and writes the canonical plan; helpers return repository/proof evidence. Preserve admission, immutable-path and delivery contracts. | No Sidekick plan assignment; plan-only/delivery distinction intact. |
| 6 | shravan-dev-workflow / plan-improve-repo | Direct planning is main-authored; delegated audit work returns evidence, not plans. Preserve audited-finding admission. | Source research allowed; plan authorship retained. |
| 7 | shravan-dev-workflow / orchestrator-implementation-goal | Main planning; plural PR assignments; real prerequisites. Teach main assessment inline: inspect current changes and actual proof against the original need, design, plan, scope, unnecessary complexity, and cross-PR integration. Missing proof returns to the implementer; a design break or owner decision stops dependent work and returns to the user. Update routing reference and human README. | Main plans, Sidekicks prove, main checks, independent review follows. |
| 8 | shravan-dev-workflow / plan-handoff | Portability preserves main ownership. Classify an authoring transfer only when the packet names the successor recipient, transferred plan scope, and explicit user direction authorizing it. Without that evidence, preserve implementation/review scope and return planning gaps to the current main. | Sidekick receives execution scope, not inferred plan-author authority; a genuinely user-designated successor may continue. |
| 9 | shravan-dev-workflow / spec-handoff | Preserve design authorship across portability. Use the same observable user-directed successor signal as Run 8 for the transferred design scope; otherwise return authoring gaps to the current main. | Handoff is not design delegation or acceptance. |
| 10 | shravan-dev-workflow / track-show-me-your-work | Coordination root plus linked execution roots for concurrent PR Sidekicks; discussion and proof updates; local/whole-work resolution remains distinct. | Two implementers, one per execution root; coordination stays open until integration completes. |
| 11 | shravan-dev-workflow / skills-creation | Main authors skill specs/plans; implementation delegate executes one named run at a time. Change post-edit sequence to proof, main assessment, independent implementation review. Replace the old "Review before proving" rationale: review consumes already-demonstrated behavior; it does not substitute for implementation proof. Teach the main's pre-review assessment inline using Run 7's inspection criteria and failure routes. Update corresponding review/proof references and completion checks without weakening proposal review or remediation limits. | Reject review-before-proof and delegated spec authorship; current evidence required after corrections. |
| 12 | agent-router / agent-collaboration (canonical Router source) | Explain thread-local seats and reference coordination/execution root IDs using existing message-reference/text mechanisms; preserve caller-supplied roles/authority and exact session refs. "Linked" means existing references, not a new link command. No model or design-policy duplication. | Existing real CLI contract tests plus focused skill scenario for multi-PR threads/receipts. |

Aligned consumers (`implement-plan`, `implementation-review`, `spec-program-review`, `research-swarm`, `implementation-handoff`, discussion skills) retain their methods. Make a bounded caller/example correction only when a current active sentence directly contradicts O1–O11; do not expand into unrelated method rewrites. A newly discovered semantic target outside the twelve named runs returns to the main for a spec amendment and review-coverage decision before editing.

Companion non-skill work: update ai-tools root operating map/README and relevant metadata to match the active roles; update devfiles `shared/my_agents.md` and dated changelog/index; vendor Run 12 into ai-tools, retaining its `agents/openai.yaml`. Public metadata contains no private devfiles URL or host configuration.

## Coordination and landing

- ai-tools publication branch: `feat/orchestrator-design-authorship`. Original pending changes are retained as evidence and reshaped, not reset. Incorporate current `origin/main` domain-entity changes before implementation. Current fetched main is `5bb344d06bde0184bb2fda848a4ecb9dfb0b5ca9`.
- Router publication branch: `feat/orchestration-skill-ownership`, based on `74aaa88ccb5fbd2b76f3a6dc8dee464551be6dc0`.
- Shared-instruction publication branch: `research/design-ownership-2026-09-19`, based on its current main. Its PR is private and must not be linked from public artifacts.
- Main writes this spec and the associated plan. Independent fresh-context different-lineage spec review covers the whole multi-run document. Prior narrower review receipts do not authorize this expanded scope.
- Implementers preserve per-run scope; the main accepts source-bound proof and integration before independent implementation review. Router and shared-instruction changes can proceed independently of workflow text. Vendoring waits for the reviewed canonical Router change and its actual commit.
- Version/changelog changes land once per affected plugin after all runs: next unused workflow and agent-router versions, matching marketplace/manifests, dated public-safe changelog/index. No cache or home mutation is proof.
- Exact board/session addresses, review receipts, test outputs and publication state belong in the collaboration threads and private/scratch evidence, not this normative document. Main owns every design/spec/plan correction.

## Proof and completion

Behavior proof: update existing authorship scenarios and add targeted cases for plan ownership, no settled-section/model delegation, both main tiers and optional Advisor, multi-PR implementation with thread-local seats, successor-main handoff, and proof-before-main-assessment-before-review. Use the real configured pressure harness with lifecycle hooks disabled as documented. Run fitting affected cases with `pnpm --dir tests/skills run test:evals` and explicit scenario selection where supported; record actual subjects/judges, outcomes and transcript anchors. Inspect every flagged transcript. Fake backend validates harness plumbing only.

Static proof: skill quick validation per changed skill; required Markdown/reference/metadata contracts; harness unit tests/typecheck and applicable formatter/lint; `claude plugin validate .`; marketplace availability check when its surface changes; source/vendor parity with only declared UI metadata excluded; `git diff --check`. Router skill-only proof includes `cargo test -p agent-collaboration --test skill_cli_contract --locked`; CI remains required before PR-ready claims. Shared-instruction proof is focused source/role consistency and diff validation, with no rendered private config or home apply.

Completion requires accepted spec/plan, all scoped changes, actual fitting proof, main assessment, fresh different-lineage implementation review and resolved findings, three reviewable PRs with truthful CI/review/mergeability state, and a thread checkpoint preserving any remaining blocker. PR creation alone does not establish behavior proof or merge readiness. Explicit repo publication restrictions are honored after the concrete changes are reviewable; no unrelated files are staged.

## Spec review record

Revision: 2, accepted to implement by the main agent after independent review. The first review returned four complete proposal lanes (mental-model-fit, trigger-routing, rule-agreement, depth-coverage) and three bounded clarification findings. The same different-lineage lead verified the one permitted remediation, returned `great` and `accepted-to-implement`, and reported no remaining bounded issues. This revision names the prohibited drafting clauses and permitted mechanical rendering, teaches user-authorized successor designation and its safe default, and specifies the rationale/main-assessment behavior for proof-first ordering. Main rejected the suggested self-authorized successor signal and nonexistent devfiles refusal analogue; the lead verified both rejections against source. This record changes review status only; the reviewed semantic boundary remains revision 2. Implementation and publication still require the proof, main assessment, and independent implementation-review gates above.
