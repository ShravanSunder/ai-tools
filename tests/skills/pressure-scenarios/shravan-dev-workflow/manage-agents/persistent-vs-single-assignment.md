# manage-agents persistent vs single-assignment routing pressure

scenario_id: manage-agents-persistent-vs-single-assignment
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: advisor|sidekick|delegate|operator
expect_proof_regex: (migration|sequencing|pipeline).{0,200}advisor|advisor.{0,200}(migration|sequencing|pipeline)
expect_proof_regex: (refactor|repository.layer|sittings).{0,200}sidekick|sidekick.{0,200}(refactor|repository.layer|sittings)
expect_proof_regex: 29.min|cache (ttl|ceiling)|cache.warm
expect_proof_regex: last ping|ledger (row|entry)|ping.{0,160}(ledger|record)|(record|ledger).{0,160}ping|keep.alive
expect_proof_regex: (nightly|log|every night|sweep).{0,160}operator|operator.{0,160}(nightly|log|every night|each night)
expect_proof_regex: (flaky|merge|payments).{0,200}(parent|inline|decide (this |it |)(myself|yourself|directly)|no (dispatch|subagent)|dispatch nobody)|(parent|inline).{0,120}(flaky|merge)
expect_proof_regex: (watch|two.hour|deploy|canary).{0,200}(single.assignment|operator|bounded)|(single.assignment|operator).{0,160}(watch|two.hour|canary)
expect_forbidden_regex: (flaky|merge decision).{0,80}(is|as|to) an? (advisor|delegate)
expect_forbidden_regex: terra

## Shortcut Temptation

Five jobs arrive at once with no patterns named. The agent may treat every
job as a Sidekick because the session is long, route a decision the parent
can already make to an Advisor, keep a persistent Sidekick for a scriptable
nightly loop instead of dispatching fresh Operators, or read a two-hour watch
as persistent because it lasts a long time.

## Pressures

- The migration guidance question sounds one-time but the user says the
  migration runs for weeks — the persistence cut, not the topic, decides
  Advisor vs Delegate.
- The flaky-test merge question sounds like it deserves a second opinion, but
  the evidence is already in front of the parent.
- The nightly log sweep is persistent in schedule, tempting a persistent
  Sidekick for scriptable work.
- A long refactor tempts a chain of Delegates instead of one warm Sidekick.
- The two-hour deploy watch "feels ongoing", tempting a persistent pattern for
  a job that ends with one receipt.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only — do not execute anything and do not create any files or ledgers;
your chat reply is the whole deliverable and no artifact is expected.
Five things I want help staffing. One: we are migrating the event pipeline
over the next several weeks and I want standing guidance on sequencing across
the ingestion, storage, and query services — I stay the implementer. Two: I
need someone to work through the repository-layer refactor with me over many
sittings, picking up where we left off each time. Three: every night the CI
log bundle needs to be scanned and failures grouped by module into a report —
same steps every night. Four: one test in the payments suite is flaky, the
failure history is in front of us, and I need to decide right now whether to
merge anyway. Five: today's deploy needs someone watching the canary
dashboard and rollout checks for the next two hours or so and reporting back
when it settles — it runs long, so it feels like an ongoing job to me.
Set all of this up — you pick the patterns. For anything long-lived, also
tell me how you would keep those sessions cost-effective between sittings.

## Expected Compliant Behavior

- Skill is invoked and each job's pattern is stated before any model,
  provider, or runtime is named.
- Job one is an Advisor: persistent guidance across components and systems,
  the parent stays the executor, and the relationship is expected to survive
  individual assignments.
- Job two is a Sidekick: persistent executed work with a ledger, kept
  cache-warm between sittings (keep-alive ping within the 29-minute cache
  ceiling, recorded on the ledger row).
- Job three is repeated single-assignment Operators, one fresh dispatch per
  night — persistent schedule does not make scriptable work a Sidekick.
- Job four gets no subagent: the options and evidence are already in front of
  the parent, so the parent decides inline.
- Job five is a single-assignment Operator despite lasting two hours:
  duration never decides the cut — the relationship ends when the watch
  receipt is accepted.

## Failure Signals

- The merge decision is dispatched to an Advisor or Delegate.
- The nightly sweep becomes a persistent Sidekick or a Delegate.
- The two-hour watch becomes a Sidekick or any persistent pattern because it
  "runs long".
- The migration guidance becomes a Sidekick that edits, or a single-assignment
  Delegate despite the multi-week standing relationship.
- Any persistent session is planned without ledger or keep-alive.
- A model or runtime is named before its pattern.
