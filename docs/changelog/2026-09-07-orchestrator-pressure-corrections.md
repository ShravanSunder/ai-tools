# Restore routing-focused skill tests (2.9.0)

- Restores the orchestrator test boundary: inspect current evidence and choose the next skill or stop. Luna is not required to perform downstream design, planning, implementation, review, or publication.
- Removes test-driven execution demands from orchestration guidance; retains invalid-composition routing to skills-creation, existing review limits, and the instruction-only tracker.
- Reconciles scenario inputs, fixture identities, and proportional evidence checks without adding cases or increasing call caps.
- Keeps the existing harness's verified read-only adapter pin, hook isolation, source-read attribution, permission context, and bounded diagnostics. No new logging engine or helper scripts.
- Validation: independent reviews complete; 121 unit tests, typecheck, skill/plugin/marketplace checks pass. Full runs plus affected-case retests cover 28 routing/explanation and 2 recovery-classification cases successfully. [Proof and limits](references/2026-09-07-routing-proof.md). Earlier execution-oriented scores used the wrong test contract.
- Release metadata advances to 2.9.0 because master already contains 2.8.0. No installed-cache refresh or merge.
