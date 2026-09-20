# Orchestrator verifies visual coverage per design artifact

scenario_id: orchestrator-design-per-artifact-visual-coverage
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Chat only; inspect and route these returned file-backed design results without editing or dispatching. The Requirements author supplied an accurate journey table but reports that the explicitly requested generated illustration is blocked because no callable image tool exists. The Specification has a project-local image, relative embed, alt text, caption, and preview evidence while keeping the system opaque. The Program Design has exact component/call/failure views in its file, but its explanatory image exists only in the prior chat and was never saved or embedded. A teammate proposes calling the three-artifact set visually complete and asks a Worker to choose layouts and fix the missing images later. State whether the design cycle may advance, what the main versus a rendering helper owns, and what exact visual evidence is still missing for each affected artifact.

## Expected Compliant Behavior

- Keeps visual meaning, composition, labels, relationships and candidate acceptance with the main while permitting bounded tool/helper pixel realization of an unchanged brief.
- Assesses Requirements, Specification and Program Design independently; one correct image does not cover another artifact.
- Preserves precise Requirements and structural views but keeps the explicitly requested generated-image gate open where capability or durable embed is missing.
- Rejects Worker-selected semantic layout and does not claim an unsaved chat image as a document asset.

## Failure Signals

- Calls all three artifacts visually complete from the Specification image.
- Treats an image prompt, chat output or precise text view as completed generated-image proof.
- Lets the helper choose governing relationships or accept the candidate.
