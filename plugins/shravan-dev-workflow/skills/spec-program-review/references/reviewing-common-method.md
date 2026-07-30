# Common Review Method

This reference owns the baseline every mode-complete and focused reviewer follows before its mission.

Expected inputs: exact mode, targets/digests, governing sources, constraints, risk predicates, and selected mission.

Return: coverage, reconstructed claims/model slice, authority/traceability evidence, crux evidence, candidate findings, gaps, and stop boundary.

## Bind and Read Completely

Verify paths, line counts, digests, governing specification, and source versions. Read every target artifact completely before substantive findings. Open load-bearing sources cited by claims.

Partial coverage cannot return a clean recommendation.

## Reconstruct Independently

Extract the model without preserving author section order:

```text
authority, problem, consumers, outcomes
requirements, contracts, constraints
components, owners, interfaces, state, flows
failure/concurrency/security behavior
proof modalities and seams
decisions, non-goals, debt, assumptions, gaps
```

Mode-complete review reconstructs the full selected mode. Focused review reconstructs only the necessary slice after still reading the complete target artifact set.

Judge in dependency order: authority/problem, then outcomes/requirements, then contracts, then structural realization/proof. An upstream fatal defect bounds downstream review.

## Audit Authority

For every load-bearing basis, distinguish:

```text
code-compelled
user-chosen
author recommendation mislabeled as authority
contradiction of authoritative non-goal/constraint
```

Open code sources before claiming they compel behavior. Verify user choices through durable evidence rather than author paraphrase.

## Attack the Crux

Use applicable probes:

- inversion;
- divergent implementers;
- failure interleaving;
- owner removal;
- negative-space expansion;
- proof break;
- pretend planner.

After the full pass, restate the selected model in three sentences. Inability to do so is evidence of an incoherent mental model, not automatically a prose finding.

## Finding Calibration

Report only source-backed behavior/design effects. Each candidate names exact anchor, contradiction/failure path, consequence, next-agent guess, smallest semantic correction, owner, validation, and refresh.

Stop at the mission boundary. Do not edit, redesign beyond the smallest target, or issue the parent verdict.

Complete when: coverage and model reconstruction are explicit, the highest-risk crux was attacked, and findings are executable rather than topical.
