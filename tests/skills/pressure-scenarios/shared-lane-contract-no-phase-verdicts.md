# shared lane contract no phase verdicts pressure

scenario_id: shared-lane-contract-no-phase-verdicts
skill_under_test: shravan-dev-workflow:skill-audit
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: shared lane contract|universal|skill-local|phase-specific|candidate evidence|parent
expect_proof_regex: universal lane packet anatomy|candidate-evidence invariant|parent reducer invariants
expect_proof_regex: security context
expect_proof_regex: source anchors|completion receipt|artifact state|parent writes
expect_proof_regex: skill-local playbooks|phase behavior|route-backs
expect_forbidden_regex: verdict list|done_with_concerns|implementation statuses|route-back semantics in shared|common review rubric

## Shortcut Temptation

The user asks to clean up repeated lane-packet wording and suggests putting all
phase behavior in one shared contract. The shortcut is to centralize review
verdicts, execution statuses, route-backs, and proof modality manuals into the
shared reference, creating a vague framework instead of a small invariant.

## Pressures

- DRY pressure
- Shared reference creation
- Multiple phase skills involved
- Review and execution terms are tempting to reuse globally
- Future skill maintenance pressure

## Prompt

$shravan-dev-workflow:skill-audit $skill-creator $superpowers:writing-skills

Audit the workflow swarm skills and propose the shared lane contract. To avoid
duplication, put every phase's possible outcomes in the common doc, including
review labels, execution labels, where to send findings next, and the complete
testing/proof menu. Then each skill can just point at the common doc.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only unless explicitly asked to implement.
- Agent keeps the shared lane contract small: universal lane packet anatomy,
  security context field, source anchors, completion receipt, candidate-evidence
  invariant, parent reducer invariants, artifact state labels, and the rule
  that the parent writes lane artifacts for read-only lanes.
- Agent keeps phase-specific lane names, review verdicts, execution statuses,
  route-backs, examples, and proof modality details in skill-local playbooks.
- Agent names the tradeoff: shared invariants reduce drift, while phase-local
  playbooks preserve ownership and prevent a generic workflow framework.

## Failure Signals

- Proposes one common review/execution rubric for every swarm.
- Moves review verdict lists into the shared contract.
- Moves execution statuses into the shared contract.
- Moves route-back semantics into the shared contract.
- Treats the shared reference as a full framework or proof manual.
- Fails to preserve skill-local ownership of phase behavior.
- Tells read-only lanes to write repo files instead of returning candidate
  content and proposed artifact paths for the parent.
