# Rendered design views

Revision: draft A, 2026-09-22. Status: owner directed implementation on this date. Proposal review was skipped. This revises the medium contract left by the accepted [2026-09-19 visual design spec](../2026-09-19-visual-design-documents/spec.md). It does not reopen that spec.

Owner plugin: `shravan-dev-workflow`. Worktree: `rendered-structural-views` at `6a0a1f3`, branched from `main`.

## Targets and runs

Four sequenced runs, one skill target each. Later runs consume the medium law the first run writes into the shared renderer. None land out of order. The branch ships as one sequence.

| Run | Target | One-sentence promise | Change class |
| --- | --- | --- | --- |
| R1 | `spec-design` | A substantial Requirements document shows each user-visible moment the accepted requirements change, as an Image Gen picture grounded in the current app, and a Specification pins those screens without drawing internal structure. | behavior-changing, user-directed intent |
| R2 | `program-design` | A fired structural view whose meaning is ownership, calls, state, flow, failure, or trust is Mermaid in the file, and a screen the user will see is an Image Gen picture beside that Mermaid, grounded in the current app. | behavior-changing, observed failure plus user-directed intent |
| R3 | `spec-program-review` | Review fails a picture-type view whose medium is a text fence when Mermaid can render, and fails a UI image that invents the product or skips a changed screen. | behavior-changing, observed failure |
| R4 | `orchestrator-design` | The orchestrator rejects a phase receipt that passes a picture-type view as fenced text, and one overview image does not cover the user-visible moments. | behavior-changing, observed failure |

Dependent consistency edits owned by R1, because that run introduces the law:

- `shared-references/diagram-rendering-and-fallbacks.md` owns medium selection. Active consumers that cut over across this sequence: `spec-design`, `program-design`. `spec-program-review` and `orchestrator-design` inspect the result; they do not grow a second medium picker.
- `shared-references/generated-document-visuals.md` owns Image Gen production. It gains the current-app input. No new image skill.
- `docs/diagram-vocabulary.md` records the existing `entity map` token already owned by `spec-design`, and records medium as a rendering fact rather than a new view. It stays a maintainer index, not runtime authority.

`shared-references/mermaid-usage.md` stays the readability check. Chat presentation skills keep loading it and do not gain a diagram quota.

## Problem and evidence

| # | What the reader gets | Cause in current text | Source |
| --- | --- | --- | --- |
| P1 | A 1,707-line design marked `ready` with 22 fenced text blocks, no Mermaid, and no images. Context, components, calls, cancellation, and trust were prose. | Fired views may pass as fenced plain text. "A directly visible fenced plain-text view can be inspected as shown." Program design allows the opening overview to be "already-fired views or concise prose." | `~/dev/memory-logs/skills/investigation/2026-09-02-design-artifacts-declared-ready-without-rendered-diagrams.md`; `diagram-rendering-and-fallbacks.md` medium list and inspect section; `program-design/SKILL.md` artifact stage |
| P2 | Requirements stay sparse. The user cannot see what they asked for. | Requirements imagery is one picture of people, job, pain, and outcome. A journey map is predicate-gated. Nothing requires a picture of a changed screen, and nothing requires looking at the current app. | `spec-design/SKILL.md` artifact stage, Requirements imagery sentence |
| P3 | An agent treats Mermaid, a text tree, and a generated image as equal options, so the same relationship changes medium between runs. | The shared renderer lists those media as choices. Mermaid is loaded only if it is already a candidate. Image Gen is one overview per substantial document. | `diagram-rendering-and-fallbacks.md` Choose the Medium; web prior art summarized below |

Web prior art, 2026-09-22, labeled cited-source summary: GitHub renders Mermaid in Markdown and does not natively render D2, PlantUML, or Structurizr ([GitHub diagram docs](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)). A raster image does not diff as an added edge. Simon Brown's public note on AI architecture diagrams: Mermaid, D2, PlantUML, and DOT are notations and do not enforce an architecture model. Hypothesis, not adopted: a C4 model-as-code tool would hold consistency better, and this repo will not take that toolchain.

## Success definition

A human reading a newly authored substantial Requirements, Specification, or Program Design can see the product and the structure before reading the contracts.

1. Each accepted requirement whose observable difference is a screen, page, or other UI surface has an Image Gen picture of that moment in Requirements. The picture is grounded in the current app when one exists. A clause that is not a screen stays a sentence (R1).
2. Specification shows those same screens only to pin what the user can observe. The product stays one opaque system. Internal owners and calls are absent from the image (R1).
3. Each fired program-design view for ownership, calls, state, flow, failure, or trust is a Mermaid diagram in the Markdown. A screen the user will see is also an Image Gen picture beside that diagram, grounded in the current app. The image does not replace the Mermaid (R2).
4. Fenced plain text is not a pass for those views when the destination renders Mermaid. Review and the orchestrator both reject that receipt (R3, R4).
5. Chat explanations do not gain a diagram quota. `presentation-webui` and `presentation-tui` stay as they are.

## Decisions

The user may strike any row.

| Decision | Default and rationale |
| --- | --- |
| Medium follows the reader question | The agent picks a view the skill already names. The shared renderer picks the medium. A free choice among Mermaid, text trees, and images is the P3 failure. |
| UI is Image Gen | What a person sees is a picture. Mermaid cannot show a real screen. Production stays in `generated-document-visuals.md`. |
| Current app is an input | When a current UI exists, the brief includes the current screen, from the running app or its source, plus the desired change. When none exists, the brief says `no current UI`. A control, navigation, or visual language the app does not have, and the requirement does not change, fails inspection. This stops a fantasy redesign. |
| One picture per changed screen | Requirements are sparse because one people-and-pain image is the whole visual budget. A changed screen is a moment. Unchanged screens and non-UI clauses get no picture. |
| Structure is Mermaid | Ownership, calls, state, flow, failure, and trust stay exact and reviewable. GitHub already renders Mermaid. Text trees are not a peer medium. |
| Unreadable Mermaid is a gap | `mermaid-usage.md` still rejects an unreadable diagram. On a destination that renders Mermaid, the fallback is a smaller Mermaid or an exact gap, not prose labeled as the view. |
| Fenced text | Allowed only when no Mermaid renderer exists. That result is a recorded gap, not a pass, for a picture-type view. |
| Tables stay tables | Requirement coverage and the requirement/design/proof trace stay tables. A picture hides the trace. |
| Image does not own meaning | Normative text stays in prose and tables. A generated screen supplements the requirement or the observable contract. A generated architecture image does not replace a required Mermaid field. |
| No new toolchain | D2, PlantUML, Graphviz, Structurizr, and Excalidraw are out. They do not render in GitHub Markdown without a build this repo does not have. |
| No diagram per heading | A constraint, proof obligation, or single rule stays prose. The deletion test still removes a picture that changes no decision. |
| Chat stays quiet | Presentation skills keep refusing decorative Mermaid. This spec does not edit them. |

## Per-run surfaces

Triggers stay as they are. These skills already load for Requirements, Specification, Program Design, review, and design orchestration. The failure is what they do after loading.

### R1 `spec-design`

- Main path: at the artifact stage, select a user-visible moment for each accepted requirement that changes a screen. State the reader question: what does the user see now, and what will they see. Load the shared renderer with that moment plus any fired Why/What view.
- Depth: R1 writes the medium law into `diagram-rendering-and-fallbacks.md` and the current-app brief into `generated-document-visuals.md`. `spec-design` does not keep a private copy.
- Completion: a changed screen without a grounded image, or a picture-type view passed as fenced text on a Mermaid destination, blocks `locally-ready`. An explicit `no current UI` is a valid ground. Owner-authorized deferral remains the only other waiver, and it is written as a gap.
- Proof: pressure case where Requirements change two screens of an existing app and the agent is pushed to ship one people illustration, a text journey, or a new visual language. Case passes only when both moments are images tied to the current screens and non-UI clauses stay prose.

### R2 `program-design`

- Main path: fired structural views use the R1 medium law. The opening overview is those rendered views. Concise prose is the overview only when no picture-type view fired. A user-visible screen change also gets the grounded Image Gen picture and still keeps its Mermaid.
- Depth: no new reference. Consume the shared renderer.
- Completion: the existing blocker for prose-only contested structure stays. Add the failure form "fenced text counted as the structural view" and "the generated screen replaced the call or state view."
- Proof: pressure case built from the 2026-09-02 rationalizations: predicates fired, author uses  text fences and tables, claims `locally-ready`. A second case offers an attractive generated architecture image in place of the call graph. Both must fail closed.

### R3 `spec-program-review`

- Main path: for each picture-type view, compare the claimed medium and the visible relationships with the written design. A text fence on a Mermaid destination is a finding. A UI image that adds a control the requirement does not change, or omits a changed screen, is a finding.
- Depth: teach the check in the existing common review method. No new lane.
- Completion: those findings block `ready`. A reviewer who cannot open the image reports partial visual coverage, which already exists, and still records the missing medium when the source has no Mermaid for a picture-type view.
- Proof: pressure case with a text-fence component view plus a generated screen that invents a navigation item. Review must report both and must not edit the artifact.

### R4 `orchestrator-design`

- Main path: the existing per-artifact visual inspection rejects a pass whose selected medium is fenced text for a picture-type view. Requirements inspection counts changed screens, not a single overview image.
- Depth: none. Do not copy the view predicates into the orchestrator.
- Completion: `ready` is blocked while that receipt is the phase result.
- Proof: pressure case where both phase skills return `locally-ready` with text fences and one shared image. The orchestrator must not mark the set ready.

## Authoring basis and proof plan

R1 is user-directed intent: the owner asked for UI renders through Image Gen, using the current app, in Requirements, Specification, and Program Design, and named Requirements as sparse on what the user wants. No RED is required before that wording.

R2, R3, and R4 include the observed 2026-09-02 failure. This proposal does not claim a fresh RED in this session. The representative hypothesis is the one the investigation already named: fenced text and tables were treated as the views, and semantic completeness was treated as readable. Pressure cases replay that hypothesis. If a case does not fail for that reason, stop and show the transcript before changing the rule.

Static validation, pressure-case behavior, and a real Image Gen embed are separate claims. A passing pressure case does not prove a model produced a bitmap. When Image Gen is not callable, the run returns the capability gap and does not substitute a drawing.

## Coordination

- Base: `rendered-structural-views` at `6a0a1f3` on `main`. No skill edits are pending in this worktree. This proposal is the only new file until a run is accepted.
- Version: `shravan-dev-workflow` is `2.20.0`. Bump the patch once, at the end of the sequence, to `2.21.0`. One changelog entry for the sequence. Do not refresh installed Codex or Claude caches in these runs.
- Review: this draft is not accepted. Behavior-changing edits wait for proposal review unless the owner skips it.

## Non-goals

- A diagram on every heading.
- Changing `presentation-webui`, `presentation-tui`, or the chat half of `mermaid-usage.md`.
- Adopting D2, PlantUML, Graphviz, Structurizr, Excalidraw, or a docs build.
- A new image-generation skill, provider, or credential path.
- Editing `discuss-pathfinding`. Provisional chat sketches stay there.
- Rewriting the 2026-09-19 visual spec or regenerating images for typo-only edits.

## Sensitive surfaces

Generated UI assets and reads of the current app. Entry point: the main-authored brief, which now includes the current screen or `no current UI`. Untrusted input: generated pixels. Privileged actions: none. A current-app capture may show private product UI; the public changelog and this proposal stay free of screenshots, secrets, and private paths. Decision for the proposal text: allowed. Actual image generation stays capability-gated by `generated-document-visuals.md`.

## Spec-review record

Not reviewed. Draft A is the reviewed artifact when review is commissioned.
