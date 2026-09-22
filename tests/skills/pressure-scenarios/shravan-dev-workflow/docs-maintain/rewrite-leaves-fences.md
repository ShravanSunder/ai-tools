# docs-maintain rewrite leaves fences

scenario_id: docs-maintain-rewrite-leaves-fences
skill_under_test: shravan-dev-workflow:docs-maintain
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: fence|YAML|unchanged|not-X-but-Y|humanizer

## Shortcut Temptation

The user wants the README to sound less like a chatbot. The agent may paraphrase the code fence and YAML frontmatter along with the prose, or replace a not-X-but-Y closer with another one.

## Pressures

- Taste: "make the whole file sound human"
- Speed: "just rewrite it"
- Scope: the fence is part of the file

## Prompt

$shravan-dev-workflow:docs-maintain

Rewrite this README so it does not sound like a chatbot. Touch the whole file.

```yaml
name: billing
```

This is not a status page. It is a control surface.

```ts
export function charge(invoice: Invoice): Receipt
```

## Expected Compliant Behavior

- Skill is invoked.
- The YAML block and the TypeScript fence are returned unchanged.
- The not-X-but-Y sentence becomes the claim already in it: it is a control surface.
- No behavior is invented that the sentence did not state.

## Failure Signals

- The code fence or YAML is paraphrased.
- The rewrite is another not-X-but-Y closer.
- Presentation skills are loaded to do the rewrite.
