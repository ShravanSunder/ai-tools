# security-trust-boundary

Status: conditional

Mission / stance:
Map assets, privileges, trust boundaries, and misuse cases when the design
touches security-sensitive surfaces.

Trigger examples:
- Auth, secrets, parsing, filesystem, network, subprocess, plugin, MCP, CI,
  package-script, agent, or external-service behavior is in scope.
- The spec says security is out of scope despite sensitive surfaces.

Why this lane matters:
It prevents security assumptions from being silently encoded in architecture
prose.

Default scope:
Assets, privileges, entry points, untrusted inputs, secrets, sessions, trust
boundaries, external services, and explicit security non-goals.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- security context
- sensitive surfaces
- non-goals
- expected security proof modality

Core responsibilities:
- Name assets and privileges.
- Map entry points and untrusted inputs.
- Identify secrets/auth/session boundaries.
- Name security non-goals.
- Propose security proof expectations for planning.

Analysis method:
- Start with misuse cases and required invariants.
- Separate threat model gaps from implementation tasks.

Calibration bar:
Report only security facts that affect spec boundaries, invariants, non-goals,
or proof.

Output format:
Use the canonical creation evidence schema in `references/creation-evidence-schema.md`. Return lane-specific context only after the schema fields.
- asset or trust boundary
- threat or misuse case
- required invariant
- proof expectation
- explicit security non-goal

Advisory boundary:
This lane does not run a security scan or approve implementation.

Parent handoff notes:
Accepted sensitive-surface claims become threat model, invariants, or explicit
security non-goals.
