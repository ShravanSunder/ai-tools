# skill-eval-runner

`skill-eval-runner` validates and runs the new scenario format for any skill package.

```sh
pnpm --config.dlx-cache-max-age=0 dlx file:/path/to/skill-eval-runner validate --repo /path/to/repo --skill path/to/skill [--scenarios path/to/scenarios]
pnpm --config.dlx-cache-max-age=0 dlx file:/path/to/skill-eval-runner run --repo /path/to/repo --skill path/to/skill [--scenarios path/to/scenarios] --scenario scenario-id
pnpm --config.dlx-cache-max-age=0 dlx file:/path/to/skill-eval-runner lint --skill-set /path/to/skills --forbid shravan-dev-workflow
pnpm --config.dlx-cache-max-age=0 dlx file:/path/to/skill-eval-runner done-bar --repo /path/to/repo --skill path/to/skill [--scenarios path/to/scenarios] --kind new-from-intent
```

A skill's scenarios, their `cards.yaml` and their `fixtures/` live in its scenario directory, by default `tests/skills/pressure-scenarios/<owner>/<skill>/` in `--repo`, where `<owner>` is the directory holding the skill set (the plugin for `plugins/<plugin>/skills/<skill>`). `--scenarios <dir>`, relative to `--repo` like `--skill`, names another directory; a missing one exits 2 and names the path it looked for. Fixture sources are relative to the scenario directory.

`--config.dlx-cache-max-age=0` makes `pnpm dlx` install the current folder each time; without it pnpm reuses its first copy of a local folder for a day. Run and done-bar require a normal unsandboxed shell. The shell must have an installed `codex` on `PATH` (or `--codex-path`) and a file-based login at `$CODEX_HOME/auth.json`. Results default to `${XDG_CACHE_HOME:-$HOME/.cache}/skill-evals/`; use `--out` to choose another directory. Exit 0 means the requested run or bar passed, exit 1 means a run/bar failed or was not evaluable, and exit 2 means invalid input or an unsuitable environment.

## Hiding evaluation material: `.skill-eval-hide`

Each Run's subject works in a snapshot of the repository. The runner always strips the scenario directory in use and any `scenarios/` folder beside a skill, but anything else that states the checks stays readable: other skills' scenario directories, a skill spec quoting check ids or observed failures, eval notes, changelogs about eval fixes, the runner itself. List those paths in `.skill-eval-hide` at the repository root and the runner removes them from every snapshot. Without the file nothing else is hidden.

```text
# Evaluation material that states live checks
docs/wip/skills-authoring/
docs/changelog/2026-10-*-eval.md
EVAL-NOTES.md
```

- **Syntax** is a gitignore subset. `#` starts a comment and blank lines are ignored. A trailing `/` matches directories only. A pattern with a `/` at its start or in its middle is anchored to the repository root; otherwise it matches that name at any depth. `*` matches within one path segment. `!`, `**`, `?`, `[ ]` and `\` are rejected, never guessed at.
- **When it is read.** From the repository named by `--repo` as it is now, for every Run, including Runs at a commit (`--rev`, `done-bar --base`). A base and its head therefore hide the same material even when the base predates the file. `run` and `done-bar` check it once before any Run: unsupported syntax, or a pattern that would hide the skill under test, exits 2.
- **What the subject sees.** Matched paths and the `.skill-eval-hide` file itself are removed after the scenario directory and `scenarios/` folders are stripped and before the skill set is exposed, so a hidden file inside a skill set is not exposed either. A scenario's fixtures are placed afterwards, so a fixture still lands at its target even under a hidden path.
