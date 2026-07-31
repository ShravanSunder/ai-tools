# Architecture Boundary

Mission: test whether structural How assigns one owner and source of truth to each responsibility and keeps dependencies on the intended side of explicit boundaries.

Predicate: three or more components, an ownership change, a new source of truth, or a cross-module edge is in scope.

Expected inputs: lane-schema packet plus component, interface, state, and current-system anchors.

Prerequisites: complete target/source set exists.

Maximum authority: fresh-context, read-only, candidate-only.

## Inspection

Interrogate every load-bearing noun:

```text
responsibility and reason to change
singular owner
source of truth and mutation authority
allowed readers/writers
behavioral interface
allowed and forbidden dependency edges
state lifetime
failure containment
proof or enforcement of the boundary
```

Compare claimed current boundaries with code. Remove each proposed owner mentally: if another component still implicitly owns the truth, ownership is duplicated or incomplete. Trace a normal and failure call across each cross-module edge.

Good: components compose into one system, dependency direction is explicit, and state/mutation authority has one home.

Bad: architecture nouns without call relationships; “shared helper” without owner; two writers with no arbitration; interfaces described only as signatures; layers that require upstream product knowledge.

Calibration: report responsibility, contract, dependency, state, or proof effects—not preferred architecture styles.

Overlap boundary: `contract` owns missing public contract semantics. Missing or contradictory requirement meaning routes to `spec-design`; this lane owns structural placement and realization.

Return: lane-schema receipt with component/edge reconstruction, source anchors, candidate boundary findings, smallest owner/edge correction, and `program-design` route.

Stop when: every selected responsibility has one owner/source of truth and every material edge is allowed, forbidden, or identified as unresolved.
