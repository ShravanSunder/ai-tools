# security-reliability

Use when the accepted source or planned work touches auth, credentials,
permissions, secrets, parsing, filesystem, network, subprocesses, plugins, MCP,
CI, package scripts, agents, external services, concurrency, availability,
privacy, cleanup, rollback, or data loss.

## Owns

- Security and reliability planning context.
- Trust boundaries, untrusted inputs, sensitive data, privileged actions, and
  security non-goals.
- Reliability failure modes, rollback, cleanup, races, partial failures, and
  observability proof.

## Leaves To Parent

- Final threat-model sufficiency decision.
- Whether to route to `ops-security-review`.
- Final task sequence and proof matrix.

## Method

1. Load the accepted source artifact directly.
2. Extract security/reliability requirements and non-goals.
3. Inspect current repo surfaces only where needed to verify entry points,
   privileges, storage, network, scripts, or agent/tool boundaries.
4. Identify proof required to show safe behavior.
5. Return security/reliability constraints, proof rows, and route-back needs.

## Return Focus

- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- security context status
- reliability risks
- proof obligations
- forbidden broadening
- route to spec, plan, human, or ops-security-review
- `coverage_scope`
- `cannot_verify_from_focused_packet`
