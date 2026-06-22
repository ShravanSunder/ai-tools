# Swarm Lane Contract

Use this reference for subagent lane packets in `shravan-dev-workflow` swarms.
It defines only the shared anatomy and invariants that apply across phases.
Skill-local references own lane names, phase behavior, examples, route
recommendations, proof modalities, review verdicts, and execution statuses.

## Universal Lane Packet Anatomy

Every substantial subagent lane packet includes:

- role / mode: what the lane is allowed to do and whether it is read-only,
  planning-only, review-only, or implementation-scoped
- edit boundary: exact allowed write scope, or an explicit read-only boundary
- bounded question: the one question this lane answers
- decision target: what parent decision or artifact this evidence informs
- source-of-truth inputs: paths, spec sections, requirements, plan rows, logs,
  docs, or command outputs that constrain the lane
- inspect list: exact paths, docs, commands, searches, or repos to inspect and
  why each matters
- non-goals: decisions, files, workflows, or behaviors this lane must not own
- lane-specific checklist: the phase-local checks the lane must perform
- output schema: fields the lane must return
- contradiction handling: how to report conflicts with source artifacts,
  live repo evidence, or sibling-lane evidence
- confidence: high | medium | low, with the uncertainty that remains
- security context: applicable | not applicable
- completion receipt: answered | blocked, with source anchors and artifact
  paths when artifacts are expected

## Security Context

`security context: not applicable` requires a short reason.

`security context: applicable` requires either:

- an exact pointer to the accepted parent security context plus lane-specific
  deltas, or
- expanded lane context covering assets, privileges, entry points, untrusted
  inputs, trust boundaries, sensitive data paths, privileged actions, and
  security non-goals.

Security-sensitive lanes call out forbidden broadening of filesystem, network,
subprocess, package-script, CI, MCP, plugin, agent, external-model, auth, or
secret boundaries.

## Candidate Evidence Invariant

Lane outputs are candidate evidence. They are not accepted truth, phase
completion, implementation completion, review completion, or proof completion
until the parent verifies and synthesizes them.

The parent reducer owns:

- checking lane claims against source anchors
- deduplicating overlapping findings or tasks
- preserving contradictions and unresolved questions
- deciding which evidence becomes accepted artifact content
- labeling residual risks, blockers, and proof gaps
- making final claims for the phase

## Artifact State Labels

Use explicit artifact labels:

- lane file: candidate evidence from one bounded lane
- parent ledger: reducer synthesis over lane outputs and source evidence
- phase artifact: accepted phase contract after parent verification
- durable docs: promoted source-of-truth documentation after docs maintenance

For substantial swarms, the parent preserves inspectable stage artifacts under
the project `tmp/` tree unless the user asked for chat-only/no-files, the work
is a single tiny local lane, or the tool surface cannot write artifacts. Record
the exception in the parent receipt.

Read-only lanes do not write files. They return candidate content and a
proposed artifact path; the parent writes the lane file or records the
chat-only/no-files exception. Lanes with explicit implementation write scope may
report changed paths inside that scope.

## Source Anchors And Receipts

Lane receipts include:

- lane name
- status: answered | blocked
- source anchors inspected
- artifact paths written by parent or proposed by the lane
- important contradictions
- remaining uncertainty
- confidence

Source anchors should be inspectable paths, line references, commands, URLs, or
searches. A general claim that a lane "looked at the repo" is not an anchor.
