# Domain model and trace: descriptions-only trigger evaluation

Run 1 (`program-design`) of `docs/wip/skills-authoring/2026-09-25-domain-model-and-trace/proposal.md` changed the `program-design` description. This evaluation checks that the new wording routes binding requests to `program-design` and keeps entity meaning with `spec-design`.

## Method

- Router: `cursor-grok-4.6-low` through the Cursor agent CLI in read-only `ask` mode, run from an empty scratch directory so it saw only the packet.
- Packet: the `name` and `description` of all 31 active plugin skills, taken from the working tree after the Run 1 description edit, plus the prompts below. The router returned one skill or `none` per prompt, with a runner-up.
- One sample. This is routing evidence for the descriptions only; it does not exercise skill bodies.

## Prompts

P1 to P8 reconstruct the eight prompts of the 2026-09-18 evaluation. That run's log records each prompt's route and category but not its text, so each reconstruction targets the same route and category. P9 and P10 are the two prompts the proposal names. P11 is a plain Why/What near miss.

| id | prompt | expected |
| --- | --- | --- |
| P1 | Which package should own the reminder-due event schema, and what fields does it carry across the worker boundary? | `program-design` |
| P2 | We keep saying 'occurrence' for held tickets but nobody agrees whether a re-hold is the same reminder or a new one. I haven't decided; help me work out what I actually mean. | `discuss-pathfinding` |
| P3 | Independently review this Specification and Program Design pair and tell me whether the design realizes every obligation. | `spec-program-review` |
| P4 | The three design docs are reviewed and ready. Write the implementation plan with task order, write scopes, and test commands. | `plan-implementation` |
| P5 | Just explain how the existing reminder worker flows today in chat. No design changes, no documents. | `none` |
| P6 | Take this reminders feature from requirements through specification, program design, and independent review before we plan anything. | `orchestrator-design` |
| P7 | What does a Ticket Change mean in our domain, and which ticket updates count as one? | `spec-design` |
| P8 | The spec is settled. Design the component tree, interfaces, and call path for the reminder worker. | `program-design` |
| P9 | Bind these entities to packages and schemas. | `program-design` |
| P10 | Define what a Reminder is and its states. | `spec-design` |
| P11 | Write the observable obligations for reminder scheduling: what must be true for a CX agent when a held ticket's due date arrives. | `spec-design` |

## Result

11 of 11 routed as expected.

| id | chosen | runner-up |
| --- | --- | --- |
| P1 | `program-design` | `spec-design` |
| P2 | `discuss-pathfinding` | `discuss-clarify-mental-models` |
| P3 | `spec-program-review` | `implementation-review` |
| P4 | `plan-implementation` | `orchestrator-implementation-goal` |
| P5 | `none` | `presentation-webui` |
| P6 | `orchestrator-design` | `spec-design` |
| P7 | `spec-design` | `discuss-pathfinding` |
| P8 | `program-design` | `spec-design` |
| P9 | `program-design` | `spec-design` |
| P10 | `spec-design` | `program-design` |
| P11 | `spec-design` | `program-design` |

The router's reasons for P9 and P10 cite the boundary the description draws: binding to packages and schemas is the `program-design` step, and defining an entity and its states is Specification meaning.

## Limits

One sample from one router model. P1 to P8 are reconstructions, so this result is not a like-for-like rerun of the 2026-09-18 evaluation.
