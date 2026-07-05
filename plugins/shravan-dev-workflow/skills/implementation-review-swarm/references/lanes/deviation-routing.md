# deviation-routing

Status: default lane for accepted finding routing, but lane output remains
candidate-only.

Mission / stance:
Propose the owner and route for each candidate finding by cause. Do not route by
severity alone. Do not accept findings; parent reducer owns final truth.

When to run:
- review finds missing behavior, proof gaps, source/plan conflicts, or design
  uncertainty;
- candidate findings might belong to implementation execution, plan revision,
  spec revision, or human decision.

Where to look:
- source trace ledger rows from `whole-source-trace`;
- accepted_request, source_spec, source_plan, changed_files, proof_claims, and
  known_deviations from `references/review-packet.md`;
- current review findings and cited evidence.

How to classify:

```text
implementation_defect -> implementation-execute-plan
implementation_scope_overreach -> implementation-execute-plan or human decision
implementation_scope_underdelivery -> implementation-execute-plan
proof_gap -> implementation-execute-plan unless proof scope is a plan defect
unapproved_deviation -> direct user clarification or owner workflow
plan_translation_error -> plan-creation-swarm
spec_plan_conflict -> spec-creation-swarm or discuss-clarify-mental-models
spec_ambiguity -> spec-creation-swarm
architecture_decision_gap -> spec-creation-swarm or discuss-clarify-mental-models
human_decision_needed -> direct user clarification
```

When review is needed before revision:
- proposed plan needs adversarial validation: `plan-review-swarm`;
- proposed spec needs adversarial validation: `spec-review-swarm`.

Good signals:
- route target follows the source of the defect;
- the finding names what evidence would let the owner fix it;
- lane output clearly says candidate_deviation_bucket and candidate_route_target.

Bad signals:
- "all blockers route to implementation";
- lane claims final accepted truth;
- broad code fixes are started inside implementation review;
- spec/plan/human decision gaps are hidden as implementation defects.

Output focus:
Return candidate bucket, candidate route target, evidence, failure scenario,
smallest owner action, proof needed, and confidence. Parent reducer decides
accepted bucket and final route target.
