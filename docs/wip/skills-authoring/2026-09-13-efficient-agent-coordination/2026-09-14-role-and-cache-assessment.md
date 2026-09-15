# Role, model, review, and cache assessment

Date: 2026-09-14. Planning only. Current source checked at ai-tools `9308e61ac516f6410b99948465f836eae8cddc8a`. This addendum evaluates the owner's latest ideas and pasted agent analysis. It does not turn another agent's “settled” recap into owner approval. Runtime skills are unchanged.

## Recommended coherent structure

Separate four decisions instead of using one model-tier table to answer all of them:

1. **Session role:** user-facing driver/coordinator, execution worker, or independent review coordinator.
2. **Relationship:** continuing Sidekick, one-assignment Worker, mechanical Operator, or specifically requested Advisor.
3. **Job:** implementation, research, drafting, review, or observation.
4. **Runtime and model/effort:** native when sufficient; Router/ACPX when a concrete access, lifecycle, or provider requirement calls for it.

```text
User <--> Driver
             +--> 🐒 Implementation sidekick  (continuing work)
             +--> Worker: research/review      (one assignment)
             +--> Operator                    (bounded command/watch)
             +--> Review coordinator          (substantial review only)

Model/effort and native/Router/ACPX are selections for these jobs,
not definitions of the relationship.
```

“Side agent” is an informal umbrella, not another runtime role. A monkey-prefixed name such as `🐒 Storage sidekick` makes a continuing worker easy to recognize; it grants no authority and says nothing about transport. Native children can also have recognizable names where their host supports naming. Never create another session merely to obtain the label.

### Replace Delegate with Worker, not two exclusive job roles

Recommendation: use **Worker** for one bounded interpretive assignment and **Sidekick** for continuing work. “Reviewer” and “Researcher” describe that worker's job. Splitting Delegate exclusively into Reviewer and Researcher loses the existing one-shot implementation, drafting, and analysis cases. Operator remains the mechanical case. Independent review rules attach to the review job even when its agent has a persistent relationship elsewhere.

If renamed, perform one hard cutover across the management table, all active callers/references and tests; no alias or dual runtime vocabulary. This is a proposal, not yet a rename commission.

### Driver role, not model name alone, governs editing

Recommendation: infer the actual model/effort from available harness metadata, with a user override. If metadata is unavailable, state that instead of guessing from the session title. The model/effort selects capability and cost expectations; explicit task role governs authority.

- A Frontier driver thinks with the user, frames work, examines decisive sources, directs workers, and verifies results. It does not perform implementation or production-document edits as a convenience fallback.
- A Balanced driver can handle a genuinely bounded direct task itself when not coordinating a multi-stage goal. Under an orchestrated goal, it delegates execution too. “One slice” is a task boundary, not a loophole to reset the count every turn.
- An assigned worker executes and reports. It does not automatically delegate because it loaded a phase skill.
- A Luna main session can be the executor for a direct task, but the model label alone does not make all future coordinator duties illegal. Ask/route a task that needs a role/capability the session cannot satisfy rather than recurse or silently substitute.

This is the recommended answer to the Balanced-driver question. The stricter all-drivers-never-edit alternative remains possible but would add dispatch overhead to small direct tasks. No universal “tier” remapping is needed: the current matrix calls Astra low Frontier in its Sidekick table, whereas the pasted example called it Balanced. Role policy avoids making that naming difference control write permissions.

## Model and advisor assessment

The latest source already lists Terra medium for Sidekick; Luna xhigh for Sidekick/Worker; Luna high for Operator; Sol low for Delegate; Sol medium and Frontier reviewer entries. Its provider reference recognizes Terra. This is current source support, not a benchmark proving a default.

- Make Terra medium a first-class candidate for continuing implementation and bounded review coordination. Sol low and Luna xhigh remain candidates by job difficulty and supplied context.
- The source does not currently list Terra in the one-assignment Delegate table. If Worker should allow Terra medium, include that matrix change explicitly rather than assuming provider availability grants pattern eligibility.
- Do not add a second standing Frontier Advisor merely because the driver is Frontier. The driver already supplies that thinking relationship. Use a bounded independent reviewer for a concrete verification question; a persistent Advisor requires a named ongoing need and user authority.
- A high-capability reviewer may be appropriate for difficult evidence or a user-selected review, but its high tier is not the default for every lane. Fable/Astra review choices must preserve actual host/provider support.
- Current Claude Sidekick table says Opus high, while the pasted proposal favors Opus low/medium. That is an explicit proposed matrix change requiring task-level proof, not already-settled compatibility.
- “Never max on any model” conflicts with the earlier owner preference for Luna xhigh/max. The latest source has removed max from allowed pattern rows, but source changes by another workstream do not resolve the owner's intended policy here. Keep this choice visible; do not silently extend a Terra-medium preference into a global effort prohibition.
- “Terra never overthinks” and “only Opus low/medium is worth it” are not established general facts. Record preferred configurations and evaluate their outcomes without using those absolutes as requirements.

“SACEX” in the owner message may refer to ACPX; this note assumes no new tool or provider from that spelling. Existing ACPX integration remains a future/capability-specific runtime route, not an automatically launched advisor.

## Review coordination: B with an auditable reduction

Recommendation: for substantial review use a cheaper, sufficiently capable review coordinator. It runs the existing required coverage, collects candidate findings, and performs source-backed reduction. The top-level driver retains the overall verdict for the user. For small review, one main coordinator may be less expensive than adding another layer; choose based on real work, not mandatory fan-out.

The review coordinator returns:

- source/diff identity and changed-file/obligation coverage, including uncovered areas;
- accepted findings with exact hunk or source anchor, governing requirement (“rail”), reason and evidence;
- rejected/deferred candidates with their original severity and concise reasons, with underlying receipts available;
- conflicting reviewers, uncertain proof, and material gaps even when no finding is accepted.

The driver inspects each accepted material finding and its governing requirement; inspects all disputed, high-severity, and weakly justified rejections; and spot-checks lower-risk rejections. A fixed random sample alone can miss a real defect. A zero-findings result still needs coverage and a bounded quality check; it is not exempt from verification.

Do not require the driver to reread the entire source by default. Do not prohibit decisive source inspection when evidence is insufficient. Better packets help, but missing evidence can be a design/proof problem rather than simply a packet-format problem.

A persistent review coordinator is possible across review assignments, but its context must not silently import author conclusions into independent reviewer lanes. Implementation worker and independent reviewer cannot review their own work under a renamed role. Explicitly grant review coordination its bounded lane-dispatch authority; ordinary reviewers remain unable to spawn their own review tree.

## Design-cycle review consolidation

Recommendation remains conditional: one final three-artifact independent review for an orchestrated design cycle when no intermediate result is required to be independently reviewed before a consumer uses it. Keep author self-checks and standalone phase review. Preserve intermediate review when that is an admission requirement or materially needed before expensive dependent work.

This changes existing spec-design/program-design/review caller contracts. The spec must map every subsumed review obligation to the final review. Until accepted and implemented, existing local gates remain required. A “single review” means one coordinated review stage with sufficient coverage, not necessarily one person or one model call.

## Cache: 26-minute Codex target, not a lifetime or savings guarantee

The owner wants 26 minutes as the working Codex maintenance target. Record it once under manage-agents and have timing references consume it. It is a policy margin; it does not prove all conversations have that cache lifetime or that a ping saves tokens.

Eligibility still matters: useful continuing context, expected near-term resumption, idle rather than busy model activity, and supported permission/transport. Recent qualifying model requests reset the relevant activity timing; process liveness or status polling does not. Normal completion notifications and useful follow-ups are preferable to synthetic chatter. A maintenance turn can generate reasoning/output/tools/history, so count its actual cost. No automatic multi-hour heartbeat campaign is commissioned.

**Reject the pasted inference “Claude subagent dies in five minutes.”** Cache expiry and conversation lifetime are different. Even if a five-minute cache TTL applies to a route, that would not establish that its session cannot resume or that a persistent Claude worker must be replaced by Codex. The earlier Luna check likewise proves native session identity without proving direct Router input.

The pasted provider/auth cache table and 300k-token arithmetic have no inspected source or matching harness trace attached here. They remain leads, not runtime rules. Do not adopt Claude-main 50-minute, Claude-child 4-minute, Cursor no-maintenance, OAuth charging equivalence, or a free zero-output cache-touch capability from that table alone. Verify only the actual supported CLI route needed for the chosen workflow. No product-plan research is required.

The native lifecycle reference should map actual advertised follow-up/wait/interrupt capabilities. It must not hardcode send_input/resume_agent/close_agent where absent. A native wait preserves coordination, not provider cache by itself; a Router wake is a message operation, not a special free cache touch.

## Document impact and remaining choices

Apply the proposed behavior through the existing S1-S14 runs and devfiles companion update, not a new role-framework project:

- S1 management: role-first selection, optional visible monkey names, Worker naming proposal, Terra eligibility, follow-up reuse, review-coordinator authority, one cache owner.
- S4/S5 execution/goals: coordinator assigns; executor implements serial slices; corrections stay with worker; no parent waiting loop.
- S6-S10 design/review: bounded evidence collection, settled drafting, explicit review coordinator and coverage-preserving consolidation.
- S11 PR: one observer, terminal evidence, same-command cadence consistency.
- Devfiles: short defaults inferred from actual harness plus user override; no copied model/transport tables.

Owner choices still not promoted to accepted decisions:

1. Balanced driver direct-task exception versus never-edit driver rule.
2. Worker replacing Delegate versus another preferred name.
3. Global max prohibition versus model-specific effort limits, especially Luna.
4. Acceptance of substantial-review B and the conditional full-design review consolidation.

No need to ask for a mandatory model declaration every session. Recommended default: infer from actual harness metadata and honor override; an explicit session role can be supplied when the user wants a different mode. Missing metadata stays unknown, and authority never comes from an inferred model name.

## Evidence and status

Read this turn: current management SKILL.md, native Codex provider reference, Claude ACPX provider reference, and prior native-session evidence. Current source confirms pattern/runtime gaps and matrix differences. Cache-table accuracy, UI drawer access, parent-independent lifecycle and net cost savings remain unverified. No worker/advisor was launched, no runtime edits or tests occurred, and no quoted decision was treated as automatic implementation authority.
