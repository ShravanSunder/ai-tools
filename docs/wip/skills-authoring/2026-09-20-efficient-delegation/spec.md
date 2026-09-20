# Efficient delegation and execution conversations

Revision 2. Main-authored change specification and implementation run plan.

## Need and success

The owner wants routine post-planning execution conversations to happen with the persistent implementation Sidekick, while Main remains the design, planning, integration and acceptance owner. Delegation must reduce unnecessary expensive-model work without creating recursive management layers. The owner also requests consistent harness instructions, clearer Router board roles, and stronger companion instruction wording.

Success: after a ready Main-authored plan, the assigned Sidekick becomes the normal execution contact, executes and proves its scope, and escalates material design/plan decisions with evidence. Workers handle bounded reasoning assignments; Operators handle prescribed standalone procedures. Governing authorship, independent review, assignment limits and final acceptance remain unchanged. A reader can distinguish an agent conversation, native child, and board discussion/seat without treating a display name or board role as execution permission.

Authoring basis: user-directed intent, not a claimed reproduced model failure. Source inconsistencies motivated the work but do not establish a behavioral RED/GREEN result.

## Evidence

- `skills/manage-agents/SKILL.md` currently defines procedure/assignment/continuing-work roles and permits user steering of a Sidekick, but its Main flow does not explicitly hand off routine execution conversation.
- The current orchestration skills reserve all governing design and plan authorship for Main; implementation and proof belong to commissioned Sidekicks.
- The companion instructions' pending ownership change uses permissive `may` phrasing and removes an explicit standalone-procedure Operator cue. The detailed role policy remains owned by `manage-agents` rather than being copied into companion files.
- Router's current code has five board roles: orchestrator, implementer, advisor, reviewer, participant. Roles are per discussion root; conversation identity and native ancestry are separate. It enforces unique orchestrator/implementer seats and session-orchestrator resolution, not design authorship or worker task selection.
- Current official OpenAI multi-agent guidance warns of token overhead for sequential/shared-state work. Official Anthropic guidance recommends isolating high-volume disposable output and direct execution for closely coupled work. Research notes and source links: `tmp/research-workflows/2026-09-20-frontier-delegation/research-ledger.md` (working evidence, not required runtime reading).

## Decisions

| Decision | Rationale |
| --- | --- |
| Keep Main, Implementation Sidekick, Worker, Operator and Review Sidekick names | The roles already separate authority, continuing context and bounded work; conversation routing does not require renaming or a runtime type. |
| Main means the orchestrator/design and acceptance owner, not the only agent the user may converse with | Removes the ambiguity without transferring authority. |
| Once commissioned from a ready plan, Sidekick is the default execution contact | Eliminates routine relay turns and preserves implementation context. |
| Sidekick executes its assigned implementation and associated proof directly unless a bounded delegation has a concrete benefit | Prevents a supervisor-of-supervisors pattern; preserves native help for independent work, distinct expertise, or disposable output. |
| Standalone prescribed Git/PR/build/test/watch work goes to Operators; associated implementation proof stays with its executor | Keeps the existing bright line without spawning an Operator for every test call. |
| Main receives material design/plan decisions, integration issues and assessment/acceptance results, not every progress turn | Preserves accountability while avoiding repeated full-log narration. |
| Use concise source-backed receipts, exact unresolved questions and artifact pointers | Main can verify decisive evidence without replaying the entire worker transcript. |
| `manage-agents` alone owns the agent-role to board-seat mapping; Router owns seat semantics and actual enforcement | A seat or name is not a permission grant, a session ancestry change, or proof of completion; transport guidance must not become a second workflow-policy owner. |
| No live model evaluations in this commission | Owner's cost constraint; static/fake proof remains explicitly structural or simulated. |
| Keep selected session identity/model/effort stable; qualify provider-cache claims | Continuity is useful independently of cache, and newer APIs do not justify claiming capabilities this host has not verified. |

## Named runs and surface allocation

All workflow paths below are beneath `plugins/shravan-dev-workflow/`. Existing trigger descriptions and invocation capability remain unchanged: the same skills own these decisions.

1. **manage-agents**: update Main flow, Sidekick and delegation selection at their existing owning locations. Teach the affirmative delegation test in the runtime selection owner: independent bounded work, a distinct needed expertise, or isolating high-volume disposable output can justify a child when the expected benefit exceeds briefing, coordination and verification cost. Keep coupled implementation/proof with its current executor and do not create a supervisor solely to relay another agent's work. Preserve the standalone-procedure Operator rule. Own the complete agent-role to seat mapping here: Main to orchestrator, implementation Sidekick to implementer, Review Sidekick to reviewer, owner-requested Advisor to advisor, bounded contributors to participant when joining. Preserve model catalog, native/top-level boundary, review independence and successor-main exception. Inspect the Codex/Claude/Cursor native and ACPX provider references plus job/session references; reconcile only contrary role/routing/cost instructions while keeping provider encoding with those references and policy here. Do not copy the role manual into every provider file. Update applicable role-selection scenario fixtures to current terms and add focused execution-contact/overdelegation countercases for later live use against this taught selection rule. No new runtime schema, harness backend or fake model behavior claim.
2. **orchestrator-design**: align the ready-plan continuation with the Main-owned plan and execution-contact handoff. Design phases and main-authored visual obligations stay unchanged.
3. **orchestrator-implementation-goal**: align routine execution routing, material escalation and substantive assessment; preserve review sequence, remediation limits and PR terminal.
4. **agent-collaboration** (canonical Router skill, subsequently vendored unchanged): explain session vs native child vs board thread; teach the five board seats and their actual enforced limits in the existing `references/message-board.md` owner. Caller workflows select assignments and seats; cite `manage-agents` as the owner of its agent-role mapping without copying that mapping or requiring the transport skill to load the workflow. Keep the five-role schema and actual enforcement unchanged. Explain direct conversation is not role or authority transfer, explicit replies, and exact-target/native-child capability limits. The skill body and matching human-facing Router guidance point to the same seat-semantics reference rather than becoming competing seat manuals. No runtime Rust changes.

Companion non-skill work: tighten the existing pending shared instruction change to call the owning skill decisively, describe the execution-contact handoff and preserve standalone Operator/associated-proof boundaries. Reconcile relevant harness-facing source instructions without applying home configuration. Keep detailed model tables in `manage-agents`.

## Implementation order and coordination

- ai-tools initial fixed base: `5515dfcb30a4585af2006a418afcad35b65c1133`; branch `research/lane-ownership-and-model-cost`; worktree initially clean. A pre-edit fast-forward to `7f92364b9fbd617cb5748dfbd65fb255f471a27e` is authorized: its only additional changes are the Vitest package/lock update, with no role-policy change. Verify the actual branch head before commissioning implementation. Existing research notes are ignored scratch.
- Companion instruction work reuses its existing unmerged worktree/PR; no unrelated edits or replacement branch.
- Router work uses an independent fresh worktree from fetched `origin/main`; record its exact base and change scope in the private commission before editing. Canonical Router skill is the only source for the later vendor copy.
- Main obtains proposal review, then commissions the retained implementers with this read-only spec and repo-specific scopes. Runs 1-3 are sequential within the ai-tools assignment. Companion and canonical Router work may proceed independently from the same accepted decisions. Vendor copying waits for verified canonical Router source and commit identity.
- Workflow plugin lands one minor version update with matching applicable manifests/marketplaces and a <=20-line changelog entry plus longer proof reference. Router-skill plugin metadata/pin updates follow the established canonical-source convention after its source is committed. No unrelated plugin version changes.
- Final integrated assessment verifies the actual source diff, companion consistency and proof before independent implementation review and PR wrap-up. The companion PR is updated; ai-tools and Router use their own scoped PRs. No merge is authorized.

## Cheap proof and claim boundary

Run applicable existing unit tests, typechecking, official skill validators, manifest validation, reference/link and whitespace checks. Use the existing fake pressure backend only for focused harness/fixture plumbing if useful; label it fake and never claim it establishes model dispatch or instruction compliance. Update scenario expectations without giving grader answers to subject prompts or weakening unrelated obligations. No new model evaluation jobs, Frontier trials, synthetic paid conversations, full live pressure suite, or production Router exercise.

The user-authorized proof posture is source/static plus existing fake mechanics, with live model behavior explicitly unverified. Preserve independent source review; it is not a model-behavior test and cannot upgrade the proof tier. Record the limitation in the change evidence and PR descriptions. Future ordinary authorized work may supply observations without creating a new telemetry service or benchmarking project.

## Non-goals

No installed-cache refresh, home apply, role rename, new role enum, Router protocol/access/approval change, title probe, production restart, automatic model switching, new cache policy, new agent registry, review-lane-policy redesign, recursive delegation framework, or speculative cost percentage. No modification of prior accepted visual/documentation obligations. No merge, rebase, force push or tags.

## Review record

Revision 1 received four complete independent proposal lanes and `targeted-revision`. Main accepted F1 (single mapping owner), F2 (runtime teaching for the concrete-benefit delegation test), and the minor fixed-base clarification. The retained review lead verified revision 2's one bounded remediation with no lane redispatch: all accepted findings resolved, verdict `great`, `accepted-to-implement`. Main accepts revision 2 for the named runs. The source/static/fake proof posture is unchanged. Review identities and operational commands live in the private packet/work trail, not this public document.
