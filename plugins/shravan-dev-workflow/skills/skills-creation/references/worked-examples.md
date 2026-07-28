# Worked Examples

This reference owns the small end of the size range. Return the shape choice for the skill being authored: how much machinery its job actually earns.

The review module in this skill — stage references, eight lanes, a shared schema, a dispatch contract — is the heavy end of the range, shown in place. Below is the light end: a complete skill, small because its job is small. Most skills live between. Match the machinery to the job, not to this skill.

## A Complete Small Skill

```markdown
---
name: flaky-test-quarantine
description: Use when a test fails intermittently across reruns, CI retries mask failures, or the user asks to quarantine, deflake, or stabilize a flaky test.
---

# Flaky Test Quarantine

A flaky test is a measurement problem before it is a code problem: the test asserts on something the runtime does not guarantee. Fix the guarantee or fix the assertion; never mask the symptom with a retry.

## Workflow

1. Reproduce the flake: rerun the single test until it fails or 20 runs pass. Completion: a failing seed or log is captured, or the flake is reported unreproduced with the rerun count.
2. Name the unguaranteed thing: ordering, time, shared state, or an external dependency. Completion: the assertion and the guarantee it lacks are quoted side by side.
3. IF step 2 names shared state or ordering, load `references/isolation-recipes.md` and return the recipe applied.
4. Fix the guarantee or the assertion, then prove it: rerun as in step 1. Completion: the rerun count and zero failures are reported, and any retry annotation the test carried is removed.
5. IF the fix cannot land in this change, quarantine instead: skip-with-ticket, the ticket naming the unguaranteed thing from step 2. Completion: the skip annotation and ticket reference are reported. Never quarantine by deleting the assertion or adding a retry.
```

## Why Each Part Earns Its Place

- The description names symptoms and the words a user would use; it says nothing about how the workflow runs. Description craft is owned by `frontmatter-design.md`; here it is only shown in situ.
- The mental model is one sentence that recruits a pretrained concept — `measurement problem` — and a reader of it alone could predict the workflow's shape.
- The spine is five steps because order changes behavior, and every completion criterion demands legwork: a captured log, a side-by-side quote, a rerun count, a ticket reference.
- Two branches exist, because only some runs need isolation mechanics and only a blocked fix quarantines; each predicate is observable from an earlier step's result, and each returns something the main path uses. That is the branch case of progressive disclosure — an attention decision. (The example's `references/isolation-recipes.md` lives in the fictional skill's own tree; paths inside the fenced example are not paths of this skill.)
- One prohibition exists, because retry-masking is the known failure; it is a bright line paired with its positive target.
- There are no lanes, no schema, no glossary, and no review module, because nothing here qualifies: no work is handed to a subagent, no shape has multiple consumers, no term is coined.

Complete when: the authored skill's machinery is justified the same way — every element present because its qualification is met, every element absent because it is not.
