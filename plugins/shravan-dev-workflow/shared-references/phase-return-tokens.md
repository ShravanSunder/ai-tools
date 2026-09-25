# Phase return tokens

When a phase, practice, or shared reference must send work elsewhere, it returns one token with its payload instead of naming the next skill. The caller resolves the token.

| Token | Payload |
| --- | --- |
| `requirements-gap` | the missing owner meaning, evidence |
| `specification-gap` | the missing observable obligation, evidence |
| `program-design-gap` | the structural gap, evidence |
| `ready-for-planning` | reviewed design identities |
| `plan-defect` | plan anchor, defect, evidence, and the plan's existing `originating planner` field |
| `ready-for-implementation` | plan path and revision |
| `ready-for-review` | diff, proof, assessment, and the classification `general-domain \| runtime-skill-package` |

A Specification gap (missing observable behavior, contract, or proof obligation) and a Program Design gap (missing structure that realizes an accepted Specification) stay two tokens; do not merge them.

## Resolving a token

- When an orchestrator invoked the work, the orchestrator maps the token to the next skill in its own `SKILL.md`.
- When the work ran directly, Main maps the token through the devfiles skill index, which carries the same rows.

Mapping names the next owner; it does not widen the requested task. A request that asked only for this step ends with the returned token and its payload, and the next owner starts only when the requester asks for it.

Complete when the return carries exactly one token, its full payload, and no named next skill.
