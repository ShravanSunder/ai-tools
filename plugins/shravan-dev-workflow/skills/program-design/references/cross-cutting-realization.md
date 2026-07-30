# Cross-Cutting Realization

This reference owns structural realization of applicable quality obligations.

Expected inputs: specification obligations/non-goals, component/flow/failure models, platform constraints, and proof modalities.

Return: per-obligation owner, mechanism/boundary, normal behavior, failure/degradation behavior, proof seam, or reasoned not-applicable result.

Inspect when applicable:

```text
security and trust
privacy / data lifecycle / compliance
reliability and operability
performance / capacity / backpressure
accessibility
observability
platform compatibility
```

For security/trust, trace assets, actors, entry points, authentication/authorization decision owner, parsing/validation, secrets, least privilege, misuse containment, auditability, and proof.

For privacy/data lifecycle/compliance, trace collection/minimization, retention/deletion, residency/export, policy enforcement, audit, failure, and proof.

For reliability/operability, trace isolation, fallback/degradation, health, logs/traces/metrics, operator recovery, and proof.

For performance/capacity, trace budgeted boundary, queue/load/backpressure owner, overload degradation, measurement seam, and failure.

For accessibility/platform compatibility, name the structural enforcement point and real supported boundary rather than leaving a planner-owned test note.

Good: complete obligation → owner → control → failure/degradation → proof chain.

Bad: concern checklist, “secure by design,” or naming a tool/control without the policy owner and failure behavior.

Complete when: every applicable obligation has structural How and proof; omitted concerns have an inspectable not-applicable reason.
