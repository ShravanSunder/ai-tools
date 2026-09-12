# Operator omitted a required PATH component

- Observed: 2026-09-11
- Status: captured
- Skill/workflow: manage-agents 2.10.0 / native Luna Operator
- Task context: one stock VM reproduction for agent-vm PR #227.
- Expected behavior: execute the supplied command unchanged, including `/bin` in PATH, and report the actual invocation.
- Observed behavior: the invocation omitted `/bin`. Image preparation failed with `spawnSync sh ENOENT`, initially reported as a local builder failure. The operator confirmed the omission when asked for its exact command. No source or SDK change was made.
- Evidence: assignment `2026-09-11-ci-vm-reproduction`; `tmp/onboarding-proof/ci-vm-reproduction.log`; operator follow-up explicitly confirmed missing `/bin`; the parent spawned `sh` successfully under the supplied complete PATH.
- Recurrence: one confirmed PATH omission here; related invocation-fidelity failures are recorded in `2026-09-08-operator-wrong-worktree.md`. Do not infer additional PATH failures.
- Impact: invalid first reproduction, unnecessary failed staging output and extra diagnosis. The exact unused staging directory was moved to Trash; reusable caches were retained.
- Suspected cause: command reconstruction instead of preserving the packet; no runtime or SDK defect established.
- Follow-up: corrected invocation includes a shell-visibility preflight and the exact PATH. Outcome pending; no skill edits authorized.
