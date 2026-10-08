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

This folder may hold only skill specs:

`docs/wip/skills-authoring/<yyyy-mm-dd-name>/spec.md`

An accepted multi-run spec there is carried run by run by `skill-authoring:skill-orchestrator` (root `AGENTS.md` "Skill Work SOP"). Evidence for that spec stays in `~/dev/memory-logs/skills/authoring/<yyyy-mm-dd-name>/`.

1. Capture the signal in `~/dev/memory-logs/skills/log/` (or investigation/lessons).
2. Classify with `skill-audit` when the target is unnamed or the portfolio is in question.
3. If a named skill should change, `skill-authoring:skill-creation` writes its skill spec here and `skill-authoring:skill-orchestrator` carries the change through review, proof, and release.
4. After the durable change lands, delete or archive the skill spec; leave memory-logs as history.

Prefer updating an existing skill over creating a new one unless repeated evidence shows a distinct workflow with stable inputs, procedure, and output.
