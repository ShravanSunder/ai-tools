# Authoring Intake

Load trigger: the target skill/change is named but underspecified, or the user
gives examples without a reusable job, owner plugin, or proof shape.

Carry in: proposed skill/change, examples, failure hypothesis, known source
material, and any user acceptance source.

## Procedure

1. Classify the run as `create`, `update`, or `evaluate`.
2. Name the reusable job in one sentence.
3. Identify the owner plugin and expected target files.
4. Check the nearby skill surface for an existing owner. Prefer updating when a
   current skill clearly owns the job.
5. State the baseline failure or proof-gap reason.
6. Choose the first proof shape: pressure scenario, static validation, review,
   or explicit deferral.
7. Stop broad inventory requests. Ask for one named target or a separate
   portfolio-audit workflow.

## Return Artifact

```text
target skill/change:
classification: create | update | evaluate
owner plugin:
reusable job:
existing-surface check:
baseline failure or proof-gap reason:
user intent / acceptance source:
first proof shape:
next branch:
```

Completion criterion: the main workflow can continue without guessing the
target, owner, reason, or proof shape.

Source material adapted: Matt's reusable-job and invocation clarity; the local
SOP candidate-intake shape; Superpowers' baseline-failure discipline. Rejected:
broad portfolio audit and wholesale source copying. This branch does not
duplicate all-branch state from `SKILL.md`.
