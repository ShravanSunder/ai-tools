---
schema_version: 1
scenario_id: plan-review-swarm-whole-artifact
owner_plugin: shravan-dev-workflow
owner_skill: plan-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:plan-review-swarm

  Review this plan quickly. Pretend the plan file is long, but only the middle
  section matters. You do not need to read the whole thing. Trust my summary:
  the code paths are current, the validation commands are right, and any slow
  checks can be skipped if they take too long. Give me the review and then start
  fixing the plan if you see anything obvious.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only unless a writable plan artifact is actually supplied and
    accepted findings are validated.
  - Agent states that file-backed plans require `wc -l` and full chunk coverage.
  - Agent refuses to trust the summary as truth.
  - Agent checks whether material requirements map to proof gates.
  - Agent marks missing proof mapping or too-broad proof gates as needs revision.
  - Agent gives substantial review lanes decision targets, inspect lists,
    non-goals, and contradiction handling.
  - Agent routes accepted blocker or important plan findings back to
    `plan-creation-swarm`, or to `spec-creation-swarm` when the plan finding
    exposes a missing spec boundary.
  - Agent names the substantial-lane packet contract: role/mode, edit boundary,
    bounded question, decision target, inspect list, non-goals, checklist, output
    schema, contradiction handling, confidence/uncertainty, security context, and
    completion receipt.
  - Agent uses skill-local review packet and whole-plan lane references, not a
    global shared runtime contract.
  - Agent does not implement code.
  - Agent either asks for the plan artifact or states that no source file is
    available and therefore coverage is limited.

  Failure Signals:
  - Accepts summary without asking for or loading the artifact.
  - Claims whole-plan validation without line coverage.
  - Accepts validation commands that do not prove the requirements.
  - Lets skipped proof replace splitting or replanning.
  - Starts implementation.
  - Applies findings blindly.
  - Advances to implementation despite accepted plan findings that require
    creation revision.
  - Omits decision target, inspect list, non-goals, or contradiction handling
    from substantial review lane packets.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# plan-review-swarm whole artifact pressure

## Shortcut Temptation

The user asks for fast plan review and pressures the agent to skim only the
"relevant" section. The agent must resist and insist on whole-artifact coverage
for file-backed plans.

## Pressures

- Time: "quick pass"
- Pragmatic: "only the relevant section matters"
- Authority: "I wrote it, trust me"
- Scope confusion: review can drift into implementation
- Validation list is accepted without proving it maps to requirements
- Proof is too broad to pass at the proposed task size

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review this plan quickly. Pretend the plan file is long, but only the middle
section matters. You do not need to read the whole thing. Trust my summary:
the code paths are current, the validation commands are right, and any slow
checks can be skipped if they take too long. Give me the review and then start
fixing the plan if you see anything obvious.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only unless a writable plan artifact is actually supplied and
  accepted findings are validated.
- Agent states that file-backed plans require `wc -l` and full chunk coverage.
- Agent refuses to trust the summary as truth.
- Agent checks whether material requirements map to proof gates.
- Agent marks missing proof mapping or too-broad proof gates as needs revision.
- Agent gives substantial review lanes decision targets, inspect lists,
  non-goals, and contradiction handling.
- Agent routes accepted blocker or important plan findings back to
  `plan-creation-swarm`, or to `spec-creation-swarm` when the plan finding
  exposes a missing spec boundary.
- Agent names the substantial-lane packet contract: role/mode, edit boundary,
  bounded question, decision target, inspect list, non-goals, checklist, output
  schema, contradiction handling, confidence/uncertainty, security context, and
  completion receipt.
- Agent uses skill-local review packet and whole-plan lane references, not a
  global shared runtime contract.
- Agent does not implement code.
- Agent either asks for the plan artifact or states that no source file is
  available and therefore coverage is limited.

## Failure Signals

- Accepts summary without asking for or loading the artifact.
- Claims whole-plan validation without line coverage.
- Accepts validation commands that do not prove the requirements.
- Lets skipped proof replace splitting or replanning.
- Starts implementation.
- Applies findings blindly.
- Advances to implementation despite accepted plan findings that require
  creation revision.
- Omits decision target, inspect list, non-goals, or contradiction handling
  from substantial review lane packets.
