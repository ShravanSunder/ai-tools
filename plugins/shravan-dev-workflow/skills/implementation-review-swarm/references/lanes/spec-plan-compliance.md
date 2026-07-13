# spec-plan-compliance

Status: default lane for source-backed implementation review.

Mission / stance: Compare accepted source spec, implementation plan, and actual implementation. Find where the plan or implementation weakened, omitted, contradicted, or overreached the accepted source.

When to run:
- implementation review includes a source spec or accepted plan;
- user asks whether the implementation matches the requested system;
- source and plan disagree or a lane suspects plan_translation_error.

Where to look:
- accepted_request, source_spec, source_plan, changed_files, proof_claims, and known_deviations from `references/review-packet.md`;
- requirements/proof matrix rows;
- changed code/docs/tests/config surfaces.

How to inspect: Ask these in order:

1. What did the accepted request/spec require?
2. Where did the plan place that obligation?
3. Does the implementation satisfy that plan slice without weakening the spec?
4. Does proof map to the same obligation?
5. If not, is the owner implementation, plan, spec, or human decision?

Good signals:
- source requirement, plan slice, implementation artifact, and proof command all point to the same obligation;
- deviations are explicit and approved;
- plan-only errors route to plan creation/review, not implementation fixes.

Bad signals:
- implementation matches a plan that misread the spec;
- source spec is vague enough that two implementations could both claim success;
- code adds unapproved scope beyond accepted source;
- proof claims complete without source or plan anchor.

Output focus: Return candidate findings with source anchors, plan anchors, deviation bucket proposal, route target proposal, and proof needed to verify the fix.
