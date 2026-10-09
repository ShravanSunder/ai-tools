# Runner Usage

This reference owns how to run the skill eval runner and read what it returns. Return the command run, its exit code, the batch directory, each Run's verdict, and the Done-bar result when one was asked for.

## Before You Run

- **Runner path.** Run it only with `pnpm --config.dlx-cache-max-age=0 dlx file:<runner-dir>`, where `<runner-dir>` is the `packages/skill-eval-runner` folder of the ai-tools checkout. Ask the user for that path once if you do not know it. Never install the runner, Deno, Codex, or anything else. `pnpm dlx` installs nothing into the repository or globally; pnpm keeps a dlx cache. The cache flag matters: without it `pnpm dlx` reuses its first copy of a local folder for a day and runs stale code.
- **Codex.** Subjects and the judge run on `gpt-6-luna` through Codex. The runner uses the `codex` on `PATH`, or `--codex-path <path>`. The user must be logged in to Codex with a file-based login. The runner links that login into each subject's isolated Codex home; a subject Run that touches it fails as `execution-failed` (`credential-exposure`) and its observation is withheld.
- **A normal shell.** Start the runner from a shell that is not itself inside an agent's sandbox. Inside a Codex sandbox the subjects' reads are blocked, so the runner refuses to start there; ask the user to run it, or to grant unsandboxed execution through the host's permission prompt; never bypass the sandbox yourself.
- **Hidden material.** Each subject works in a snapshot of the repository without `tests/skills/pressure-scenarios/` (every skill's scenarios), the scenario directory in use, or any `scenarios/` folder beside a skill. List any other path that states live checks (other scenario directories beside a custom `--scenarios` directory, eval specs, eval changelogs, the runner itself) in `.skill-eval-hide` at the repository root and the runner removes it from every snapshot; the runner package's README documents the syntax.
- **Cost.** Each Run is one subject session (Luna, medium effort) plus one judge session (Luna, high effort) per Check that reaches a judge leaf. Start with `--runs 1`.

## Commands

```bash
# check scenario files without running anything
pnpm --config.dlx-cache-max-age=0 dlx file:<runner-dir> validate --repo <repo> --skill <skill-dir> [--scenarios <dir>] [--scenario <id>]...

# run scenarios: one fresh subject per Run, in an isolated snapshot
pnpm --config.dlx-cache-max-age=0 dlx file:<runner-dir> run --repo <repo> --skill <skill-dir> [--scenarios <dir>] [--scenario <id>]... \
  [--runs <n>] [--parallel <n>] [--rev working-tree|<git-rev>] [--out <dir>]

# lint a skill set (code rules; Jev cards when the engine exists)
pnpm --config.dlx-cache-max-age=0 dlx file:<runner-dir> lint --skill-set <dir> [--forbid <word>]...

# judge a done bar
pnpm --config.dlx-cache-max-age=0 dlx file:<runner-dir> done-bar --kind new-from-intent --repo <repo> --skill <skill-dir> [--scenarios <dir>] [--head <rev>]
pnpm --config.dlx-cache-max-age=0 dlx file:<runner-dir> done-bar --kind fix-for-recorded-failure --repo <repo> --skill <skill-dir> [--scenarios <dir>] \
  --scenario <id> --base <rev-before-fix> [--head <rev>]
```

The runner reads a skill's scenarios from `tests/skills/pressure-scenarios/<owner>/<skill>/` in `--repo`, where `<owner>` is the directory holding the skill set (the plugin for `plugins/<plugin>/skills/<skill>`); `--scenarios <dir>`, relative to `--repo`, reads them from another directory. When that directory is not strictly inside the repository (a skill set at `<repo>/skills/` or at the repository root), there is no owner segment and the default is `tests/skills/pressure-scenarios/<skill>/`; `.agents/skills/<skill>` keeps `.agents` as its owner (`tests/skills/pressure-scenarios/.agents/<skill>/`). A missing scenario directory exits 2 and names the path it looked for; so does a `--scenarios` directory that is or contains the skill under test, or is the repository root.

`--rev working-tree` (the default) includes uncommitted edits, so you can prove a change before committing it. The subject runs in a copy; nothing it does reaches the repository.

## Exit Codes

```text
0   every Run passed, or the bar is met
1   some Run did not pass, or the bar is not met
2   invalid input or environment: a bad scenario, no Codex, no login
```

## Reading Results

Results go to `~/.cache/skill-evals/<repo>/<batch-id>/` unless `--out` names a directory:

```text
batch.json                                  per scenario: verdict counts, judge-leaf rate, subject tokens, judge calls
<scenario-id>/runs/<run-id>/prompt.md       exactly what the subject saw
<scenario-id>/runs/<run-id>/observation.json   tool calls, permission requests, turns, final reply
<scenario-id>/runs/<run-id>/checks.json     each Check's result and the path its tree took
<scenario-id>/runs/<run-id>/verdict.json    pass | fail | inconclusive | execution-failed
done-bar.json                               when done-bar ran
```

Subject tokens cover only each Run's last model request, not the whole Run. Keep batch directory paths out of public changelogs and PRs.

A Run's verdict is `fail` when any Check failed, else `inconclusive` when any Check could not be settled, else `pass`. A later pass never hides an earlier fail. `execution-failed` means the subject never produced an observation (the agent did not start, timed out, was cancelled, or the model never ran) or touched the linked login (`credential-exposure`), whose observation is withheld. It says nothing about the skill; fix the cause and rerun.

Read every failed or inconclusive Check's path in `checks.json`, then the reply in `observation.json`. A Check result is evidence about the run, not a verdict on the skill; `proof-and-claims.md` owns what claim it supports.

## Done Bars

```text
new-from-intent           lint passes and every active scenario of the changed skills
                          has a passing Run at head
fix-for-recorded-failure  the named scenario fails once at --base, then passes
                          3 fresh Runs at head
any bar                   an execution-failed or inconclusive Run makes the bar
                          not-evaluable until rerun; never met
```

`new-from-intent` needs the Jev lint cards. Until the Jev tool is available it returns `not-evaluable (jev-lint-unavailable)`; report that gap, do not round it up.

Complete when: the command, exit code, batch directory, and each Run's verdict are reported, every failed or inconclusive Check has been read in its observation, and any Done-bar result is reported exactly.
