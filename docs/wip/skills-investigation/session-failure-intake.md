# Session Failure Intake

Track sessions that went wrong, exposed brittle agent behavior, or suggested a
missing skill guardrail.

These notes are evidence intake, not implementation commitments. After an
investigation is understood, route it through `skill-audit` as `update`,
`create`, `merge`, or `skip`, then delete or promote the note.

## Intake Template

```markdown
# yyyy-mm-dd-session-or-failure-name

## Source

- Session, transcript, PR, issue, Slack thread, or manual note:
- Related repo or workflow:
- Date observed:

## What Went Wrong

- Observed behavior:
- Expected behavior:
- Cost of the failure:

## Evidence To Collect

- Relevant transcript excerpts:
- Files, commands, or logs:
- Existing skill or instruction that should have prevented it:

## Initial Classification

- Status: investigate
- Likely owner: unknown
- Candidate outcome: update existing skill | create new skill | merge/split
  skills | skip | promote to plan

## Next Step

- What evidence is still missing:
- Who or what should inspect it next:
```

## Investigation Rules

- Start from real session evidence, not vague dissatisfaction.
- Prefer updating an existing skill over creating a new one.
- Keep sensitive transcript details out of public docs; summarize behavior and
  link to private evidence only when appropriate.
- Close the loop by deleting the note or promoting the decision after the skill
  work is done.
