# Skills Backlog Funnel

Track skill-system improvement ideas before they become implementation plans.

The goal is to capture useful signals from sessions, pstack/session lists, Slack
or other conversations, external skill examples, and user notes without dumping
every idea into Things. Each item should move toward evidence, classification,
or deletion.

## Funnel States

- `capture`: raw note with source and rough problem.
- `investigate`: needs transcript, repo, or behavior evidence.
- `update existing skill`: existing skill is the right owner.
- `create new skill`: repeated workflow has stable inputs, process, and output.
- `merge/split skill`: current boundaries are confusing or overloaded.
- `skip`: one-off, already covered, vague, or not worth encoding.
- `promote to plan`: ready for executable skill work with proof gates.
- `done`: implemented, deleted, or promoted to durable docs/changelog.

## Intake Template

```markdown
## Item: short-name

- Status:
- Source:
- Problem:
- Evidence needed:
- Likely owner:
- Candidate classification:
- Next action:
```

## Current Backlog

### Spec Collector Focus

- Status: investigate
- Source: user note
- Problem: `spec-creation-swarm` may need clearer guidance that some spec work
  should focus on creating a collector.
- Likely owner: `spec-creation-swarm`
- Candidate classification: update existing skill or create collector workflow
- Next action: define what "collector" means in this workflow before editing any
  skill.

### Research Swarm Collaboration Framing

- Status: investigate
- Source: user note
- Problem: `research-swarm` should emphasize collaboration and mention routing
  through `discuss-*` workflows where appropriate.
- Likely owner: `research-swarm`
- Candidate classification: update existing skill
- Next action: inspect current `research-swarm` language and identify the
  smallest wording change after evidence is gathered.

### Discuss Skill Boundary Review

- Status: investigate
- Source: user note
- Problem: decide whether `discuss-with-me` should stay one skill with intent
  handles or break into narrower `discuss-*` skills.
- Likely owner: `discuss-with-me`
- Candidate classification: merge/split skill or skip
- Next action: gather repeated session evidence showing whether separate
  triggers would prevent failures.

### Session Capture And Skill Proposal Funnel

- Status: capture
- Source: user note
- Problem: need a workflow or skill that takes Codex, Claude, Cursor, and other
  session data, saves useful lessons to session history or lessons repos, and
  converts them into skill-improvement proposals.
- Likely owner: new skill, with handoff into `research-swarm`, `skill-audit`,
  and `docs-maintain`
- Candidate classification: create new skill
- Next action: define privacy boundaries, supported session sources, output
  locations, and proposal shape before implementation.

### Better Input Funnel For Skill Ideas

- Status: capture
- Source: user note
- Problem: pstack/session lists, Slack conversations, new skills, and random
  observations should funnel into skill-improvement review instead of becoming
  unstructured Things tasks.
- Likely owner: new workflow or the session-capture skill
- Candidate classification: create new skill or update Skill Work SOP
- Next action: define the intake states and decide which destinations are public
  repo docs, private notes, or external systems.

### Skill Authoring Inspiration Sources

- Status: capture
- Source: user note
- Problem: external examples should inform better local skill authoring without
  becoming copy-paste sources.
- Inputs:
  - https://youtube.com/watch?v=UNzCG3lw6O0&si=yP-chwziZEYtav7m
  - https://github.com/twostraws/SwiftUI-Agent-Skill
- Likely owner: `skills-authoring/inspiration-review.md`, then `skill-audit`
- Candidate classification: update existing authoring guidance or promote to
  plan
- Next action: review sources and extract only local, pressure-tested lessons.

## Review Cadence

When this backlog is used for real work:

1. Move raw notes from `capture` to `investigate` only when there is enough
   source context to inspect.
2. Route skill-surface decisions through `skill-audit`.
3. Promote actionable items to `docs/superpowers/plans/` before implementation.
4. Delete or archive completed WIP items after the durable change lands.
