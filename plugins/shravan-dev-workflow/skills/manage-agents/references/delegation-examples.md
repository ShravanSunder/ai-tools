# Delegation Examples

### Orchestration: a breakdown with three PRs

Main point: one 🐒 Sidekick per PR, and a dependent PR waits for its prerequisite.

The Lead's plan for saved searches has three PRs. PR 1 adds storage and an API in the search module; PR 2 adds a settings screen that calls that API; PR 3 adds sharing. PR 2 needs PR 1 merged first, and PR 3 needs neither.

Job to hand off: "Implement PR 1: its four slices, in order, from the plan."

1. Direction: the plan names each slice. Complete.
2. Span: the search module and the storage it owns. Local.
3. Horizon: four slices in a row before the next check, all decided by the plan. Planned.
4. Cut: name where the run ends: "run the full suite, push, open the PR, then report".
5. Role: related slices, each building on the last. 🐒 Sidekick. PR 3 gets its own Sidekick now; PR 2's starts once PR 1 lands.
6. Model: in the 🛠️ Worker and 🐒 Sidekick table, Complete · Local · Planned matches the Workhorse row.

### Orchestration: a slice blocked by a missing seam

Main point: cut before escalating; the Lead makes the design choice, and helpers bring evidence.

The PR 1 Sidekick stops at slice 4. The plan says the test waits for shutdown, but the service has no signal that shutdown finished, so the test could only sleep. It returns the gap to the Lead.

Job the Lead is tempted to hand off: "Make slice 4's test prove shutdown without sleeping."

1. Direction: the brief gives only the outcome; how the test learns that shutdown finished is left open. Partial.
2. Span: the service's shutdown code and its test. Local.
3. Horizon: how shutdown gets signalled is a choice other code will build on. Open.
4. Cut: the Lead makes that choice and writes it into the plan: the service emits a shutdown-finished event, and the test waits on it. Slice 4a adds the event; slice 4 waits on it. Both are Complete · Local · Planned. If the Lead lacks the facts to choose, it first hands off "trace the service's shutdown sequence and report, with file:line, where it could signal completion", then decides.
5. Role: more slices of the same PR go to the same 🐒 Sidekick; the evidence job is one 🛠️ Worker.
6. Model: in the 🛠️ Worker and 🐒 Sidekick table, the tempting job's Partial and Open match the Daily-driver rows. After the cut, Complete · Local · Planned matches the Workhorse row. The design choice itself goes to no helper, at any tier.

### Orchestration: PR wrap-up

Main point: a procedure goes to a 🔧 Operator; judgment comes back to the Lead.

Review came back clean. The PR needs its branch pushed, CI watched until it finishes, and the verified description file published.

Job to hand off: "Push, watch CI until it finishes, publish the description file, then report each check."

1. Direction: every step is given. Exact.
2. Span: one repository's PR. Local.
3. Horizon: a given procedure, then report. Step.
4. Cut: judging failures and calling the PR ready stay with the Lead.
5. Role: 🔧 Operator.
6. Model: the 🔧 Operator table has one row, Exact · any · Step. Workhorse.

### Research: how other libraries handle retries

Main point: independent units fan out; the choice stays with the Lead.

The Lead is designing the sync client's retry policy with the owner and wants evidence from three libraries before proposing one.

Job the Lead is tempted to hand off: "Find how libraries A, B, and C handle retries and tell me which to follow."

1. Direction: "which to follow" gives the outcome and leaves the approach open. Partial.
2. Span: each library's retry code, read, not changed. Local.
3. Horizon: the pick becomes our design, which later work builds on. Open.
4. Cut: the Lead keeps the choice and names the method. Three jobs: "in library A, trace the retry entry point through retryable-error classification, attempt limits, delay calculation, and the tests that cover them; report each with file:line", and the same for B and C. Each is Complete · Local · Planned.
5. Role: three independent jobs. Three 🛠️ Workers, fanned out.
6. Model: in the 🛠️ Worker and 🐒 Sidekick table, the tempting job's Partial and Open match the Daily-driver rows. After the cut, each job's Complete · Local · Planned matches the Workhorse row. The Lead compares the reports and proposes the policy.

### Research: questions that keep coming

Main point: related jobs that build on earlier answers go to one 🐒 Sidekick.

The Lead and the owner are redesigning how the sync engine stores state. Questions about the current storage code come up every few minutes: where a field is written, what reads it, what breaks if it moves.

Job to hand off: "For each question, trace the field's writes, reads, and serialization boundary, and answer with file:line; report uncertainty instead of choosing."

1. Direction: the method is named for every question. Complete.
2. Span: the sync engine's storage module and the contracts it uses. Local.
3. Horizon: each answer is one job the method already decided, then the next question. Planned.
4. Cut: none; the design choices stay with the Lead and the owner.
5. Role: each question goes faster with what the last answer found. A research 🐒 Sidekick, not a new 🛠️ Worker per question.
6. Model: in the 🛠️ Worker and 🐒 Sidekick table, Complete · Local · Planned matches the Workhorse row. Continuity changed the role, not the tier.

### Cross-system: split at the system boundary

Main point: split a cross-system change at the boundary; the Daily-driver row is for work that cannot be split.

The server returns prices as floats, and the mobile app rounds them wrong. The plan moves prices to integer cents and fixes the new response shape. Old app versions would break, so the server and the app release together.

Job the Lead is tempted to hand off: "Move the server and the app to integer cents; both ship together."

1. Direction: the plan names the new shape. Complete.
2. Span: the app is another system that consumes the server's contract. Cross-system.
3. Horizon: the plan made the choices. Planned.
4. Cut: the contract is settled, so each side can be built against it. Two jobs: "change the server to return integer cents per the plan" and "change the app to read integer cents per the plan", each Complete · Local · Planned. Releasing together is a gate the Lead holds after both land, not a reason to keep one executor.
5. Role: two independent jobs. Two 🛠️ Workers.
6. Model: in the 🛠️ Worker and 🐒 Sidekick table, each job's Complete · Local · Planned matches the Workhorse row. Only if neither side can be built or tested without the other changing at the same time does the job stay Complete · Cross-system · Planned, match the Daily-driver Cross-system row, and record the reason: the Workhorse lacks holding both sides of a contract that must change at once.
