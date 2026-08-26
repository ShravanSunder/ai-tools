# Goal Delivery Intent — User Requirements

## Authority and scope

These requirements record the repository owner's decisions for the active `shravan-dev-workflow` delivery skills in this worktree.

Invoking `orchestrator-goal` for delivery authorizes continuation through planning, implementation, independent implementation review, and PR readiness unless the user names a narrower terminal. It does not authorize merge. Direct use of `plan-implementation` must establish whether the user wants a plan or continued delivery when the request does not already make that clear.

This design work is limited to the active orchestration, planning, execution, and supporting workflow contracts affected by that behavior. Later implementation must update `orchestrator-goal` and `orchestrator-design` as separate named-skill runs under `skills-creation`.

## Affected people

- Agent operator: wants a long-horizon goal delivered without redundant approval prompts.
- Direct planning user: may want either a plan or continued delivery.
- Planning and implementing agents: need a clear delivery terminal, selected grouping, and current plan.
- Reviewer: needs coherent delivery and PR boundaries.
- Tracking user: may want an optional `ops-*` projection without making tickets authoritative.

## Authorized needs

| ID | Need | Why it matters | Priority |
| --- | --- | --- | --- |
| U1 | `orchestrator-goal` carries delivery intent through implementation and PR readiness unless the requested terminal is narrower. | Asking the orchestrator to deliver a goal should not create a second generic plan-approval stop. | Must |
| U2 | Direct planning establishes plan-only versus continued-delivery intent at entry when the request is ambiguous. | Planning alone must not silently authorize repository writes, while explicit delivery must not be re-asked later. | Must |
| U3 | Planning owns the technical implementation strategy inside reviewed design and repository constraints. | The owner should decide product and delivery boundaries, not ordinary implementation mechanics. | Must |
| U4 | Planning proposes coherent vertical delivery groupings and asks the owner only when materially different groupings exist. | Grouping can change independent value, reviewability, integration risk, and coordination cost. | Must |
| U5 | Planning establishes one-PR versus separate-PR intent when both are materially viable. | PR topology is an owner-controlled publication and coordination choice, not an accidental consequence of task decomposition. | Must |
| U6 | When no `ops-*` projection is selected, the workflow offers optional tracking once without blocking delivery. | Tickets may help coordination but must remain optional and non-authoritative. | Should |
| U7 | The workflow stops for a real missing decision or authority, invalid governing design or plan, failed required proof, unauthorized external or destructive action, or merge. | Removing redundant consent must not authorize guesses or weaken real safety boundaries. | Must |
| U8 | Trivial single-slice work proceeds without artificial decomposition, option, or PR ceremony. | Questions are justified only when their answers change delivery. | Should |
| U9 | An orchestrated implementation plan is one Markdown file under the target project's Git-ignored `tmp/` tree and remains available while delivery uses it. | The plan is temporary execution coordination, not checked-in design documentation. | Must |
| U10 | Private scratch for `orchestrator-goal` and `orchestrator-design`, including temporary agent-transfer material, lives under the user's OS temporary directory and is safe to lose. | Orchestration mechanics must not pollute the project or become hidden authority. | Must |
| U11 | File-backed Requirements, Specification, and Program Design created by an orchestrated design cycle live under the target project's `docs/specs/` tree and may be tracked. | Durable design meaning needs a project home distinct from temporary plans and disposable scratch. | Must |
| U12 | A bounded design review permits one independent review and at most one remediation pass; the parent rejects pedantic findings without semantic effect, verifies any bounded remediation without another review, and stops for the owner when a finding breaks the settled mental model. | Design review must improve the design once without becoming an open-ended rediscovery loop or forcing work through a failed premise. | Must |
| U13 | An orchestrated implementation may perform at most three implementation-review remediation passes before stopping. | Implementation needs more correction tolerance than design, but repeated review/remediation must still have a hard cost boundary. | Must |

## Desired outcomes

- A goal with the default terminal proceeds from a valid plan into implementation without generic post-plan approval.
- A direct planning run settles its terminal before substantive plan authoring.
- The agent owns technical planning; the owner chooses only materially different delivery grouping and PR options.
- Tracking, implementation intent, PR topology, and merge remain separate decisions.
- Durable design, temporary implementation planning, and disposable orchestration scratch have clear, different homes.
- The workflow contains no lifecycle ledger, content-digest system, approval database, or other bookkeeping whose removal would not change delivery behavior.
- Design review and implementation review use separate bounded-remediation rules: one design remediation versus at most three implementation remediations.

## Non-goals

- No runtime skill, test, metadata, changelog, Git, PR, tracker, or cache mutation is authorized by this design-only change.
- No merge authorization is implied by delivery intent.
- No authority to invent product meaning, change structural design, weaken required proof, or expand write scope.
- No checked-in implementation plan or project-local orchestrator scratch.
- No lifecycle ledger, transition log, counter system, document digest, compatibility path, or second source of truth.
- No shared generic review-loop budget that erases the different design and implementation limits.
- No forced relocation or rejection of otherwise authoritative pre-existing design artifacts merely because they use another established project documentation home.
