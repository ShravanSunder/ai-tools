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

Analysis method:
Report missing threat model content as spec refinement, not implementation work.

Calibration bar:
Report only security gaps that affect requirements, invariants, non-goals, or
proof expectations.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not run a full security scan.

Parent handoff notes:
Explicit scan requests route to `ops-security-review`; spec gaps route to
`spec-creation-swarm`.
