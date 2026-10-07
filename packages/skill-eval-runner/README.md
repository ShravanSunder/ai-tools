# skill-eval-runner

`skill-eval-runner` validates and runs the new scenario format beside any skill package.

```sh
pnpm --config.dlx-cache-max-age=0 dlx file:/path/to/skill-eval-runner validate --repo /path/to/repo --skill path/to/skill
pnpm --config.dlx-cache-max-age=0 dlx file:/path/to/skill-eval-runner run --repo /path/to/repo --skill path/to/skill --scenario scenario-id
pnpm --config.dlx-cache-max-age=0 dlx file:/path/to/skill-eval-runner lint --skill-set /path/to/skills --forbid shravan-dev-workflow
pnpm --config.dlx-cache-max-age=0 dlx file:/path/to/skill-eval-runner done-bar --repo /path/to/repo --skill path/to/skill --kind new-from-intent
```

`--config.dlx-cache-max-age=0` makes `pnpm dlx` install the current folder each time; without it pnpm reuses its first copy of a local folder for a day. Run and done-bar require a normal unsandboxed shell. The shell must have an installed `codex` on `PATH` (or `--codex-path`) and a file-based login at `$CODEX_HOME/auth.json`. Results default to `${XDG_CACHE_HOME:-$HOME/.cache}/skill-evals/`; use `--out` to choose another directory. Exit 0 means the requested run or bar passed, exit 1 means a run/bar failed or was not evaluable, and exit 2 means invalid input or an unsuitable environment.
