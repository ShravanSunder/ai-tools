# Skill Failure Log Format

Record suspected defects, not assumed root causes or implementation commitments.

- Search [README.md](README.md) and existing entries first; append evidence to a matching failure pattern.
- Create distinct entries as `yyyy-mm-dd-short-description.md` and add a row to the README index, newest first. Keep index status aligned with the entry.
- Keep entries brief. Record facts separately from hypotheses; use `unknown` for missing information.
- Summarize sensitive context safely. Do not copy secrets, raw private transcripts, or identifying private evidence into this repository.
- Link deeper diagnosis under `../skills-investigation/`; keep the detailed analysis there rather than duplicating it.
- Continue the agreed work unless blocked. Logging does not authorize skill edits; follow the parent WIP guidance for investigation and promotion.

## Entry template

```markdown
# Short failure description

- Observed: YYYY-MM-DD
- Status: captured | investigating | resolved | dismissed
- Skill/workflow: name and source/version when known
- Task context: brief, privacy-safe description
- Expected behavior:
- Observed behavior:
- Evidence: safe file/line, command result, or artifact pointers
- Recurrence: known occurrences; do not infer a pattern from missing evidence
- Impact:
- Suspected cause: hypothesis or unknown
- Follow-up: missing evidence, linked investigation, or fix and validation
```

When resolving or dismissing an entry, record the reason and supporting evidence.
