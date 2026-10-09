# Skill Authoring

Skills for authoring skills in any repository: design and write them, review them with independent agents, and audit which skills to create, update, merge, or skip.

| Skill | Use it to |
| --- | --- |
| `skill-orchestrator` | carry one skill change from spec to release: spec, review, implementation, proof, assessment, review, ship |
| `skill-creation` | design and write one skill and its skill spec; owns the craft every other skill judges against |
| `skill-review` | review a skill spec or skill files with several independent reviewer agents |
| `skill-audit` | decide from evidence which skills to create, update, merge, or skip |

The plugin stands alone. It names no skill from another plugin; install it beside any other plugin and invoke both when you want them together.

## Proof

The plugin ships no eval runner and no stored scenarios. `skill-creation`'s `references/proof-and-claims.md` sets which claim a piece of behavior evidence supports, how a fresh run must be read to count, and names the gap when there is none.
