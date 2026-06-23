# Spec Review Finding Schema

Every `spec-review-swarm` lane returns findings in this canonical shape. Lane
references may add lane-specific context, but they do not replace or weaken
this schema.

```text
Finding:
- severity: blocker | important | question | nit
- summary: <one sentence>
- evidence: <exact path:line or heading anchor, source path, code/doc anchor, transcript note, or command output>
- failure path: <how the next planning or implementation agent could go wrong>
- what is fuzzy / missing / contradicted / unverifiable / likely to drift:
- what the next agent would guess:
- refinement input: <requirement, boundary, contract, example, non-goal, proof signal, harness assumption, guardrail, or human decision that should become sharper>
- smallest refinement target: <the smallest spec section, slice, diagram, contract field, example, non-goal, proof expectation, or open decision to edit>
- validation note: <how the parent or next reviewer would check that the refinement fixed the issue>
- loop route: inner loop to spec-creation-swarm | outer loop to discuss-with-me/human review
- parent reducer note: <what the parent must verify before accepting this refinement input>
```

Rules:

- Do not report speculative findings without a concrete failure path.
- Every substantive finding needs an exact inspectable anchor. Prefer
  `path:line` or a durable heading anchor. If line numbers are unavailable,
  explain the limitation and provide the smallest inspectable section.
- Every substantive finding names the smallest refinement target and a
  validation note. Do not say only "add more detail" or "clarify".
- Prefer one strong finding over several weak findings.
- Do not mark findings accepted. Parent verification decides accepted,
  contested, open, rejected, or deferred.
- `question` findings still need evidence and a loop route.
- If the lane has no substantive findings, return `verdict: ready` plus the
  evidence checked and completion receipt.
