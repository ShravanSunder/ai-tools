# Trail view loses proof freshness and link ownership

- Observed: 2026-09-09
- Status: captured
- Skill/workflow: track-show-me-your-work / manage-agents, 2.9.0
- Task context: Render a fixed 30-line implementation proof trail using a Luna Operator.
- Expected behavior: Preserve exact proof-head limits and absolute linked-detail ownership from the supplied packet.
- Observed behavior: The generated view called historical CI a current-head pass while also saying new proof lacked CI. It moved one linked review artifact into the trail directory, where it did not exist. It also attributed fixture failures to timing without established cause.
- Evidence: Parent packet explicitly identified passing head 7fc419b and newer head 65b2282. Rendered text said latest hosted CI for the current head was green. Parent rejected that claim and requested a bounded correction before returning the view.
- Recurrence: Multiple independently checkable errors in this rendering; the session handoff also reports an earlier rendering correction, not independently reverified here.
- Impact: Misleads the reader about merge readiness and breaks navigation to governing evidence.
- Suspected cause: Summary compression drops identity qualifiers and re-roots paths; hypothesis only.
- Follow-up: Preserve exact head qualifiers and provided absolute paths; parent verification caught the issue. No skill changes authorized or made.
