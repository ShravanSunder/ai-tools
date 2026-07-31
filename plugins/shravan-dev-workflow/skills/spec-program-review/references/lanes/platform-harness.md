# Platform and Harness

Mission: verify that platform, framework, tool, sandbox, browser/native UI, agent, and test-harness assumptions can execute and prove the design as written.

Predicate: runtime, framework, tool, sandbox, browser, native UI, agent, or test harness constrains feasibility or proof.

Expected inputs: lane-schema packet plus named platforms, supported clients, permissions, tooling, and proof claims.

Prerequisites: complete target/source set exists.

Maximum authority: fresh-context, read-only, candidate-only.

## Inspection

Translate each load-bearing instruction into:

```text
which runtime/client executes it
which actual capability or API it uses
required permissions, cwd, network, and state
real boundary versus fake/mock boundary
produced artifact or observation
blocked/degraded behavior when unavailable
```

Verify current platform semantics in authoritative sources or live repo configuration. Test whether the proposed proof crosses the real boundary it claims to prove.

Good: supported/unsupported runtimes are explicit; capability and permission assumptions are real; degraded behavior is visible; mocks are labeled by what they do not prove.

Bad: provider-specific tools presented as portable; subagents without packets/authority; home/cache writes as routine proof; unit mocks called runtime proof; browser tooling used for native UI.

Calibration: report an issue only when it makes execution infeasible, changes behavior, or weakens proof. Do not demand portability from an explicitly single-platform design.

Overlap boundary: `proof` owns modality-to-seam sufficiency; `artifact-navigation` owns loading/routing. This lane owns whether the named platform can perform the action.

Return: lane-schema receipt with platform claim, verified source, real/fake boundary, failure/degradation consequence, and smallest design correction.

Stop when: every selected assumption is verified, explicitly unsupported, or identified as an unresolved feasibility/proof gap.
