# Skill Authoring Inspiration Review

Track references, examples, and lessons that may improve how skills are designed
in this repo.

This is not the implementation plan for skill changes. When an authoring lesson
becomes actionable, route it through `skill-audit`, then into a focused plan or
skill update.

## Review Queue

### Skill-Creation Improvement Video

- Source: https://youtube.com/watch?v=UNzCG3lw6O0&si=yP-chwziZEYtav7m
- Status: review
- Question to answer: what does this teach about creating sharper skills,
  pressure-testing skill behavior, or separating compact instructions from
  deeper references?
- Output: add only durable lessons to this doc or promote them to a plan.

### SwiftUI Agent Skill

- Source: https://github.com/twostraws/SwiftUI-Agent-Skill
- Status: review
- Why it matters: it is a concrete external example of a domain-specific agent
  skill with a compact `SKILL.md` and deeper topic references.

Useful patterns to inspect:

- Clear trigger wording that says what the skill does and when it should load.
- Compact core instructions with topic depth moved into `references/`.
- Domain-specific review passes instead of one vague checklist.
- Token-budget discipline: do not repeat things the base model already knows.
- Explicit constraints and edge cases, such as deprecated APIs, performance,
  accessibility, and code hygiene.

Caveats:

- Treat it as inspiration, not source text to copy.
- It is a SwiftUI review skill; local workflow skills such as
  `spec-creation-swarm`, `research-swarm`, and `discuss-with-me` have different
  phase boundaries and artifact outputs.
- Borrow structure and failure shields only when they fit local skill behavior.

## Authoring Questions

- What behavior should a future agent do differently because this skill exists?
- What rationalization or shortcut should the skill prevent?
- What belongs in compact `SKILL.md` instructions?
- What belongs in `references/`?
- What deterministic work belongs in `scripts/`, if anything?
- What pressure scenario proves the change works?

## Promotion Rule

Keep raw inspiration here while it is being evaluated. Promote only the lesson,
not the whole source, into a skill plan, `skill-audit` recommendation, or durable
authoring reference.
