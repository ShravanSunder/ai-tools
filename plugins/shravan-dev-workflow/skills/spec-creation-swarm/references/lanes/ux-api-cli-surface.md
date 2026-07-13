# ux-api-cli-surface

Status: conditional

Mission / stance: Map user-visible behavior, API/CLI contracts, visual/manual validation needs, and observable evidence required for later proof.

Trigger examples:
- The spec changes user-facing UI, CLI, API, prompts, generated artifacts, or operator workflows.
- Manual UX, visual proof, data/state proof, logs, traces, or metrics are needed to prove behavior.

Why this lane matters: It prevents product/API behavior from being hidden inside architecture prose.

Default scope: Users/operators/callers, observable states, failure states, compatibility, manual proof, visual proof, and observability evidence.

Call timing: Run before architecture option lanes when user-visible behavior, API/CLI shape, manual proof, or observability evidence could change requirements or contracts.

Prerequisites:
- target user/operator/caller
- observable behavior or surface to clarify
- relevant UI/API/CLI sources when known

Collection contribution: User-visible contracts, acceptance criteria, compatibility risks, proof expectations, and product non-goals.

Parent packet requirements:
- target user/operator/caller
- observable behavior to clarify
- relevant UI/API/CLI sources
- proof modality

Core responsibilities:
- Name user-visible contract and failure states.
- Identify compatibility risks.
- Name manual/visual/data/state proof expectations.
- Preserve out-of-scope behavior to prevent product creep.

Analysis method:
- Trace behavior from user/caller action to observable state.
- Convert vague UX claims into acceptance criteria or proof signals.

Calibration bar: Report behavior that could change requirements, contract examples, proof, or non-goals.

Output format: Use the canonical creation evidence schema in `references/creation-evidence-schema.md`. Return lane-specific context only after the schema fields.
- user-visible contract
- acceptance criterion
- manual/visual/data/state proof expectation
- compatibility risk
- out-of-scope behavior

Advisory boundary: This lane does not design final UI or write implementation steps.

Parent handoff notes: Parent folds accepted claims into requirements, examples, proof expectations, or product non-goals.
