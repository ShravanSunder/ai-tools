# Lint

This reference owns the lint pass that runs before reviewer agents: deterministic code rules plus narrow Jev questions. Return the lint findings as candidates with anchors, and whether the Jev cards ran.

Expected inputs: the reviewed skill set (the folder that holds the skills, such as `<plugin>/skills/`), and the words that must not appear in it.

## Run It

```bash
pnpm dlx file:<runner-dir> lint --skill-set <skill-set-dir> [--forbid <word>]...
```

`<runner-dir>` is the `packages/skill-eval-runner` folder of the ai-tools checkout; ask the user for that path once if you do not know it. Run it only through `pnpm dlx`; never install the runner, Deno, or anything else. Exit 0 means no findings, 1 means findings, 2 means the input or environment was invalid.

## Code Rules

- `name` equals the skill's directory name, and `description` exists, stays within 1024 characters, and starts with "Use when";
- every backticked relative `.md` path in a skill file (`references/…`, `./…`, `../…`) resolves;
- no forbidden word appears. Pass a `--forbid` for every name the skill set must not mention, such as another plugin it must stay independent of.

## Jev Cards

Each card asks one narrow yes/no question. Code chooses which passages or descriptions a card applies to; Jev only answers the question.

- **duplicated rule:** do these two passages state the same rule in different words?
- **rule lost its home:** does this passage restate a rule its named owner file defines?
- **trigger overlap:** would one request load both of these skill descriptions?

Jev never decides whether a finding is valid. A `yes` is a candidate the review lead verifies at its anchor like any other. Until the Jev tool is available the runner reports the cards `not-run: no Jev engine`; record that as a coverage gap in the reduction, never as a pass.

Complete when: lint ran, or the reason it could not run is recorded; every lint finding is in the reduction as a candidate; and the Jev-card status is recorded.
