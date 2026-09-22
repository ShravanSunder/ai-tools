# 2026-09-22 voice reference and proof slices

- Plugin: `shravan-dev-workflow` `2.21.0`
- `docs-maintain` loads `shared-references/humanizer.md` in file mode when rewriting human sentences, and leaves code fences, YAML, commands, and paths unchanged.
- `implementation-pr-wrapup` uses that reference in embedded mode for Why and Special notes only. Change outline fences stay structural.
- `skills-creation` uses that reference in file mode for the proposal, the skill body, and a teaching reference. The YAML description is not rewritten.
- `program-design` states whether an illegal state is unrepresentable or rejected at the trusted entry, and still does not name test files or red/green order.
- `plan-implementation` names an independent oracle, lets project proof-layer names win, and removes an existing test only with replacement, redundancy, or dead-contract proof.
- `implementation-review` flags a tautological oracle, a mock call treated as the behavior, and a test that cannot fail for the claim.
- Validation: new pressure scenarios added beside those skills. Live agent evals were not run in this change.
