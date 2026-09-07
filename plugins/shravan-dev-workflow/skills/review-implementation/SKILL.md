---
name: review-implementation
description: Use when independently reviewing implemented code, proof, a branch diff, commit, PR head, or one bounded remediation before PR readiness, including when governing authority, ready plan, source, diff, proof, or remediation-limit evidence is missing or conflicting. Not for design review, runtime-skill authoring review, editing findings, security scans, remediation, or PR monitoring.
---

# Review Implementation

Implementation review independently reconstructs governing obligation through plan, source, diff, and proof. One complete fresh-context reviewer covers the implementation; the parent verifies candidates and owns the result. The bounded delivery effort—an orchestrated goal or direct review loop—may remediate at most three times.

## Admit Review

1. Classify `general-domain | runtime-skill-package`; runtime skill packages route to the implementation-review stage of `skills-creation`.
2. Classify `meaningful-review-required | non-substantial | blocked-input`. Non-substantial is limited to fully inspected formatting, typo, link, or generated-metadata changes with no semantic consumer.
3. For meaningful review, MUST load `../../shared-references/canonical-implementation-plan.md` and validate the unchanged ready plan record, governing planning basis, delivery context, base/reviewed identities, diff range, instructions, proof claims/evidence, constraints, known gaps, and the inspectable remediation receipts already consumed by this bounded delivery effort. When prior review evidence is unavailable, admit exactly one bounded recovery review with known-below-limit or unavailable remediation-count evidence only if the orchestrator explicitly authorizes recovery, documents what evidence is unavailable and why another review is necessary, inspects the current source/proof boundary, and establishes no known prior recovery. Preserve the known count, or record it as unknown when unavailable; do not turn unknown into zero or reset the normal allowance.
4. Admit reviewed-design and admitted-repository-improvement governing-basis variants through their canonical fields. Reject missing, stale, malformed, plan-only, mismatched, wrong-origin, or unproven authority without inference.
5. Reject recovery when three or more remediation passes are known, a prior recovery review is known, the reviewed source or proof is stale/mismatched, or the request fabricates a zero count from unavailable evidence. If three remediation passes already exist and another review is requested, return `remediation-limit-reached` unless the user explicitly authorized continuation after seeing that stop.

Completion: classification, governing identities, unchanged plan/context, diff/proof boundary, remediation count evidence or the bounded recovery authorization and missing-evidence reason, current-source inspection, prior-recovery check, and `admit | blocked-input | remediation-limit-reached` are explicit.

## Review

1. MUST load `references/reviewing-implementation.md` and return its review packet, coverage model, finding requirements, and proof-observation boundaries.
2. MUST use `manage-agents` to dispatch exactly one fresh-context, read-only, candidate-only `complete-reviewer` using `references/lanes/lane-schema.md` and `references/lanes/complete-reviewer.md`.
3. Parent-verify every candidate against current source and proof, merge duplicates/conflicts, and return the reduction owned by `references/finding-and-reduction.md`.
4. Dispatch at most one focused reviewer inside this same review invocation when one concrete residual risk remains. Any additional focused reviewer requires explicit user authority.
5. Return `ready | findings | blocked-input | remediation-limit-reached` with the exact correction owner and affected proof/review coverage.

## Remediation Boundary

- This skill never edits. Accepted implementation-owned findings route to `implement-plan`.
- After remediation one or two, the caller owning the bounded delivery effort may invoke another complete review with fresh diff/proof.
- After remediation three, stop. Do not invoke review four or another correction without explicit user permission.
- A missing receipt never resets the limit. Do not persist counters, ledgers, hashes, or review state in the plan.
- If a bounded recovery review returns accepted implementation-owned findings and the remaining remediation budget cannot be established safely, report the findings and ask for explicit user permission before routing any correction.
- Design/spec/plan defects return to their semantic owner and follow the one-review/one-remediation design boundary; they do not consume implementation remediation authority.

Completion: coverage is complete for the admitted diff, every candidate is parent-dispositioned, proof claims match observable evidence, and the result neither edits nor exceeds the three-remediation boundary.
