# Agent Job Packet

This reference owns the execution details that complete an assignment contract; it does not replace the owning phase's assignment, governing sources, authority bounds, completion or escalation conditions, or result or proof contract.

## Dispatch

Dispatch is ready only when the assignment has a bounded outcome, resolvable source context (inline sources suffice for a self-contained task), authority, stop or escalation condition, and an acceptance check chosen by the assigning agent before dispatch; reuse the owning phase proof contract.

For a new agent assignment, reuse that contract and resolve executor, model and effort, history, access, runtime, continuity, and acceptance in tool arguments or session configuration where supported. A fresh recipient must be able to resolve the canonical plan or slice sources and the applicable scope and proof contract; include exact paths or inline necessary content, rather than an unusable pointer or parent history dump.

Missing inputs block dispatch; they do not become Partial direction. Prose supplies only missing task context.

A direct task instead uses a concise brief with outcome, relevant sources, explicit authority, stop or escalation condition, and expected evidence. For example: "From the attached CI output, report each failed command, its exit code and first error, with source lines. No file edits. Stop when all failures are accounted for, or report missing evidence; I will compare the cited lines with the output before accepting the report."

Do not impose a universal field layout, date slug, classification string, or new identifier. Reuse existing names, paths, session identities, and source versions where they help bind evidence to the assignment.

Same-assignment follow-ups carry only the delta and new evidence; preserve established scope and identity. A new assignment refreshes the contract without replacing a continuing Sidekick or Advisor conversation.

### Readers

Reader authority is stated once in the assignment contract: `workspace read-only` allows no repo edits except scratch files under project `tmp/` or system `/tmp`. An attempted repo edit outside those scratch locations stops the assignment. Parent verification checks that the worktree is unchanged.

`read-only + exec <listed commands>` grants only those commands, permits their output under project `tmp/` or system `/tmp`, and still forbids repo edits. Parent verification checks that every reported command was granted and that the worktree is unchanged.

### Writers

Writer authority names the allowed paths once. Before an edit outside them, stop and report blocked; if a violation is discovered, stop and report it. Parent verification still checks the actual diff scope. How a host enforces or only declares that bound is owned by the native-provider or ACPX provider reference selected for the launch.

## Operator Exception

When an Operator reaches work requiring judgment or authority, return observed evidence, the needed decision, and a safe waiting state; proceed only after authorization.

## Reduction

Reuse the owning phase's result or reduction contract. Where none exists, return a short result: status, assignment-bound evidence, checks, and next action. `local` proves record or liveness only. `provider-active` proves provider attachment and selected model evidence. `assignment-output` proves captured output matches the assignment and current source or session context. `parent-verified` proves the parent checked an accepted claim against primary evidence. Only current `assignment-output` enters reduction.
