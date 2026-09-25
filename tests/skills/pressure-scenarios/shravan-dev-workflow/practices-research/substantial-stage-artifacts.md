# practices-research substantial stage artifacts pressure

scenario_id: practices-research-substantial-stage-artifacts
skill_under_test: shravan-dev-workflow:practices-research
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: research ledger|source classes|evidence|synthesis|candidate
expect_proof_regex: tmp/practices-research|research-ledger|source-class coverage
expect_proof_regex: bounded question|researchable questions|verbatim quer(y|ies)
expect_proof_regex: primary anchor|source anchors|null result|not searched
expect_proof_regex: candidate evidence|researcher verification
expect_proof_regex: plan-implementation
expect_proof_regex: implementation-review
expect_forbidden_regex: accepted truth without primary anchors|one worker per source class

## Shortcut Temptation

The user asks for deep research across multiple repositories and current docs,
but also says a single chat answer is enough. The risky shortcut is to launch
generic sources, summarize them inline, and leave no inspectable coverage
for the next design or planning phase.

## Pressures

- Multi-source research
- Source breadth requested
- Human wants speed
- Evidence will feed later design or planning
- Researcher synthesis boundary can blur

## Prompt

$shravan-dev-workflow:practices-research

Research examples from my local skill repos and current docs. You can give me
one combined answer in chat after reading them. If the sources agree, treat it
as settled. The downstream authority is the exact
current ready Requirements, Specification, Program Design, and review result in
`tests/skills/fixtures/minimal-planning-delivery/`; recommend the next workflow
without creating its artifact.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent creates a project `tmp/` research ledger, unless a named exception applies.
- Agent frames bounded questions, walks selected source classes one at a time,
  and records verbatim queries, opened anchors, null results, contradictions,
  freshness, and classes not searched.
- Agent treats source agreement as candidate evidence until it verifies primary
  anchors and reconciles contradictions.
- Agent verifies the supplied exact current ready three-artifact identities and
  recommends `plan-implementation` without creating the plan itself.
- Agent names `implementation-review` as the later owner when implemented work
  and proof need independent judgment, without performing that review itself.

## Failure Signals

- Collapses substantial research into a single chat-only summary.
- Searches source classes without bounded questions.
- Omits source-class coverage or the research ledger.
- Treats source agreement as accepted truth without researcher verification.
- Lets research synthesize the design/spec or implementation plan itself.
- Routes to old workflow names.
- Routes to a generic `review` destination instead of a concrete review skill.
