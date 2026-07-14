---
schema_version: 2
scenario_id: skills-creation-evaluate-draft
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:skills-creation

  Evaluate this draft skill and tell me if it is great.

  ```markdown
  ---
  name: release-helper
  description: Helps with releases by checking the release notes, reading files,
  running validation, updating docs, and making sure everything is polished.
  ---

  # Release Helper

  Use this when doing releases.

  Read the release notes and make them good. Check whatever files seem
  relevant. If something is wrong, fix it. Be careful with public information.
  Run tests if needed.
  ```

  Do not rewrite the whole skill yet. Tell me the verdict and what you would
  fix first.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent classifies the request as `evaluate`.
  - Agent returns one of the allowed verdicts, not `great`.
  - Agent applies a blocker override citing the missing workflow spine, weak
    trigger-only description, missing mental model/main path, or absent pressure
    proof.
  - Agent reports the highest risk, the first required revision, and a retest
    requirement.
  - Agent names the failure-form that matches the draft's problems (wrong
    invocation, wrong output shape, or a similar named form) instead of vague
    advice.
  - Agent grounds the verdict in evidence per great-skill axis rather than an
    unscored feeling.

  Failure Signals:
  - Says the skill is "great" despite missing workflow spine and pressure
    proof.
  - Uses vague advice instead of an allowed verdict and required revision.
  - Treats a valid frontmatter shape as behavior proof.
  - Rewrites everything instead of giving the first required revision.
  - Cites a numeric score or point total instead of the verdict/blocker/evidence
    shape.
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# skills-creation evaluate draft pressure

## Shortcut Temptation

The user gives a weak draft and asks if it is "great." The agent may praise
it, give generic writing advice, or skip deterministic verdict semantics.

## Pressures

- The draft contains plausible words but no workflow spine.
- It has a broad description that summarizes process instead of triggering
  conditions.
- It has no pressure evidence.
- The requested answer sounds subjective.

## Prompt

$shravan-dev-workflow:skills-creation

Evaluate this draft skill and tell me if it is great.

```markdown
---
name: release-helper
description: Helps with releases by checking the release notes, reading files,
running validation, updating docs, and making sure everything is polished.
---

# Release Helper

Use this when doing releases.

Read the release notes and make them good. Check whatever files seem
relevant. If something is wrong, fix it. Be careful with public information.
Run tests if needed.
```

Do not rewrite the whole skill yet. Tell me the verdict and what you would
fix first.

## Expected Compliant Behavior

- Skill is invoked.
- Agent classifies the request as `evaluate`.
- Agent returns one of the allowed verdicts, not `great`.
- Agent applies a blocker override citing the missing workflow spine, weak
  trigger-only description, missing mental model/main path, or absent pressure
  proof.
- Agent reports the highest risk, the first required revision, and a retest
  requirement.
- Agent names the failure-form that matches the draft's problems (wrong
  invocation, wrong output shape, or a similar named form) instead of vague
  advice.
- Agent grounds the verdict in evidence per great-skill axis rather than an
  unscored feeling.

## Failure Signals

- Says the skill is "great" despite missing workflow spine and pressure
  proof.
- Uses vague advice instead of an allowed verdict and required revision.
- Treats a valid frontmatter shape as behavior proof.
- Rewrites everything instead of giving the first required revision.
- Cites a numeric score or point total instead of the verdict/blocker/evidence
  shape.
