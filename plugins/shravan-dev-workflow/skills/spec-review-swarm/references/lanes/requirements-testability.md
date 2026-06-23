# requirements-testability

Status: mandatory.

This lane follows `../../../../references/lane-judgment-cards.md`: use the
shared spec-review packet and finding schema for mechanics, and use this file
for requirements judgment.

## Lens

Find requirements that are not yet provable obligations.

This lane asks whether the spec says what must be true in a way a future plan
can prove. It is not looking for nicer wording. It is looking for wishes,
adjectives, hidden product choices, duplicated obligations, and implementation
tasks disguised as requirements.

## Why This Exists

If a requirement is vague, the plan will invent proof. If a requirement is
actually an implementation step, the plan will preserve the wrong abstraction.
If a requirement lacks an observable signal, implementation can pass tests while
missing the user or system behavior the spec intended.

## Where To Look

Read in this order:

1. Product intent / PRD:
   - who the behavior serves;
   - success criteria;
   - product non-goals.
2. Requirements:
   - product, technical, security, UX, performance, compatibility, and
     operational obligations.
3. Technical contract:
   - behavior, state, data, API, UI, or reliability claims that imply
     requirements even if not listed as requirements.
4. Proof expectations:
   - only after the requirement itself is clear.

Evidence priority:
1. Requirement and acceptance-criteria text.
2. Product intent and technical-contract sections that imply obligations.
3. Proof expectations only after the obligation is understandable.
4. Supporting evidence only when it clarifies a requirement already present in
   the spec.

## How To Analyze

For each material requirement, answer four questions:

1. What observable behavior must be true?
2. Who or what can observe it: user, API caller, database row, state transition,
   log, metric, trace, screenshot, CLI output, CI check, or release artifact?
3. Could a future plan write a proof row for this without inventing missing
   meaning?
4. Is this requirement stating what must be true, or is it telling the
   implementation how to build it?

Use this classification:

| Classification | Meaning | Reviewer action |
| --- | --- | --- |
| Testable obligation | Names behavior/state and an observer can be inferred from the spec. | Usually fine; cite only when tracing matters. |
| Vague obligation | Uses words like robust, easy, graceful, good, seamless, support, or handle without observable meaning. | Finding: request a measurable condition or example. |
| Missing signal | Says what should happen but not how success can be observed. | Finding: name the missing observer/proof signal. |
| Hidden product choice | Proof depends on user/product behavior the spec has not decided. | Question or blocker depending on load-bearing scope. |
| Implementation task | Describes a build step, library, worker sequence, or command instead of a required truth. | Finding: move build detail to plan input or rewrite as outcome. |
| Unowned obligation | Requirement affects a boundary but does not name the responsible contract/owner. | Finding or route to boundary lane. |

## Prioritized smells / failure signals:

- Requirement uses vague verbs or adjectives without an observable outcome.
- Requirement says "support X" but does not say what working X looks like.
- Requirement names a proof command instead of a system truth.
- Design prose implies an obligation that is absent from the requirements list.
- Two requirements say similar things with different semantics.
- Requirement depends on UI/data/log/metric/state behavior not named anywhere.
- Requirement requires a product decision before proof can be defined.

## Judgment Calibration

- Blocker: a load-bearing requirement is missing, contradicted, or impossible to
  prove from the spec.
- Important: a requirement can become testable with a clearer signal, example,
  owner, or measurable condition.
- Question: the requirement depends on human product priority or acceptance of a
  tradeoff not present in the artifact.
- Noise: wording preference where the behavior and proof implication are already
  clear.

## Useful Evidence To Return

Return evidence that helps the spec creator revise the spec:

- exact requirement text;
- product/contract section that gives or contradicts meaning;
- why a future plan cannot prove it yet;
- missing observable signal or hidden product choice;
- smallest requirement rewrite, example, or open question.

## Boundaries

Overlap boundary:
If the issue is owner, state, invariant, or allowed edge ambiguity, hand it to
`contract-and-scope` or `architecture-boundaries`. If the issue is the proof
modality after the requirement is already clear, hand it to
`validation-and-testability`.

Cannot-verify boundary:
Use `cannot_verify_from_focused_packet` when the obligation needs product
choice, current behavior measurement, plan-level validation detail,
whole-spec coverage, or source anchors missing from the focused packet. Use
generic unresolved/open output only for substantive uncertainty after the packet
is sufficient.

## Good / Bad Findings

Good finding:

```text
The requirement says "handle expired quota gracefully," but the spec does not
define the observable behavior. A future plan cannot know whether proof is a UI
message, account fallback, retry behavior, metric, log, or hard failure. Add the
required user/system outcome and at least one acceptable proof signal.
```

Bad finding:

```text
Requirements should be more testable.
```
