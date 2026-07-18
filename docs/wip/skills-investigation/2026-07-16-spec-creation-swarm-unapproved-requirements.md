# 2026-07-16-spec-creation-swarm-unapproved-requirements

## Source

- Session, transcript, PR, issue, Slack thread, or manual note: Private Perseus
  Agent architecture and specification session.
- Related repo or workflow: `perseus-agent`;
  `shravan-dev-workflow:spec-creation-swarm`.
- Date observed: 2026-07-15 through 2026-07-16.

## What Went Wrong

- Observed behavior: A proposed non-React controller placement became the
  normative hard-cut requirement `HC-004`. The resulting specification also
  structurally rejected production `useChat` and `@ai-sdk/react`, even though
  the user had not selected those choices and earlier discussion supported
  retaining AI SDK chat behavior over a PI-backed transport.
- Expected behavior: The spec should distinguish code constraints, explicit
  user decisions, derived recommendations, and unresolved branches. An
  architecture lane may recommend a clean boundary, but it cannot silently
  convert that recommendation into a `MUST` or `MUST NOT`.
- Cost of the failure: Commit `b0c1f4` became a corrupted contract that guided
  the subsequent removal of `@ai-sdk/react` and construction of a bespoke
  controller platform.

## Evidence To Collect

- Relevant transcript excerpts:
  - The agent acknowledged that controller placement required confirmation.
  - The user questioned the placement rather than approving it.
  - The user separately required one keyed selector hook, no unrelated
    rerenders, Core isomorphism, and use of AI SDK streaming strengths.
- Files, commands, or logs:
  - Perseus commit `b0c1f4` introduces `HC-004`, rejects production
    `useChat`/`@ai-sdk/react`, and requires moving reusable product behavior out
    of React.
  - The earlier AI SDK evaluation spec retained exactly one internal AI SDK
    `Chat`/`useChat` as a viable architecture over a PI coordinator/transport.
- Existing skill or instruction that should have prevented it:
  `spec-creation-swarm` requires unresolved branches to be discussed and asks
  the parent to reduce lane results as accepted, contested, rejected, deferred,
  or open. It lacks a required authority source for load-bearing normative
  requirements.

## Failure Scenario To Pressure-Test

The architecture-clean-boundary lane recommends moving a controller outside
React. The minimal lane keeps `useChat`; current code supports both approaches;
the user has approved only "one semantic owner" and has not selected its
placement. The produced spec must preserve controller placement as an open
decision. It must not contain `MUST NOT use useChat` or describe the non-React
placement as accepted.

A second branch should test explicit non-goals: when the user says "session DB
isolation only; no new security features," automatic security investigation may
inspect the existing boundary but must not invent organization, principal,
role, or safe-DOM product requirements.

## Initial Classification

- Status: investigate
- Likely owner: `spec-creation-swarm`
- Candidate outcome: update existing skill

## Next Step

- What evidence is still missing: Decide the smallest provenance field required
  for normative requirements and whether explicit non-goals should constrain
  conditional security-lane output more strongly.
- Who or what should inspect it next: `skill-audit`; then evaluate
  `spec-creation-swarm` using the competing-lane and explicit-security-non-goal
  pressure scenarios.
