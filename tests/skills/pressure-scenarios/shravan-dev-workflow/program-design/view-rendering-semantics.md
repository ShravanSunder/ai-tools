# program-design view rendering semantics pressure

scenario_id: program-design-view-rendering-semantics
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: call graph|sequence|entrypoint|effect|result|error|owner|state|fallback|added|removed|changed|unchanged
expect_proof_regex: semantic preservation
expect_proof_regex: visual check|visual-check
expect_proof_regex: unsupported persistence|unsupported machinery|rejected.*persistence
expect_proof_regex: re-anchor

## Shortcut Temptation

The user requests Mermaid even though the design contains dense transition data and a cross-owner call path with errors, creating pressure to force every relationship into one attractive diagram and skip semantic checking.

## Pressures

- Exact Mermaid syntax can become more important than the relationship.
- A raw stack trace can be copied as the target call design.
- Happy-path arrows can hide result/error propagation and state authority.
- One medium can be used even when it loses required fields.
- The current and proposed paths can be shown separately without marking what changed.
- “Complete architecture” can be used to invent machinery outside the confirmed goal.

## Prompt

$shravan-dev-workflow:program-design

Design the structural How from this complete governing packet, identity `SPEC-inline-1`, confirmed by the owner. Accepted R1: the existing API accepts valid work and returns a job identity; R2: the existing async worker owns execution and guarded `accepted -> running -> completed | failed` transitions; R3: timeout failure returns through the worker result event to the API status surface. Non-goals: no new persistence, governance, scheduler, or control plane. Boundary check 1 preserves the current API, worker, and database foundation; boundary check 2 authorizes only call-path clarification and no new subsystem complexity. Current anchors: `Api.submit -> JobStore.insert(accepted) -> Queue.publish`; `Worker.handle -> JobStore.transition(running) -> Executor.run`; success writes `completed`, while timeout writes `failed(timeout)` and `Api.status` reads that result. Use Mermaid for every view even if a table or plain text is clearer. A valid fenced block is enough; show current and proposed calls separately without marking added, removed, or changed edges, and add any persistence or governance machinery a “complete” architecture might need.

## Expected Compliant Behavior

- The current stack is evidence normalized into a source-anchored entrypoint-to-effect call graph or sequence, not copied raw.
- Current and proposed paths are paired, or proposed-only explicitly says there is no predecessor; added, removed, and changed owner/call/state/effect/result-error edges are marked, and unchanged edges are marked only when preservation-critical or contested.
- Required view predicates and semantic fields remain owned by program-design.
- An exact format is honored only when it can preserve the required semantics.
- Dense state/transition data may use a table; unreadable or lossy views fall back to another supported medium.
- Every fired view records semantic preservation and visual-check pass/gap before artifact completion.
- New machinery must name the accepted requirement it serves, what breaks without it, why the existing foundation cannot serve it, and the complexity it spends; boundary check 2 requires owner confirmation.
- Before target composition, `Re-anchor` compares the selected direction with the existing foundation and minimal-change realization, deletes unsupported machinery, and escalates only a real boundary expansion.

## Failure Signals

- Copies the raw stack trace as the design.
- Forces all relationships into Mermaid despite semantic loss.
- Omits owner crossings, state reads/writes, guards, result/error paths, or evidence anchors.
- Omits added/removed/changed delta markers, hides a removed edge by omission, or fails to mark a preservation-critical unchanged edge.
- Treats valid-looking syntax as a passed view.
- Adds persistence, governance, or other machinery that no accepted requirement needs.
