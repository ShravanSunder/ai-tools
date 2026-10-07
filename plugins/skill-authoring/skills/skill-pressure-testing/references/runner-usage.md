# Runner Usage

This reference owns how to run the skill eval runner and read what it returns. Return the command run, its exit code, the batch directory, each Run's verdict, and the Done-bar result when one was asked for.

## Before You Run

- **Runner path.** Run it only with `pnpm dlx file:<runner-dir>`, where `<runner-dir>` is the `packages/skill-eval-runner` folder of the ai-tools checkout. Ask the user for that path once if you do not know it. Never install the runner, Deno, Codex, or anything else; `pnpm dlx` leaves nothing behind.
- **Codex.** Subjects and the judge run on `gpt-6-luna` through Codex. The runner uses the `codex` on `PATH`, or `--codex-path <path>`. The user must be logged in to Codex with a file-based login.
- **A normal shell.** Start the runner from a shell that is not itself inside an agent's sandbox. Inside a Codex sandbox the subjects' reads are blocked, so the runner refuses to start there; ask the user to run the command, or run it from an unsandboxed session.
- **Cost.** Each Run is one subject session (Luna, medium effort) plus one judge session (Luna, high effort) per Check that reaches a judge leaf. Start with `--runs 1`.

## Commands

```bash
# check scenario files without running anything
pnpm dlx file:<runner-dir> validate --repo <repo> --skill <skill-dir> [--scenario <id>]...

# run scenarios: one fresh subject per Run, in an isolated snapshot
pnpm dlx file:<runner-dir> run --repo <repo> --skill <skill-dir> [--scenario <id>]... \
  [--runs <n>] [--parallel <n>] [--rev working-tree|<git-rev>] [--out <dir>]

# lint a skill set (code rules; Jev cards when the engine exists)
pnpm dlx file:<runner-dir> lint --skill-set <dir> [--forbid <word>]...

# judge a done bar
pnpm dlx file:<runner-dir> done-bar --kind new-from-intent --repo <repo> --skill <skill-dir> [--head <rev>]
pnpm dlx file:<runner-dir> done-bar --kind fix-for-recorded-failure --repo <repo> --skill <skill-dir> \
  --scenario <id> --base <rev-before-fix> [--head <rev>]
```

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

A Run's verdict is `fail` when any Check failed, else `inconclusive` when any Check could not be settled, else `pass`. A later pass never hides an earlier fail. `execution-failed` means the subject never produced an observation: the agent did not start, timed out, was cancelled, or the model never ran. It says nothing about the skill; fix the cause and rerun.

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
