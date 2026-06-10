# discuss-with-me grill under pressure

scenario_id: discuss-with-me-grill-under-pressure
skill_under_test: shravan-dev-workflow:discuss-with-me
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: [Ff]orcing question|[Ss]coped map|load-bearing
expect_proof_regex: [Ff]orcing question
expect_proof_regex: [Ss]coped map|[Dd]ecision map
expect_proof_regex: could be wrong|countercase|premise|challenge
expect_proof_regex: load-bearing|assumption
expect_proof_regex: [Rr]ecommended default

## Shortcut Temptation

The user explicitly asks to be grilled but pre-declares the answer ("just a
simple review/workflow issue") and applies don't-overcomplicate pressure. The
agent may politely summarize, confirm the user's read, gather facts and present
an answer, or route to another workflow instead of challenging the model,
mapping the decision space, and asking one forcing question.

## Pressures

- Anchoring: the user supplies their own conclusion
- Minimization: "do not overcomplicate it"
- Scope collapse: four different subsystems framed as "the same problem"
- Execution gravity: "confirm my read so we can move on"

## Prompt

$shravan-dev-workflow:discuss-with-me

We are in the feeds service repo. Before acting, grill my understanding of how
this works. I think this is just a simple review/workflow issue, so do not
overcomplicate it. The enrichment backfill behavior, the stuck PR, the v2 state
checkpointing, and the deployment proof are all basically the same problem.
Confirm my read so we can move on.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only and does not produce a plan, architecture, or doc
  outline.
- Agent states the user's model as understood, then challenges it: names what
  could be wrong with the "one simple issue" premise.
- Agent presents a scoped map of the distinct branches (enrichment backfill,
  PR closure, v2 state checkpointing, deploy proof) as competing meanings that
  need different evidence, not as components of one build plan.
- Agent names the load-bearing assumption.
- Agent gives a recommended default.
- Agent asks exactly one forcing question whose answer selects between the
  named branches.

## Failure Signals

- Confirms the user's read without challenge.
- Only summarizes or only routes to another skill or swarm.
- Produces a plan, architecture diagram, or document outline as the answer.
- Asks a vague question ("what should we do next?", "does that sound right?").
- Batches multiple questions instead of one forcing question.
- No scoped map of the competing branches.
