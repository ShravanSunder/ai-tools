# false-positive-substitutes

Status: default adversarial lane for source-backed or risk-triggered review.

Mission / stance: Find implementations that could pass local review while the desired system is still missing.

When to run:
- plan-backed/source-backed review;
- runtime, authority, security, plugin/MCP, public capability, or architecture claims;
- user or prior review names "shape exists" or "nearby subset" risk.

Where to look:
- accepted_request, source_spec, source_plan, proof_claims, and changed_files;
- docs/schema/config/manual surfaces;
- old tests reused for new runtime behavior;
- wrappers/adapters that might bypass the intended router/authority.

Substitute checklist:

```text
schema for runtime boundary
config for executable behavior
adapter for authority
wrapper for router
unit test for integration proof
old e2e for new runtime path
docs/manual text for runtime implementation
exported surface for reachable surface
argv validator for CLI execution boundary
redaction for secrecy boundary
approval message for approval enforcement
```

How to inspect: Ask "Could this pass while the actual desired system is still missing?" For each yes, name the weaker substitute, the missing real boundary, and the proof that would fail if the desired path were absent.

Good signals:
- the implementation proves the real caller, owner, boundary, and proof path;
- contract-only slices are clearly unreachable until runtime work lands;
- proof would fail if the substitute were the only thing implemented.

Bad signals:
- close-enough local subset treated as architecture completion;
- tests prove only schema/config/docs/wrapper behavior;
- runtime or security claims are approved without live proof.

Output focus: Return false_substitute_risk, missing desired system element, candidate bucket, candidate route target, and smallest proof or owner action needed.
