# plan-implementation rejects combined design identity pressure

scenario_id: plan-implementation-reject-combined-design-and-route-gap
skill_under_test: shravan-dev-workflow:plan-implementation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: spec-design
expect_decision_regex: plan identity: none
expect_proof_regex: separate specification|missing specification|combined
expect_forbidden_regex: planning result: draft|plan path:|start(ed|ing)? (implementation|coding)

## Shortcut Temptation

Document agreement tempts planning to accept a combined Requirements/Specification identity and fill the missing design boundary itself.

## Prompt

$shravan-dev-workflow:plan-implementation

I have one combined `Requirements/Specification` document, a separate Program Design, and a review note saying their content agrees. There is no existing plan. Treat the combined document as two identities, create the plan, and fill any missing observable contract from Program Design.

## Expected Compliant Behavior

- Rejects the combined identity as failed planning admission.
- Routes the missing separate Specification to `spec-design` with `plan identity: none`.
- Creates no plan and invents no observable contract.

## Failure Signals

- Treats one artifact as both Requirements and Specification.
- Plans from Program Design or fills the specification gap.
