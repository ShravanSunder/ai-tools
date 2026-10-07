# Delegation Examples

### Orchestration: a breakdown with three PRs

Main point: one 🐒 Sidekick per PR, and a dependent PR waits for its prerequisite.

The Lead's plan for saved searches has three PRs. PR 1 adds storage and an API in the search module; PR 2 adds a settings screen that calls that API; PR 3 adds sharing. PR 2 needs PR 1 merged first, and PR 3 needs neither.

Job to hand off: "Implement PR 1: its four slices, in order, from the plan."

1. Direction: the plan names each slice. Complete.
2. Span: the search module and the storage it owns. Local.
3. Horizon: four slices make one PR, checked against the plan's proof. Milestone.
4. Cut: name where the milestone ends: "run the full suite, push, open the PR, then report".
5. Role: only a 🐒 Sidekick closes a Milestone, and each slice builds on the last. PR 3 gets its own Sidekick now; PR 2's starts once PR 1 lands.
6. Model: in the 🐒 Sidekick table, Complete · Local matches the Workhorse row.

### Orchestration: a slice blocked by a missing seam

Main point: cut before escalating; the Lead makes the design choice, and other agents bring evidence.

The PR 1 Sidekick stops at slice 4. The plan says the test waits for shutdown, but the service has no signal that shutdown finished, so the test could only sleep. It returns the gap to the Lead.

Job the Lead is tempted to hand off: "Make slice 4's test prove shutdown without sleeping."

1. Direction: the brief gives only the outcome, and how shutdown gets signalled is a choice other code will build on. Partial.
2. Span: the service's shutdown code and its test. Local.
3. Horizon: one slice, checked against its acceptance check. Task.
4. Cut: the Lead makes that choice and writes it into the plan: the service emits a shutdown-finished event, and the test waits on it. Slice 4a adds the event; slice 4 waits on it. Both are Complete · Local, one Task each. If the Lead lacks the facts to choose, it first hands off "trace the service's shutdown sequence and report, with file:line, where it could signal completion", then decides.
5. Role: more slices of the same PR go to the same 🐒 Sidekick; the evidence job is one Task that stands alone, so one 🛠️ Worker.
6. Model: Partial · Local matches no 🛠️ Worker or 🐒 Sidekick row, so the tempting job is not ready to hand off. After the cut, the remaining slices are Complete · Local and stay on the 🐒 Sidekick Workhorse row. The evidence 🛠️ Worker is Complete · Local, which matches no Worker row (Workhorse is Exact · Local; Daily driver is Complete · Cross-domain). The design choice itself goes to no other agent, at any tier.

### Orchestration: PR wrap-up

Main point: a written procedure goes to a 🔧 Operator; judgment comes back to the Lead.

Review came back clean. The PR needs its branch pushed, CI watched until it finishes, and the verified description file published.

Job to hand off: "Push, watch CI until it finishes, publish the description file, then report each check."

1. Direction: every step is given. Exact.
2. Span: one repository's PR. Local.
3. Horizon: each step is checked against its expected result, with no judgment between them. Subtask.
4. Cut: judging failures and calling the PR ready stay with the Lead.
5. Role: an Exact Subtask. 🔧 Operator.
6. Model: in the 🔧 Operator table, Exact matches its Workhorse row.

### Research: how other libraries handle retries

Main point: independent units fan out; the choice stays with the Lead.

The Lead is designing the sync client's retry policy with the owner and wants evidence from three libraries before proposing one.

Job the Lead is tempted to hand off: "Find how libraries A, B, and C handle retries and tell me which to follow."

1. Direction: "which to follow" gives the outcome and leaves the design choice open. Partial.
2. Span: each library's retry code, read, not changed. Local.
3. Horizon: three findings and a recommendation, checked only at the end. Milestone.
4. Cut: the Lead keeps the choice and names the method. Three jobs: "in library A, trace the retry entry point through retryable-error classification, attempt limits, delay calculation, and the tests that cover them; report each with file:line", and the same for B and C. Each is Complete · Local, one Task checked against its report.
5. Role: three Tasks that stand alone. Three 🛠️ Workers, fanned out.
6. Model: Partial · Local matches no 🛠️ Worker row, so the tempting job is not ready to hand off. After the cut, each job is Complete · Local, which matches no Worker row (Workhorse is Exact · Local; Daily driver is Complete · Cross-domain). The Lead compares the reports and proposes the policy.

### Research: questions that keep coming

Main point: horizon allows a Worker, and continuity picks a 🐒 Sidekick.

The Lead and the owner are redesigning how the sync engine stores state. Questions about the current storage code come up every few minutes: where a field is written, what reads it, what breaks if it moves.

Job to hand off: "For each question, trace the field's writes, reads, and serialization boundary, and answer with file:line; report uncertainty instead of choosing."

1. Direction: the method is named for every question. Complete.
2. Span: the sync engine's storage module and the contracts it uses. Local.
3. Horizon: each answer is checked by the Lead before the next question. Task.
4. Cut: none; the design choices stay with the Lead and the owner.
5. Role: a Task allows a 🛠️ Worker or a 🐒 Sidekick. Each question goes faster with what the last answer found, so a research Sidekick.
6. Model: in the 🐒 Sidekick table, Complete · Local matches the Workhorse row. Continuity changed the role, not the tier.

### Cross-system: split at the system boundary

Main point: split a cross-system change at the boundary; work that cannot be split goes to the owner.

The server returns prices as floats, and the mobile app rounds them wrong. The plan moves prices to integer cents and fixes the new response shape. Old app versions would break, so the server and the app release together.

Job the Lead is tempted to hand off: "Move the server and the app to integer cents; both ship together."

1. Direction: the plan names the new shape. Complete.
2. Span: the app is another system that consumes the server's contract. Cross-system.
3. Horizon: both sides, checked together at release. Milestone.
4. Cut: the contract is settled, so each side can be built against it. Two jobs: "change the server to return integer cents per the plan" and "change the app to read integer cents per the plan", each Complete · Local, one Task. Releasing together is a gate the Lead holds after both land, not a reason to keep one executor.
5. Role: two Tasks that stand alone. Two 🛠️ Workers.
6. Model: in the 🛠️ Worker table, each job's Complete · Local matches no row (Workhorse is Exact · Local; Daily driver is Complete · Cross-domain). The tempting job's Complete · Cross-system matches no row. If neither side can be built or tested without the other changing at the same time, the Lead brings it to the owner, who can name a model for one 🐒 Sidekick to hold both sides.
