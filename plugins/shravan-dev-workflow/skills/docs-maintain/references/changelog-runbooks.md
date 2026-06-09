# Changelog Runbooks

Use this when a repo needs local memory for meta-programming, docs, prompts, skills, or agent instructions.

## Folder Shape

```text
docs/
  changelog/
    yyyy-mm-dd-short-name.md
    references/
      yyyy-mm-dd-short-name.md
```

## Main Entry

The main changelog entry should capture:

- date
- scope
- what changed
- why it changed
- source-of-truth decision
- files touched
- validation performed
- follow-ups

Keep it readable. It is a runbook, not a raw transcript.

## References Entry

The references file should capture evidence without bloating the main entry:

- memory or session summary paths
- rollout ids or session ids
- relevant local repo paths
- short excerpts
- retrieval notes for future agents

Do not paste huge transcripts. Keep excerpts small and point to full retrieval paths.

## Naming

Use `yyyy-mm-dd-name-that-means-something.md`.

Examples:

- `2026-06-09-shravan-dev-workflow-skill-system.md`
- `2026-06-09-devfiles-meta-docs-memory.md`

## AGENTS.md Pointer

Add only a short pointer:

```text
For durable meta-workflow changes, add a dated note under docs/changelog/ and put evidence snippets under docs/changelog/references/.
```
