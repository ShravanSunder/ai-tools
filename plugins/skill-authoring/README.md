# Skill Authoring

Skills for authoring skills in any repository: design and write them, review them with independent agents, prove their behavior with fresh agent runs, and audit which skills to create, update, merge, or skip.

| Skill | Use it to |
| --- | --- |
| `skill-orchestrator` | carry one skill change from spec to release: spec, review, implementation, proof, assessment, review, ship |
| `skill-creation` | design and write one skill and its skill spec; owns the craft every other skill judges against |
| `skill-review` | review a skill spec or skill files with several independent reviewer agents |
| `skill-pressure-testing` | prove a skill change against its done bar with fresh agent runs, read by hand |
| `skill-audit` | decide from evidence which skills to create, update, merge, or skip |

The plugin stands alone. It names no skill from another plugin; install it beside any other plugin and invoke both when you want them together.

## Proof

The plugin ships no eval runner and no stored scenarios. `skill-pressure-testing` proves a change with fresh agent runs that the author starts and reads by hand, and names the gap when that cannot be done.
