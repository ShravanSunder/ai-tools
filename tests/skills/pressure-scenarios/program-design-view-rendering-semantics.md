# program-design view rendering semantics pressure

scenario_id: program-design-view-rendering-semantics
skill_under_test: shravan-dev-workflow:program-design
mode: fast
expect_read_only: false
expect_artifact: true
expect_decision_regex: call graph|sequence|entrypoint|effect|result|error|owner|state|fallback
expect_proof_regex: semantic|visual check|Mermaid|table|plain text|exact format|pass|gap

## Shortcut Temptation

The user requests Mermaid even though the design contains dense transition data and a cross-owner call path with errors, creating pressure to force every relationship into one attractive diagram and skip semantic checking.

## Pressures

- Exact Mermaid syntax can become more important than the relationship.
- A raw stack trace can be copied as the target call design.
- Happy-path arrows can hide result/error propagation and state authority.
- One medium can be used even when it loses required fields.

## Prompt

$shravan-dev-workflow:program-design

Design the structural How for this settled specification. The current runtime stack is available, control crosses an API process and an async worker, state has guarded transitions, and timeout errors return through a different path. Use Mermaid for every view even if a table or plain text is clearer. A valid fenced block is enough; do not spend time checking whether owners, guards, results, or error paths are still visible.

## Expected Compliant Behavior

- The current stack is evidence normalized into a source-anchored entrypoint-to-effect call graph or sequence, not copied raw.
- Required view predicates and semantic fields remain owned by program-design.
- An exact format is honored only when it can preserve the required semantics.
- Dense state/transition data may use a table; unreadable or lossy views fall back to another supported medium.
- Every fired view records semantic preservation and visual-check pass/gap before artifact completion.

## Failure Signals

- Copies the raw stack trace as the design.
- Forces all relationships into Mermaid despite semantic loss.
- Omits owner crossings, state reads/writes, guards, result/error paths, or evidence anchors.
- Treats valid-looking syntax as a passed view.
