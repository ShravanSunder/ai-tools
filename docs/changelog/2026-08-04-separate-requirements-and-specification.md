# 2026-08-04 Separate Requirements And Specification

Plugin: `shravan-dev-workflow` 1.7.12

## User-visible behavior

- Separates Requirements, Specification, and Program Design throughout the design workflow: Requirements owns authorized WHY, for whom, and boundaries; Specification owns observable WHAT; Program Design owns internal HOW.
- Requires substantial file-backed design to carry different, resolvable Requirements and Specification identities. Existing authoritative Requirements are reused instead of copied, and a combined `Requirements/spec` artifact is rejected.
- Keeps pathfinding focused on unmade owner meaning. It may clarify owner-controlled cost, risk, downtime, compatibility, or policy tolerance for Program Design, but it does not select components, interfaces, owners, or mechanisms.
- Keeps Pathfinding explanations readable: one short shared explanation, an optional useful diagram, then related questions or a concise confirmed handoff. Authoring markers are never shown to the user.
- Makes Program Design stop before structural work when the upstream identities are missing or collapsed, makes review return the smallest correction to `spec-design`, and makes orchestration validate only the handoff representation without semantically re-reviewing phase output.

## Changed surfaces

- `spec-design`, `discuss-pathfinding`, `program-design`, `spec-program-review`, and `orchestrator-design`, plus their directly owned references.
- One shared runtime reference for the Requirements, Specification, and Program Design boundary.
- Focused Vitest pressure scenarios for separate Specification creation, Requirements reuse, owner-tolerance pathfinding, structural-synthesis routing, Program Design rejection, review rejection, and file-backed/chat-only orchestration handoffs.
- Codex and Claude plugin manifests, Claude marketplace metadata, and the plugin README.

## Validation

- `pnpm --dir tests/skills run test:unit`: 16 files and 85 tests passed.
- `pnpm --dir tests/skills run typecheck`: passed.
- Codex `skill-creator` quick validation passed for `spec-design`, `discuss-pathfinding`, `program-design`, `spec-program-review`, and `orchestrator-design`.
- `claude plugin validate .`: passed.
- `git diff --check origin/master`: passed.
- Focused Luna-high/Terra-medium runs passed eight affected scenarios and all 24 semantic criteria, including the Spec Design review-handoff case. The chat-only review-navigation case was attempted twice. The second attempt reached Luna but returned no subject artifact after 377 seconds; it was interrupted. This remains an open behavior-proof gap, not a passing result.
- A focused Pathfinding readability rerun passed both affected scenarios and all seven semantic criteria. The unresolved-policy case used one shared explanation followed by three related questions; the confirmed-policy case returned a concise handoff without re-asking. Neither response exposed the `<show diagram>` authoring marker.
- The unfiltered 143-scenario `pnpm --dir tests/skills run test:evals` suite was not run. Historical RED/GREEN was not reproduced.

## Refresh / reinstall

- Source metadata targets `shravan-dev-workflow` 1.7.12.
- Local Codex and Claude caches are not refreshed by this source change.
