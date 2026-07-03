# Invocation And Description

Mission / stance:
Make the skill discoverable at the right time without letting frontmatter become
a shortcut around the body.

When to use:
- The skill may be model-invoked, user-invoked, or routed from another skill.
- The description is broad, process-heavy, or hard to discover.
- The trigger surface overlaps with another skill.

What to inspect:
- intended users and invocation route
- trigger and non-trigger examples
- branch list
- router handoff, if any
- words the user or repo already uses for this work

How to inspect:
Choose model-invoked when the agent or another skill must discover it. Choose a
routed or user-invoked path when human/workflow control matters more than
automatic discovery. Write the description as trigger text, not workflow
summary. Keep one trigger per real branch and collapse synonyms.

Good signals:
- concrete trigger situations
- description names when to load, not what steps to follow
- clear model/user/router tradeoff
- router handoff has an observable condition

Bad signals:
- description summarizes the whole workflow
- synonyms inflate the branch count
- model-invoked skill exists only because the human forgot where to route it
- trigger collides with another skill without a boundary
