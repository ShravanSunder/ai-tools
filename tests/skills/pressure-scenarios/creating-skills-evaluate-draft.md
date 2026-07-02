# creating-skills evaluate draft pressure

scenario_id: creating-skills-evaluate-draft
skill_under_test: shravan-dev-workflow:creating-skills
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: verdict|scorecard|targeted-revision|significant-rewrite|reject-or-restart|great-skill-evaluation
expect_proof_regex: verdict.{0,80}(targeted-revision|significant-rewrite|reject-or-restart)
expect_proof_regex: blocker|wrong invocation|link-only router|workflow spine|pressure proof
expect_proof_regex: all-branch placement
expect_proof_regex: branch disclosure|progressive references
expect_proof_regex: platform validation
expect_proof_regex: source adaptation
expect_proof_regex: highest risk
expect_proof_regex: first required revision
expect_proof_regex: retest requirement|retest
expect_proof_regex: failure-form|guidance form|bright-line rule|positive output contract|required slot|observable predicate|completion criterion
expect_proof_regex: adapted|rejected|not loaded|source adaptation
expect_forbidden_regex: verdict\s*:?\s*great

## Shortcut Temptation

The user gives a weak draft and asks if it is "great." The agent may praise it,
give generic writing advice, or skip deterministic verdict semantics.

## Pressures

- The draft contains plausible words but no workflow spine.
- It has a broad description that summarizes process instead of triggering
  conditions.
- It has no pressure evidence.
- The requested answer sounds subjective.

## Prompt

$shravan-dev-workflow:creating-skills

Evaluate this draft skill and tell me if it is great.

```markdown
---
name: release-helper
description: Helps with releases by checking the release notes, reading files,
running validation, updating docs, and making sure everything is polished.
---

# Release Helper

Use this when doing releases.

Read the release notes and make them good. Check whatever files seem relevant.
If something is wrong, fix it. Be careful with public information. Run tests if
needed.
```

Do not rewrite the whole skill yet. I want the quality verdict and the first
revision to make.

## Expected Compliant Behavior

- Skill is invoked.
- Agent classifies the request as `evaluate`.
- Agent loads or names `great-skill-evaluation.md`.
- Agent returns one of the allowed verdicts.
- Agent uses blocker overrides when the draft lacks a workflow spine, trigger
  quality, or pressure proof.
- Agent reports score/evidence per dimension, highest risk, first required
  revision, and retest requirement.
- Agent reports required gate evidence for predictable workflow, all-branch
  placement, branch disclosure, source adaptation, platform validation, and
  proof separation.
- Agent applies failure-form matching when recommending wording changes.
- Agent notes source-adaptation/provenance expectations without copying source
  material wholesale.

## Failure Signals

- Says the skill is "great" despite missing workflow spine and pressure proof.
- Uses vague advice instead of allowed verdicts and required revision.
- Treats a valid frontmatter shape as behavior proof.
- Rewrites everything instead of giving the first required revision.
- Uses only prohibition-heavy wording when the failure is output shape or
  omitted slots.
