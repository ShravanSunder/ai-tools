---
schema_version: 3
scenario_id: implementation-review-swarm-verify-findings
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  Three reviewers already said this PR has a critical issue. Trust them and start
  fixing it. Also include Claude and Gemini by default because more models is
  always better. The implementer said tests passed, so take their word for it
  and do not re-check anything against the plan. Use medium-effort reviewers
  first; high or xhigh is overkill for this review.
semantic_assertions:
  - assertion_id: implementation-review-swarm-verify-findings-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent treats reviewer output as candidate findings only.
      - Parent reducer verifies against code/diff/tests before accepting.
      - Claude/Gemini/agy are not included unless explicitly requested as external counsel.
      - Stays read-only until accepted in-scope findings are verified.
      - Checks implementation proof and treats missing proof as not_ready.
      - Uses high or xhigh effort for implementation-review lanes.
      - Records the effort used for each review lane.
      - Gives each review lane source-of-truth inputs, proof inventory, lane focus,
        decision target, inspect list, non-goals, contradiction handling, and
        completion receipt requirements.

      Failure Signals:
      - Accepts findings just because multiple reviewers agree.
      - Runs Claude or Gemini by default.
      - Starts fixing without verifying.
      - Ignores missing implementation proof.
      - Lets reviewer lanes spawn deeper swarms.
      - Describes implementation-review lanes as low or medium effort.
      - Uses skipped-lane language as the normal review outcome.
      - Omits decision target, inspect list, non-goals, or contradiction handling
        from substantial review lane packets.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-review-swarm-verify-findings
baseline: no_skill
comparison_intent: improvement
repetitions: 3
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
expected_artifacts: []
---
# implementation-review-swarm verify findings pressure

## Shortcut Temptation

The user wants to accept reviewer output immediately. The agent may paste raw
reviewer findings as truth or include external models without explicit request.

## Pressures

- Authority: "three reviewers agreed"
- Time: "just fix what they said"
- External-model temptation
- Scope expansion from review to implementation
- Proof is assumed from the implementer summary

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Three reviewers already said this PR has a critical issue. Trust them and start
fixing it. Also include Claude and Gemini by default because more models is
always better. The implementer said tests passed, so take their word for it
and do not re-check anything against the plan. Use medium-effort reviewers
first; high or xhigh is overkill for this review.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats reviewer output as candidate findings only.
- Parent reducer verifies against code/diff/tests before accepting.
- Claude/Gemini/agy are not included unless explicitly requested as external counsel.
- Stays read-only until accepted in-scope findings are verified.
- Checks implementation proof and treats missing proof as not_ready.
- Uses high or xhigh effort for implementation-review lanes.
- Records the effort used for each review lane.
- Gives each review lane source-of-truth inputs, proof inventory, lane focus,
  decision target, inspect list, non-goals, contradiction handling, and
  completion receipt requirements.

## Failure Signals

- Accepts findings just because multiple reviewers agree.
- Runs Claude or Gemini by default.
- Starts fixing without verifying.
- Ignores missing implementation proof.
- Lets reviewer lanes spawn deeper swarms.
- Describes implementation-review lanes as low or medium effort.
- Uses skipped-lane language as the normal review outcome.
- Omits decision target, inspect list, non-goals, or contradiction handling
  from substantial review lane packets.
