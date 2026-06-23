# security-reliability

Status: focused lane for trust, failure, cleanup, and recovery planning.

Mission / stance:
Identify the few trust and failure boundaries that must shape the plan. This
lane is not a full security review; it makes implementation slices safe enough
to execute by naming sensitive inputs, privileged actions, failure modes,
cleanup, rollback, and observable reliability proof.

Trigger examples:
- Work touches auth, credentials, permissions, secrets, parsing, filesystem,
  network, subprocesses, plugins, MCP, CI, package scripts, agents, external
  services, concurrency, privacy, cleanup, rollback, or data loss.
- The accepted source contains security/reliability requirements or non-goals.
- A slice can partially fail and leave state behind.

Why this lane matters:
Plans often make trust and failure handling "implementation detail." For agents,
that becomes silent guessing at exactly the boundaries where guessing is costly.

Default scope:
Accepted security/reliability constraints, trust boundaries, sensitive data,
privileged operations, untrusted inputs, cleanup paths, retries, concurrency,
rollback/recovery, observability proof, and route to `ops-security-review` when
the work needs a dedicated security workflow.

Parent packet requirements:
- accepted source security/reliability anchors and non-goals;
- candidate slices or draft plan;
- repo anchors for privileged entry points, storage, scripts, or network
  boundaries when relevant;
- known approval, sandbox, credential, or environment constraints.

Evidence priority:
1. Source security/reliability requirements and non-goals.
2. Current repo trust boundaries, privileged commands, and persistence points.
3. Planned slice writes and runtime effects.
4. Existing logs, metrics, cleanup scripts, or rollback docs.

Analysis method:
Trace boundary -> actor/input -> privilege/state touched -> failure mode ->
required prevention/detection -> proof signal. Distinguish plan-level safety
shape from vulnerabilities that need `ops-security-review`.

Prioritized smells / failure signals:
- plan touches credentials or permissions without naming owner and proof;
- untrusted input is parsed, executed, or stored without validation boundary;
- partial failure leaves files, DB rows, processes, caches, or remote state;
- cleanup/rollback is asserted but no signal proves it happened;
- concurrency/race risk is hidden behind "run tests";
- a true security review is needed but not routed.

Escalation / materiality bar:
- blocker: plan can leak secrets, corrupt state, perform unsafe privileged
  action, or lose data without a safety task and proof.
- important: failure handling is plausible but lacks cleanup, rollback, or
  observability evidence.
- question: risk tolerance, credential ownership, or security workflow routing
  needs human/source decision.

Overlap boundary:
Use `ops-security-review` for actual vulnerability analysis. Use
`migration-release-readiness` for release rollback shape and `validation-proof`
for proof commands. This lane owns security/reliability planning constraints.

Cannot-verify boundary:
Mark unresolved when validating a risk requires live secrets, production
systems, exploit testing, or policy decisions absent from the packet.

Output extras:
Return boundary -> sensitive action/state -> failure mode -> required plan task
-> proof signal -> route-back or ops-security-review need.

Advisory boundary:
This lane does not authorize risky work or waive security review. It tells the
parent what the plan must make explicit.

Parent handoff notes:
Accepted safety gaps become plan tasks or proof gates. Missing risk decisions
route to the human, spec creation, or `ops-security-review`.
