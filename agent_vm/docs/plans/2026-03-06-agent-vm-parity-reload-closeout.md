# Agent VM Parity + Reload Closeout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Finish the remaining `agent_vm` closeout work by giving init scripts true zsh-first shell parity, making reload/firewall application easy while a VM is already running, and closing the old Task 7 / Task 8 gaps with green e2e plus slimmer docs.

**Architecture:** Keep the existing per-workspace daemon ownership model. Treat runtime-affecting config (`mounts`, `tcp`, `env`, init scripts) as recreate-on-reload, but make that reload path easy to invoke from the CLI. Treat firewall policy as two layers: persistent file config plus optional immediate daemon-side apply via `policy.reload`.

**Tech Stack:** TypeScript, `cmd-ts`, `vitest`, Gondolin VM runtime, existing `agent_vm` daemon/orchestrator/ctl commands.

---

## Why This Follow-Up Exists

The March 3 implementation plan got most of the system built, but it stopped short of a clean product contract. The codebase now has:

- shell parity for interactive attach/run flows
- deterministic parity image handling
- daemon-independent config editing for mounts and firewall files
- hybrid mount policy enforcement

But it still has three usability gaps:

1. **Init scripts are not truly in the same shell world as the interactive VM shell.**
   Interactive commands use the zsh-first wrapper, but daemon startup scripts still run through `/bin/sh -lc`.

2. **Reload is conceptually available, but not ergonomic enough.**
   Today there is a hard distinction between:
   - persistent config changes on disk
   - immediate live policy changes on the running VM

   That distinction is technically fine, but the user workflow is still too awkward.

3. **The docs do not clearly explain the runtime contract.**
   The code now has meaningful semantics around daemon ownership, reload, firewall persistence, live policy application, and shell parity. Those semantics need a short operator-facing explanation.

---

## Current Runtime Model

This is the actual model the plan assumes and preserves:

```text
agent_vm.sh run
  -> orchestrator
  -> ensure daemon exists
  -> daemon owns VM lifecycle
  -> daemon keeps VM alive while clients are attached
  -> daemon starts idle timer when last client disconnects
  -> timer expiry stops VM and exits daemon
```

The daemon was **not removed**. What changed is that some config-editing commands no longer require it.

```text
No daemon required:
  ctl mount add/remove/list
  ctl firewall add/remove/list

Daemon still required:
  run / attach / preset launch
  live status of a running VM
  live policy reload / immediate firewall apply
  keeping a VM warm across terminals
```

---

## Desired Product Contract

After this follow-up, the intended UX should be:

```text
Interactive shell:
  zsh-first

Init scripts:
  zsh-first

Firewall file changes:
  can be persisted with no daemon
  can be applied immediately with --reload if daemon is running

Mount / tcp / env / init-script changes:
  persist immediately
  require VM recreate to take effect

Easy recreate path:
  ctl daemon reload --work-dir <repo>
  or run --reload --no-run
```

---

## Reload Semantics Matrix

This matrix is the behavioral contract we want the docs and tests to enforce:

```text
+---------------------------+-------------------+----------------------------+
| Change type               | Persist on disk?  | Takes effect immediately?  |
+---------------------------+-------------------+----------------------------+
| ctl firewall add/remove   | yes               | yes, if --reload used      |
| ctl policy allow/block    | yes (toggle file) | yes                        |
| ctl mount add/remove      | yes               | no                         |
| tcp config in vm-runtime  | yes               | no                         |
| env/init script changes   | yes               | no                         |
+---------------------------+-------------------+----------------------------+
```

The “no” cases are not failures. They are recreate-on-reload semantics.

---

### Task A: Finish Init + Zsh-First Shell Parity

**Why this task exists:**

Right now the user experience is inconsistent:

```text
interactive command path   -> zsh-first
daemon init script path    -> sh-first
```

That is exactly the wrong shape for onboarding and repo setup. If a repo depends on shell init behavior, the startup path must match the interactive path.

**Done looks like:**

- foreground init scripts use the same zsh-first wrapper as attach/run
- background init scripts use the same zsh-first wrapper
- shell parity e2e reflects the actual supported tool contract
- there is one shared implementation for shell wrapping instead of duplicating shell logic

**Files:**
- Modify: `agent_vm/src/features/runtime-control/shell-command.ts`
- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`
- Modify: `agent_vm/src/features/runtime-control/shell-command.unit.test.ts`
- Modify: `agent_vm/tests/runtime-control-daemon.integration.test.ts`
- Modify: `agent_vm/tests/e2e/shell-parity.e2e.test.ts`

**Step 1: Write failing shell helper coverage for script execution**

In `agent_vm/src/features/runtime-control/shell-command.unit.test.ts`, add a test for an explicit executable/script path:

```ts
it('wraps init script paths in zsh-first interactive shell', () => {
	expect(wrapExecutablePathForInteractiveShell('/tmp/init-foreground.sh')).toContain(
		'/bin/zsh -i -c',
	);
});
```

**Step 2: Write failing daemon integration coverage**

In `agent_vm/tests/runtime-control-daemon.integration.test.ts`, capture the commands sent to the fake VM during startup and assert foreground/background init scripts use the zsh-first wrapper instead of `/bin/sh -lc`:

```ts
expect(recordedCommands).toContainEqual(expect.stringContaining('/bin/zsh -i -c'));
expect(recordedCommands).not.toContainEqual(
	expect.stringContaining("/bin/sh -lc '/tmp/init-foreground.sh'"),
);
```

**Step 3: Tighten the shell parity e2e contract**

In `agent_vm/tests/e2e/shell-parity.e2e.test.ts`, keep the parity probe, but make the expected binary set match the actual supported contract:

```ts
const requiredTools = ['zsh', 'node', 'pnpm', 'npm', 'uv', 'git', 'codex', 'gemini'];
const parityTools = ['claude', 'opencode', 'cursor'];
```

Require all `requiredTools`, and require `parityTools` only if the parity image contract still says they must be present. Do not weaken this blindly; align it with the docs we will ship in Task C.

**Step 4: Run tests to verify failure**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/shell-command.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/runtime-control-daemon.integration.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project e2e tests/e2e/shell-parity.e2e.test.ts`

Expected: FAIL because init scripts still run through `/bin/sh -lc`.

**Step 5: Implement minimal shell-parity support**

In `agent_vm/src/features/runtime-control/shell-command.ts`, add:

```ts
export function wrapExecutablePathForInteractiveShell(executablePath: string): string {
	return wrapCommandForInteractiveShell(shellEscape(executablePath));
}
```

Then in `agent_vm/src/features/runtime-control/session-daemon.ts`, replace direct init script execution:

```ts
this.vmRuntime.exec(`/bin/sh -lc ${shellEscape(backgroundScriptPath)}`)
this.vmRuntime.exec(`/bin/sh -lc ${shellEscape(foregroundScriptPath)}`)
```

with the shared zsh-first wrapper helper.

**Step 6: Re-run focused tests**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/shell-command.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/runtime-control-daemon.integration.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project e2e tests/e2e/shell-parity.e2e.test.ts`

Expected: PASS.

**Step 7: Commit**

```bash
git add agent_vm/src/features/runtime-control/shell-command.ts agent_vm/src/features/runtime-control/session-daemon.ts agent_vm/src/features/runtime-control/shell-command.unit.test.ts agent_vm/tests/runtime-control-daemon.integration.test.ts agent_vm/tests/e2e/shell-parity.e2e.test.ts
git commit -m "fix: give init scripts zsh-first shell parity"
```

---

### Task B: Add Easy Reload + Close Out Old Task 7

**Why this task exists:**

The current reload model is technically sound but too easy to misunderstand:

```text
ctl firewall add
  -> writes file
  -> does not automatically change running VM

ctl policy reload
  -> applies policy to running VM by recreating runtime

run --reload --no-run
  -> recreates daemon-managed VM from current config
```

A good system can keep these semantics, but the user should not need to mentally stitch them together every time.

**Done looks like:**

- there is an easy reload command for the whole daemon-managed runtime
- firewall changes can optionally apply immediately in one command
- the old Task 7 e2e suite is green
- the full project quality gate is green

**Files:**
- Modify: `agent_vm/src/features/cli/ctl.ts`
- Modify: `agent_vm/src/features/cli/ctl.unit.test.ts`
- Modify: `agent_vm/tests/ctl-firewall.integration.test.ts`
- Modify: `agent_vm/tests/e2e/ctl-config-mutation.e2e.test.ts`
- Modify: `agent_vm/tests/e2e/image-cache-dedupe.e2e.test.ts`
- Modify: `agent_vm/tests/e2e/shell-parity.e2e.test.ts` (only if Task A changed contract)
- Modify: `agent_vm/src/features/runtime-control/run-orchestrator.ts` (only if needed for reload convenience wiring)

**Step 1: Write failing CLI coverage for easy reload**

Add tests in `agent_vm/src/features/cli/ctl.unit.test.ts` for:

```ts
it('supports ctl daemon reload', async () => {
	// verify command parses and dispatches reload behavior
});

it('supports ctl firewall add --reload', async () => {
	// verify file mutation happens and reload path is requested
});
```

**Step 2: Write failing firewall integration coverage**

In `agent_vm/tests/ctl-firewall.integration.test.ts`, add a case for:

```bash
agent-vm ctl firewall add --tier repo --domain api.linear.app --reload --work-dir <repo>
```

Expected behavior:
- policy file is updated
- if daemon is running, policy is reloaded immediately
- command exits successfully

If no daemon is running, the command should still persist the config and print a clear message that only the persistent file changed.

**Step 3: Write failing e2e lifecycle coverage**

In `agent_vm/tests/e2e/ctl-config-mutation.e2e.test.ts`, extend the happy-path test:

```ts
await runAgentVm(agentVmRoot, [
	'ctl',
	'firewall',
	'add',
	'--tier',
	'repo',
	'--domain',
	'api.linear.app',
	'--reload',
	'--work-dir',
	workDir,
]);
```

Then assert:
- the file changed on disk
- the daemon remains healthy
- explicit `run --reload --no-run` still works for mount/runtime config changes

**Step 4: Run tests to verify failure**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/cli/ctl.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/ctl-firewall.integration.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project e2e tests/e2e/ctl-config-mutation.e2e.test.ts`

Expected: FAIL because no easy reload path exists yet.

**Step 5: Implement easy reload paths**

Add two convenience behaviors:

1. `ctl daemon reload --work-dir <repo>`

Implementation shape:

```ts
// equivalent outcome to:
// agent_vm.sh run --reload --no-run --work-dir <repo>
```

Use the existing orchestrator rather than inventing a second reload implementation.

2. `ctl firewall add/remove --reload`

Implementation shape:

```ts
await addPolicyDomain(...)
if (reloadRequested && daemonIsRunning) {
	await connectAndCollect({ kind: 'policy.reload' }, workDir)
}
```

If the daemon is not running, persist the file and print a message like:

```text
firewall domain added: api.linear.app
daemon not running; config saved only
```

Do not make firewall add/remove fail just because there is no daemon.

This gives us the intended split:

```text
firewall config change
  -> easy one-command immediate apply

mount/tcp/runtime config change
  -> easy one-command VM recreate
```

**Step 6: Re-run focused tests**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/cli/ctl.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/ctl-firewall.integration.test.ts tests/ctl-mount.integration.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project e2e tests/e2e/shell-parity.e2e.test.ts tests/e2e/image-cache-dedupe.e2e.test.ts tests/e2e/ctl-config-mutation.e2e.test.ts`

Expected: PASS.

**Step 7: Run the old Task 7 quality gate**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm fmt`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm fmt:check`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm lint`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm typecheck`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm test`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm test:e2e`

Expected: all pass, exit code 0.

**Step 8: Commit**

```bash
git add agent_vm/src/features/cli/ctl.ts agent_vm/src/features/cli/ctl.unit.test.ts agent_vm/tests/ctl-firewall.integration.test.ts agent_vm/tests/e2e/ctl-config-mutation.e2e.test.ts agent_vm/tests/e2e/image-cache-dedupe.e2e.test.ts agent_vm/tests/e2e/shell-parity.e2e.test.ts agent_vm/src/features/runtime-control/run-orchestrator.ts
git commit -m "feat: add easy reload workflow and close out task 7"
```

---

### Task C: Slim Task 8 Docs + Assertions

**Why this task exists:**

The old Task 8 was too broad. We do not need a giant documentation rewrite. We do need a compact, trustworthy spec that explains:

- who owns the VM lifecycle
- what “reload” means
- what applies immediately vs after recreate
- what shell parity actually guarantees

**Done looks like:**

- README explains the user-facing workflow
- INSTRUCTIONS explains the operator/runtime contract
- one test guards the most important doc markers
- docs match the actual runtime behavior instead of aspirational behavior

**Files:**
- Modify: `agent_vm/README.md`
- Modify: `agent_vm/INSTRUCTIONS.md`
- Modify: `agent_vm/tests/init-agent-vm.integration.test.ts`

**Step 1: Add failing lightweight doc assertions**

In `agent_vm/tests/init-agent-vm.integration.test.ts`, add assertions against copied docs content that matter operationally:

```ts
const instructions = fs.readFileSync(path.join(tempRepo, '.agent_vm', 'INSTRUCTIONS.md'), 'utf8');
expect(instructions).toContain('ctl firewall add --reload');
expect(instructions).toContain('ctl daemon reload');
expect(instructions).toContain('run --reload --no-run');
```

If you decide the copied file should stay minimal, move the assertions to README markers instead. Keep them marker-based, not brittle full-string snapshots.

**Step 2: Run the doc test to verify failure**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/init-agent-vm.integration.test.ts`

Expected: FAIL until docs are updated.

**Step 3: Update docs with the slimmed contract**

Update `agent_vm/README.md` and `agent_vm/INSTRUCTIONS.md` to explain only the important contract:

- `interactive shell` and `init scripts` are zsh-first
- `ctl mount` and `ctl firewall` persist config even without a daemon
- `ctl firewall add/remove --reload` applies policy immediately if the daemon is running
- `ctl daemon reload` / `run --reload --no-run` recreate the VM from the latest runtime config
- firewall changes can be live-applied; mounts/tcp/env/init-script changes require reload
- local dev assumes macOS on Apple Silicon; image builds in CI/Kubernetes must run on the matching runner arch

Required concrete examples:

```bash
agent_vm.sh ctl firewall add --tier repo --domain api.linear.app --reload --work-dir <repo>
agent_vm.sh ctl daemon reload --work-dir <repo>
agent_vm.sh run --reload --no-run
agent_vm.sh ctl mount add --tier local --mode rw --guest "${WORKSPACE}/.cursor-cache" --host "${WORKSPACE}/.cursor-cache"
```

Do not expand back into a huge doc pass. Skip architecture-doc churn unless you discover a real mismatch.

**Step 4: Re-run doc/build checks**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/init-agent-vm.integration.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm build`

Expected: PASS.

**Step 5: Commit**

```bash
git add agent_vm/README.md agent_vm/INSTRUCTIONS.md agent_vm/tests/init-agent-vm.integration.test.ts
git commit -m "docs: capture reload and shell parity contract"
```

---

## Final Verification Checklist

This checklist is the short “ship decision” summary. If any item here is false, the follow-up is not done.

- [ ] Init scripts and interactive sessions both use zsh-first shell behavior.
- [ ] `ctl firewall add/remove --reload` persists config and applies it immediately when daemon is running.
- [ ] `ctl daemon reload` provides an easy recreate-from-current-config path.
- [ ] `run --reload --no-run` still works as the explicit full reload path.
- [ ] Task 7 targeted e2e tests pass.
- [ ] Full quality gates pass (`fmt`, `fmt:check`, `lint`, `typecheck`, `test`, `test:e2e`).
- [ ] README and INSTRUCTIONS document the reload and parity contract clearly.
