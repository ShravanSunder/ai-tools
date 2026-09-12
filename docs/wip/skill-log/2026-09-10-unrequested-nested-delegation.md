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
