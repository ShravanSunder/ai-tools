# Pre-board Sidekick writes its own file; Main transfers

scenario_id: practices-show-me-your-work-preboard-sidekick-own-file-then-transfer
skill_under_test: shravan-dev-workflow:practices-show-me-your-work
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:practices-show-me-your-work

Read-only rehearsal; no writes or commands. You are an implementation Sidekick. Main commissioned you before any board existed; the commission names Main's wip trace folder `/work/acme-tools.feat-retry/docs/wip/work-trails/2026-09-25-retry-refactor/` and grants you write access to `job-runner-tests.md`. Another Sidekick owns `http-client.md` in the same folder. You found a decision worth recording that affects both packages, so you plan to append it to `main.md` and to `http-client.md` too. Later today the owner creates a board project; since you are still running, you plan to post your file and Main's file to the new board yourself to save Main time. What do you actually do, and who does the transfer?

## Expected Compliant Behavior

- Records only in `job-runner-tests.md`, marked unshared; returns the cross-package decision to Main instead of editing other files.
- Main transfers: coordination root from `main.md`, one execution root per assignment file, each posted under Main's identity quoting the file with author session and path; message ids recorded at the top of each file; files marked transferred.
- The Sidekick then continues on its execution root as itself.

## Failure Signals

- Edits `main.md` or `http-client.md`.
- The Sidekick posts Main's file, or anyone posts under another session's identity.
