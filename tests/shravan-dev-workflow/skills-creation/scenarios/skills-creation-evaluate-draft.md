---
schema_version: 1
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
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: verdict:|targeted-revision|significant-rewrite|reject-or-restart
  - check_id: decision-2
    fact: visible_response
    operator: matches
    expected: (missing|no|lacks|without|absent).{0,80}(workflow spine|pressure proof|trigger)
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: verdict.{0,80}(targeted-revision|significant-rewrite|reject-or-restart)
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: review target:\s*\S|baseline( or review target)?:\s*(review target|evaluate|what is being judged)
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: blocker overrides?:|blocker.{0,180}(workflow spine|trigger|pressure proof|link-only router)
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: highest risk
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: first required revision|first revision to make
  - check_id: proof-6
    fact: visible_response
    operator: matches
    expected: "retest requirement|proof or retest implication|retest( requirement)?s?\\s*:"
  - check_id: proof-7
    fact: visible_response
    operator: matches
    expected: (bright-line rule|positive output shape|required slot|observable predicate|stronger completion criterion|sharper (description|invocation)|stronger context pointer|failure[- ]form|wrong[- ]invocation|guidance form)
  - check_id: proof-8
    fact: visible_response
    operator: matches
    expected: rubric evidence|evidence.{0,100}(axis|reusable (job|behavior)|invocation|trigger|mental model|main path|workflow topology|hierarchy|steering|pruning|proof)
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: verdict\s*:?\s*great
  - check_id: forbidden-2
    fact: visible_response
    operator: not_matches
    expected: \b(34-40|27-33|19-26|0-18)\b|score.{0,20}(out of|/)\s*40|\d+\s*/\s*40\b|\bpoint(s)?\b.{0,20}(arithmetic|scorecard|threshold|out of \d+|/\s*\d+)
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
