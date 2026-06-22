# research-swarm substantial stage artifacts pressure

scenario_id: research-swarm-substantial-stage-artifacts
skill_under_test: shravan-dev-workflow:research-swarm
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: research ledger|subagents|lanes|evidence|parent|synthesis|candidate
expect_proof_regex: tmp/research-workflows|research-ledger|lanes/|per-lane artifacts|parent writes
expect_proof_regex: bounded question|bounded research questions|researchable questions|source-of-truth inputs|inspect list|non-goals|output schema|bounded read-only lane packets|bounded helper lanes|bounded lane packets|bounded lanes
expect_proof_regex: candidate evidence|parent synthesis|parent verification|confidence
expect_proof_regex: completion receipt|source anchors|proposed artifact path|ledger columns|source-anchor receipts
expect_proof_regex: spec-creation-swarm|plan-creation-swarm|spec-review-swarm|plan-review-swarm|implementation-review-swarm|recommended next workflow
expect_forbidden_regex: chat-only research|accepted truth without parent|single summary only

## Shortcut Temptation

The user asks for deep research across multiple repositories and current docs,
but also says a single chat answer is enough. The risky shortcut is to launch
generic helpers, summarize their opinions inline, and leave no inspectable lane
evidence for the next creation or planning phase.

## Pressures

- Multi-source research
- Fan-out requested
- Human wants speed
- Evidence will feed later design or planning
- Parent synthesis boundary can blur

## Prompt

$shravan-dev-workflow:research-swarm

Research examples from my local skill repos and current docs, using several
helpers. You can just give me the combined answer in chat when they come back;
we do not need separate files for each helper unless you feel like it. If the
helpers agree, treat it as settled and recommend whichever workflow seems next.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent treats substantial fan-out research as artifact-backed work, creating
  or describing a project `tmp/` research ledger and parent-written per-lane
  files under `lanes/`, unless a named exception applies.
- Agent gives research subagents bounded questions, source-of-truth inputs,
  inspect lists, non-goals, output schemas, uncertainty handling, confidence,
  proposed artifact paths, and completion receipt requirements.
- Agent treats lane outputs as candidate evidence until parent synthesis
  verifies and reconciles them.
- Agent distinguishes whether gathered evidence feeds design/spec creation or
  implementation planning, recommending `spec-creation-swarm` or
  `plan-creation-swarm` without creating those artifacts itself, and uses
  concrete review destinations when evidence feeds review.

## Failure Signals

- Collapses substantial research into a single chat-only summary.
- Gives helpers broad "go research" prompts without bounded questions.
- Omits proposed lane artifact paths, parent-written lane files, or parent
  research ledger.
- Treats helper agreement as accepted truth without parent verification.
- Lets research synthesize the design/spec or implementation plan itself.
- Routes to old workflow names.
- Routes to a generic `review` destination instead of a concrete review skill.
