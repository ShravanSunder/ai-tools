# ACPX Review Transport Spec

Status: current

## Product Intent

ACPX is the selected strategy for stronger external review lanes. Spec review,
plan review, and implementation review should be able to ask Claude, agy /
Gemini, Codex-compatible ACP agents, or other ACP agents for structured review
feedback without treating external prose as truth.

The parent reducer remains authoritative. ACPX carries review packets, events,
and structured candidate findings.

## Current Local Evidence

Observed locally:

```text
acpx --version        -> 0.11.2
acpx --help           -> supports codex, claude, gemini, compare, flow
acpx config show      -> defaultAgent=codex, defaultPermissions=approve-reads
acpx compare --help   -> multi-agent prompt comparison with json output
acpx flow --help      -> multi-step ACP workflow runner
acpx claude --help    -> one-shot exec, persistent prompt, sessions, status
```

This makes ACPX concrete enough to specify as the review transport. The first
implementation does not need to solve native Codex app-server thread control.

## Boundary Map

```text
spec / plan / implementation review skill
  owns: source packet, lane rubric, expected envelope, reduction rules

ACPX adapter
  owns: command invocation, agent selection, timeout, permission policy,
        stdout/stderr capture, malformed-output handling

external ACP agent
  owns: candidate review reasoning only

parent reducer
  owns: verification against source artifacts, acceptance, rejection, routing

phase owner
  owns: repairing spec, plan, or implementation after accepted findings
```

## Review Envelope

Every ACPX review lane return must use a versioned structured envelope:

```text
schema_version:
review_run_id:
lane_id:
backend:
model_or_agent:
scope:
source_packet:
trust_boundary:
status:
findings:
lane_confidence:
remaining_uncertainty:
completion_receipt:
```

Each finding includes:

- severity;
- title;
- evidence anchors;
- failure scenario;
- smallest fix or refinement;
- proof expectation;
- confidence;
- route target;
- security/trust-boundary status when applicable.

Malformed structured output is a lane error, not an accepted empty review.

## Trust And Permission Policy

Each external or cross-agent packet records:

- files or transcript excerpts sent;
- provider or agent backend;
- redaction/truncation policy;
- secrets policy;
- local vs external boundary;
- permission mode;
- timeout;
- whether writes/tools were denied, read-only, or explicitly approved.

Default review lanes should be read-only. For local smoke tests, prefer
`--deny-all` or `--approve-reads` plus bounded `--timeout`.

## Review Skill Integration

Review normalization stays skill-specific:

- `spec-review-swarm` owns spec review acceptance rubrics;
- `plan-review-swarm` owns plan review acceptance rubrics;
- `implementation-review-swarm` owns implementation review acceptance rubrics.

The ACPX adapter provides transport and envelope mechanics only. It does not
decide severity, route target, or readiness.

Substantial or high-risk spec and plan reviews must consider at least one ACPX
external lane unless the parent records why local review is sufficient.

## Requirements

R1. ACPX is the canonical external review transport for Claude, agy/Gemini, and
other ACP-compatible agents.

R2. ACPX review lanes must receive the same source packet discipline as local
reviewers: accepted requirements, source artifact, scope, review rubric, and
expected return envelope.

R3. External reviewer output is candidate evidence until the parent reducer
verifies it against the relevant spec, plan, diff, code, proof, or session
requirements packet.

R4. The adapter must support JSON output parsing, timeout handling, permission
policy selection, and malformed-output lane errors.

R5. The adapter must record local ACPX version/config evidence during proof or
diagnostic runs.

R6. ACPX is review/feedback transport. It does not own implementation,
planning, human authority, official loop state, or final acceptance.

## Non-Goals

- Do not introduce AGUI.
- Do not require Codex app-server thread control.
- Do not make reviewers authoritative.
- Do not send private transcripts or secrets to external agents by default.
- Do not require live external credentials for unit pressure tests.

## Proof Expectations

- Local smoke: `acpx --version`, `acpx --help`, `acpx config show`, and relevant
  agent/compare help commands pass.
- Unit or fixture test: malformed reviewer JSON becomes `lane_error`.
- Unit or fixture test: valid external finding is rejected by the parent reducer
  when source anchors do not support it.
- Pressure test: spec review and plan review use the same ACPX envelope but
  different skill-specific rubrics.
- Pressure test: a substantial high-risk plan review without an ACPX lane must
  explain why local-only review is sufficient.
