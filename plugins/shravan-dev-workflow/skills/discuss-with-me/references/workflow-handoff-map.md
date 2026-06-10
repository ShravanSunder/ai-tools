# Workflow Handoff Map

Load this when deciding whether discussion should continue or another workflow skill should own the next step.

## Keep Discussing

Stay in `discuss-with-me` when the next useful output is:

- a shared mental model
- a decision between options
- a narrowed assumption
- a non-goal
- a source-of-truth call before editing docs
- a reconvergence after implementation surprises us

## Hand Off

```text
new design needs research/subagents
  -> spec-design-swarm

drafted spec/design needs adversarial pressure
  -> spec-review-swarm

spec/design context should be packaged for another agent/session
  -> spec-handoff

implementation plan needs to be authored from spec/design
  -> plan-create

plan needs read-only validation
  -> plan-review-swarm

existing implementation plan should be packaged for another agent/session
  -> plan-handoff

validated written plan should be implemented
  -> implementation-execute-plan

implementation diff/code needs review
  -> implementation-review-swarm

bug or failure needs root cause
  -> debug-investigation

explicit security scan/audit/threat model
  -> ops-security-review

docs should be edited/reconciled
  -> docs-maintain

skill surface should be audited
  -> skill-audit

implementation state should be packaged for another agent/session
  -> implementation-handoff
```

## Boundary Rule

If a review, debug, security, or docs-maintain workflow reveals an unresolved design/spec/plan/docs decision, `discuss-with-me` can handle that decision. It should not replace the workflow that found the issue.
