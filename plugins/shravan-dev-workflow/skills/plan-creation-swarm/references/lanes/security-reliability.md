# security-reliability

Status: conditional, mandatory when sensitive or reliability-critical surfaces exist

Mission / stance:
Plan security and reliability obligations before implementation changes begin.
This lane converts sensitive surfaces and failure modes into plan constraints
and proof gates.

When to run:
- Auth, secrets, untrusted input, parsing, filesystem, network, subprocess,
  plugin, MCP, CI, package scripts, agents, external services, rollback, cleanup,
  concurrency, retries, cancellation, or observability are in scope.

Call timing:
Run in the first planning batch when sensitive surfaces are already known. If
security applicability is unclear, run a small discovery packet before
vertical-slice decomposition hardens the work split.

Prerequisites:
- source artifact and current security/reliability context
- sensitive surfaces or uncertainty to investigate
- non-goals and approved scope

Where to look:
- auth/secrets/config boundaries
- filesystem/network/subprocess surfaces
- plugin/MCP/agent boundaries
- rollback, cleanup, partial-failure, race, timeout, and observability paths

How to think:
For each slice or source requirement, ask what can fail, leak, race, persist
incorrectly, or cross a trust boundary. Tie each concern to a plan constraint
and proof signal.

Collection contribution:
- security/reliability constraints for slice cards
- required proof gates and observability evidence
- rollback/cleanup/recovery notes
- sensitive-surface split/replan triggers

Output focus:
Return concrete plan constraints and proof requirements. Do not run a security
scan or invent implementation fixes.
