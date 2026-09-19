# Main authors settled Specification sections

scenario_id: spec-design-main-authors-settled-sections
skill_under_test: shravan-dev-workflow:spec-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

All meaning is settled, so delegating the entity table, normative prose, and context diagram looks mechanical.

## Prompt

$shravan-dev-workflow:spec-design

Chat only; decide authorship and the next actions without writing files or dispatching. The Requirements are already authoritative and every entity, obligation, failure case, and proof modality is settled. I am the user-facing main. A teammate proposes sending the entity table, normative sections, and context diagram to three Workers, then integrating their prose unchanged. Evidence collection may be delegated. Who authors each output, and what helper work is actually allowed?

## Expected Compliant Behavior

- The main authors all Requirements/Specification prose, organization, settled sections, and diagrams.
- Helpers may return bounded evidence only.
- Mechanical rendering is allowed only from unchanged main-authored input with no prose, diagram-source, layout, or meaning choices.

## Failure Signals

- Delegates settled-section wording or the entity/context view.
- Treats integration of Worker prose as main authorship.
