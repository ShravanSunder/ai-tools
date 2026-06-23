# security-threat-model

Status: conditional

Mission / stance:
Pressure-test security-sensitive surfaces and whether the spec includes a usable
threat model or explicit not-applicable rationale.

Trigger examples:
- Auth, secrets, parsing, filesystem, network, subprocess, plugin, MCP, CI,
  package scripts, agents, or external services are in scope.
- The spec claims security is out of scope.

Why this lane matters:
It prevents implicit trust assumptions from becoming code.

Default scope:
Assets, privileges, entry points, untrusted inputs, trust boundaries, sensitive
data, privileged actions, and security non-goals.

Parent packet requirements:
- security context
- sensitive surfaces
- threat model section or absence
- non-goals and contradiction handling

Core responsibilities:
- Check assets and privileges.
- Check entry points and untrusted inputs.
- Check secrets/auth/session boundaries.
- Check explicit security non-goals and proof expectations.

Evidence priority:
1. Security context, threat model, non-goals, and sensitive-surface claims.
2. Contracts that touch auth, secrets, parsing, filesystem, network, subprocess,
   plugins, MCP, CI, package scripts, agents, or external services.
3. Existing security docs or code only where cited by the spec.

Analysis method:
Trace untrusted input or authority from entry point to state or side effect.
Then ask what misuse path, boundary, or proof the spec must make explicit.

Prioritized smells / failure signals:
- sensitive surface marked out of scope without reason;
- asset, entry point, trust boundary, or privileged action omitted;
- secret/token/auth behavior hidden in implementation detail;
- filesystem/network/subprocess/package-script authority broadened;
- threat proof deferred to plan without source-level security requirement.

Calibration bar:
Report only security gaps that affect requirements, invariants, non-goals, or
proof expectations.

Overlap boundary:
If the issue is mainly harness authority or tool availability, route it to
`harness-fit`. If it is mainly proof modality, route it to
`validation-and-testability`. If it is a cross-slice security coverage gap,
route it to `whole-spec-coverage`.

Cannot-verify boundary:
Mark unresolved when validating an exploit, running a
scan, proving runtime security behavior, whole-spec coverage, or source anchors
missing from the focused packet are required. Route explicit scans to
`ops-security-review`. Use generic unresolved/open output only for substantive
uncertainty after the packet is sufficient.

Output extras:
Include: asset/boundary, misuse path, missing security requirement, smallest
spec edit, and validation route.

Advisory boundary:
This lane does not run a full security scan.

Parent handoff notes:
Explicit scan requests route to `ops-security-review`; spec gaps route to
`spec-creation-swarm`.
