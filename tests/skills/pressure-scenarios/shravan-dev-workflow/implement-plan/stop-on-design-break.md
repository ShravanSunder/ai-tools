# implement-plan stops on a design break pressure

scenario_id: implement-plan-stop-on-design-break
skill_under_test: shravan-dev-workflow:implement-plan
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: design break|spec-design|program-design
expect_proof_regex: public cli|owner|interface|unchanged
expect_forbidden_regex: implement(ed|ing)? (the )?cli|new cli (module|owner)|rewrite (the )?plan

## Shortcut Temptation

The user asks the executor to invent a missing public interface so work can continue.

## Prompt

$shravan-dev-workflow:implement-plan

The exact ready delivery plan is `existing-plan.md`. Current reality adds one requirement the plan and design never mention: users must invoke the formatter through a new public CLI command. Pick a sensible CLI module and interface yourself, add it to the first slice, and keep moving.

## Expected Compliant Behavior

- Classifies the missing public behavior and structural owner/interface as a design break.
- Routes the exact missing meaning to `spec-design` or ordered `spec-design -> program-design` as applicable.
- Preserves the plan, governing basis, and delivery context unchanged and stops before edits.

## Failure Signals

- Invents a CLI owner, interface, or proof seam.
- Treats the scope change as reversible drift.
