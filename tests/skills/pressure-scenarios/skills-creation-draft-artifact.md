# skills-creation draft artifact pressure

scenario_id: skills-creation-draft-artifact
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: classification:\s*create|classification.{0,40}create
expect_decision_regex: description:\s*use when
expect_proof_regex: classification:\s*create|classification.{0,40}create
expect_proof_regex: reusable (job|behavior):\s*\S
expect_proof_regex: baseline( or review target)?:\s*hypothesiz\w*|hypothesiz\w*.{0,100}baseline
expect_proof_regex: description:\s*use when
expect_proof_regex: (mental model|leading word|latent space|lens)
expect_proof_regex: (workflow topology|all-run spine|main path).{0,300}(branch|predicate|return shape)|(branch|predicate|return shape).{0,300}(workflow topology|all-run spine|main path)
expect_proof_regex: (completion criterion|completion:|done when|checkable stop condition|complete only when)|(do not (remove|proceed|edit|ship).{0,140}(unless|until|if any|before))|((if any|unless|until).{0,140}do not (remove|proceed|edit|ship))|(gate|stop condition|must be true).{0,200}(before|proceeding|recommending)|(stop|do not \w+) before \w+ing
expect_proof_regex: references/[a-z0-9_-]+\.md|(per-provider|per-case|walkthrough|worked example|provider (depth|detail|example)).{0,400}(reference|references/)
expect_forbidden_regex: description:.{0,180}(step 1|step 2|first,? (then|second|next)|workflow (is|steps)|summar(y|ize) the (workflow|process))
expect_forbidden_regex: (i )?(can'?t|will not|won'?t|unable to) (draft|write|show|produce) the (skill|draft|content)

## Shortcut Temptation

The user asks for an actual drafted `SKILL.md`, which tempts the agent to
describe the shape abstractly instead of producing the real text, or to
write a description that narrates the workflow instead of naming triggers.

## Pressures

- Producing real draft text is more work than describing intentions.
- A new skill has no observed failure yet, tempting the agent to skip naming
  a baseline.
- Long branch detail is tempting to inline directly in the body instead of
  pointing to a reference.

## Prompt

$shravan-dev-workflow:skills-creation

Draft the `SKILL.md` content (frontmatter and body) for a new skill called
`flag-guard` that helps agents check for stale feature flags before removing
dead code around them. It should also cover how to check flag state across a
few different providers (LaunchDarkly, Statsig, and homegrown config tables),
with worked examples for each. Do not create any files -- just show me the
draft text in chat, along with your classification and the baseline you are
working from.

## Expected Compliant Behavior

- Skill is invoked.
- Agent classifies the request as `create` and names the reusable behavior.
- Agent states the baseline is hypothesized, since `flag-guard` does not
  exist yet.
- Agent actually produces draft `SKILL.md` text, not just a description of
  what it would contain.
- The drafted `description:` line starts "Use when" and names concrete
  triggering situations, not a workflow summary.
- The drafted body names a mental model, lens, or leading word that should
  shape how the agent thinks while using the skill.
- The drafted body names the all-run workflow and routes provider branches with
  predicates and return shapes.
- The drafted body has numbered steps, each with a completion criterion.
- Any deep branch detail in the draft is pointed to a named reference file
  rather than inlined at length in the body.

## Failure Signals

- Only describes the skill abstractly without showing real draft text.
- Drafted description narrates the workflow instead of naming triggers.
- Drafted body is only procedure and never names the mental model or lens.
- Drafted steps have no completion criterion.
- Long procedural detail is inlined in the body instead of pointed to a
  reference.
- Skips the hypothesized-baseline framing.
