# WIP Agent Guidance

`docs/wip` is temporary working memory. Keep it easy to delete.

## Rules

- Put human-facing indexes in `README.md`; put agent-facing operating guidance
  here.
- Do not treat WIP docs as durable source of truth.
- Delete WIP docs when the work is done unless the content must be promoted.
- Promote executable work to `docs/plans/` or `docs/superpowers/plans/`.
- Promote shipped user-visible behavior to `docs/changelog/`.
- Promote durable operating guidance into the owning skill, repo docs, or root
  `AGENTS.md`.
- Keep sensitive transcript details out of public docs. Summarize behavior and
  link to private evidence only when appropriate.

## Skill Improvement Workflow

Use WIP skill docs as an intake funnel:

1. Capture the raw signal in the relevant file.
2. Gather enough evidence to classify it.
3. Route skill-surface decisions through `skill-audit`.
4. Promote actionable work into a plan before implementation.
5. Delete or archive the WIP note after the durable change lands.

Prefer updating an existing skill over creating a new one unless repeated
evidence shows a distinct workflow with stable inputs, procedure, and output.
