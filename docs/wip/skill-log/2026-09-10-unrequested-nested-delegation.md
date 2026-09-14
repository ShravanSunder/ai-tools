# Unrequested nested delegation

- Observed: 2026-09-10
- Status: captured
- Skill/workflow: manage-agents and spec-program-review, 2.10.0
- Task context: bounded Rust design review and migration implementation.
- Expected behavior: assigned Delegate executes its packet; explicit no-delegation constraint prevents child dispatch.
- Observed behavior: a reviewer delegated another reviewer, and a later implementation Delegate spawned a source-audit Delegate despite explicit no-delegation instructions.
- Evidence: current codex-router rust-better conversation; reviewer reported the extra lane and parent interrupted it; implementation Delegate explained it interpreted its role-selection line as a dispatch instruction. Parent corrected both.
- Recurrence: two observed instances in this conversation.
- Impact: extra review cost and delayed receipts; no confirmed product mutation from the extra read-only lanes.
- Suspected cause: assigned-role metadata confused with orchestration instructions; skill parent/leaf routing may contribute.
- Follow-up: inspect leaf packet interpretation; no skill changes authorized by logging.

## 2026-09-13 recurrence

- Skill/workflow: manage-agents and skills-creation 2.12.0.
- Expected: fresh history-none leaf reviewers execute their assigned lane; no nested dispatch.
- Observed: two Sol reviewer lanes attempted to dispatch replacement reviewers and reported capacity blockers despite already being the fresh reviewer. Parent clarified their leaf role; the first returned its own complete receipt, the second is continuing.
- Evidence: parent-visible messages from skill_dx_security_review and skill_dx_correction_review in the collaboration DX task; source receipt tmp/collaboration-proof/skill-impl-security.md.
- Impact: unnecessary attempted dispatch and delay; attempts failed at capacity, no extra reviewer executed.
- Hypothesis: leaf role declaration interpreted as an instruction to create that role. No skill edits authorized or made.

## 2026-09-13 bounded navigation-review recurrence

- Skill/workflow: spec-program-review dispel lane, 2.12.0; native Sol Delegate.
- Expected: the fresh leaf reviewer directly returns candidate classifications for its bounded packet.
- Observed: the assigned dispel reviewer spawned a nested dispel Delegate. Parent clarified the leaf role and prohibited further dispatch; the assigned reviewer then returned a complete receipt.
- Evidence: native agent spatial_design_dispel spawned spatial_design_dispel/u18_dispel_delegate; parent observed both in collaboration.list_agents and sent corrective messages.
- Impact: an extra read-only reviewer and delayed receipt; no product edits reported.
- Qualification: the first packet declared a leaf lane but did not repeat an explicit no-spawn sentence. Later packets now state it explicitly. This supports a suspected role-interpretation defect, not proof of disobedience to an explicit packet prohibition.
- Follow-up: retain the existing suspected-defect investigation; no skill changes made.
