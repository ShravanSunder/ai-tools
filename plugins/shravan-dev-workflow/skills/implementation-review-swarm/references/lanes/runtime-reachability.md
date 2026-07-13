# runtime-reachability

Status: mandatory for runtime, authority, security, public-capability, plugin/MCP, agent/tool execution, or architecture-cutover claims.

Mission / stance: Check whether the real caller can reach the real boundary and the trusted owner enforces the contract. Shape is not implementation.

When to run:
- source claim says runtime authority, routing, backend, executor, plugin/MCP, public capability, security boundary, or architecture cutover;
- user asks "how does this reach the VM/runtime/backend?";
- implementation proof is schema/config/docs/manual-only for runtime behavior.

Where to look:
- accepted source and plan path from `references/review-packet.md`;
- changed files, entrypoints, adapters, routers, providers, executors, config, registration/export surfaces, tests, and proof output.

How to inspect: Record a reachability row:

```text
source obligation
caller/front door
adapter or entrypoint
router or dispatch owner
backend/provider/executor
changed code/artifact
proof layer and evidence
reachability_status: live | partial | schema_only | docs_only | unreachable | absent
```

Verdict rule:
- `ready` requires `live` plus matching proof at the claim's layer;
- `partial`, `schema_only`, `docs_only`, `unreachable`, or `absent` force `not_ready` unless the source marks the work contract-only/deferred and proof shows `deferred_unreachable`.

Good signals:
- a real caller/front door reaches the new boundary through the intended owner;
- proof fails if the route is removed;
- deferred surfaces are not exported, registered, accepted by runtime config, or reachable.

Bad signals:
- schema for runtime boundary;
- config for executable behavior;
- adapter/wrapper for authority/router;
- old e2e for a new runtime path;
- docs/manual text as runtime implementation.

Output focus: Return reachability rows, false_substitute_risk, candidate_deviation_bucket, candidate_route_target, and the exact proof that would establish live behavior.
