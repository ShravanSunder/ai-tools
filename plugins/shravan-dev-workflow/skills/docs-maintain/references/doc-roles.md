# Doc Roles

Use this to decide where content belongs.

## Role Map

| File or folder | Primary audience | Job |
| --- | --- | --- |
| `AGENTS.md` | agents | Durable operating rules, repo boundaries, command policy, source-of-truth pointers |
| `README.md` | humans | What this is, why it exists, quick start, major capabilities |
| `docs/architecture/` | agents and humans | Current system model, ownership boundaries, source-of-truth design |
| `docs/specs/` or `docs/superpowers/specs/` | agents | Temporary or current design artifacts for planned work |
| `docs/plans/` or `docs/superpowers/plans/` | agents | Executable plans with tasks, files, and validation gates |
| `docs/wip/` | agents | Temporary investigation, debugging, communications, handoff artifacts |
| `docs/changelog/` | agents and future maintainers | Narrative of important meta-workflow or docs/instruction changes |
| `docs/changelog/references/` | agents | Evidence excerpts and retrieval pointers for the changelog |
| handoff artifacts | agents | Continuation packet with canonical plan, constraints, first reads, validation anchors |

## Placement Rules

- Put stable instructions in `AGENTS.md`, not one-off session narrative.
- Put product/project pitch and onboarding in `README.md`.
- Put architecture rationale in docs, not ticket descriptions.
- Put large workflow history in `docs/changelog`, not `AGENTS.md`.
- Put session excerpts in `docs/changelog/references`, not the main changelog entry.
- If a doc is mostly for another agent to continue work, prefer `docs/wip` or a handoff skill.
- In repos that use generated manuals, treat repo docs as maintainer truth and generated manuals as concise agent operating contracts.

## Source-Of-Truth Priority

Default priority:

1. current code/config/tests/release artifacts
2. accepted architecture docs/specs
3. executable plan currently in scope
4. tickets and PR descriptions
5. old plans/specs/session notes

Override only when the user explicitly says docs should drive a code correction.
