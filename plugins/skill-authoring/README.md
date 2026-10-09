# Skill Authoring

Skills for authoring skills in any repository: design and write them, review them with independent agents, prove their behavior with fresh agent runs, and audit which skills to create, update, merge, or skip.

| Skill | Use it to |
| --- | --- |
| `skill-orchestrator` | carry one skill change from spec to release: spec, review, implementation, proof, assessment, review, ship |
| `skill-creation` | design and write one skill and its skill spec; owns the craft every other skill judges against |
| `skill-review` | review a skill spec or skill files with several independent reviewer agents plus lint |
| `skill-pressure-testing` | prove a skill change with fresh Luna runs against its done bar, and write the scenarios that do it |
| `skill-audit` | decide from evidence which skills to create, update, merge, or skip |

The plugin stands alone. It names no skill from another plugin; install it beside any other plugin and invoke both when you want them together.

## Evals

Pressure scenarios live under `tests/skills/pressure-scenarios/<plugin>/<skill>/` (another repository can name its own directory with `--scenarios`). They run through the separate `skill-eval-runner` package (`packages/skill-eval-runner` in this repository), started with `pnpm --config.dlx-cache-max-age=0 dlx file:<runner-dir>`; nothing is installed. `skill-pressure-testing` owns how to write and run them.
