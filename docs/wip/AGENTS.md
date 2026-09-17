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

Raw signals, investigations, lessons, authoring evidence, and the backlog live under `~/dev/memory-logs/skills/`. See root `AGENTS.md`.

This folder may hold only skill-change proposals:

`docs/wip/skills-authoring/<yyyy-mm-dd-name>/proposal.md`

An accepted multi-run spec there is its own commission per `skills-creation`. Evidence for that spec stays in `~/dev/memory-logs/skills/authoring/<yyyy-mm-dd-name>/`.

1. Capture the signal in `~/dev/memory-logs/skills/log/` (or investigation/lessons).
2. Classify with `skill-audit` when the target is unnamed or the portfolio is in question.
3. If a named skill should change, write the proposal here and run `skills-creation`.
4. After the durable change lands, delete or archive the proposal; leave memory-logs as history.

Prefer updating an existing skill over creating a new one unless repeated evidence shows a distinct workflow with stable inputs, procedure, and output.
