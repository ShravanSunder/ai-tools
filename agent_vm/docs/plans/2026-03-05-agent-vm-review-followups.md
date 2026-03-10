# Agent VM Review Follow-Ups Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close the remaining post-review gaps in `agent_vm`: reject mount configs that the VM would silently ignore, generate portable schema references during `init`, and make repo init scripts inherit the same zsh-first shell environment as interactive sessions.

**Architecture:** Keep the current Apple Silicon local-dev assumption and current parity image strategy. Tighten config correctness at the loader/editor layer instead of relying on the VM adapter to skip invalid mounts, move `$schema` generation into `init` so external repos get correct references, and route init scripts through the same shell wrapper used by interactive attach/run paths.

**Tech Stack:** TypeScript, `cmd-ts`, `zod`, `vitest`, existing `agent_vm` CLI/integration test harness, Gondolin VM runtime.

---

### Task 1: Reject Host Mount Paths That The VM Would Silently Ignore

**Files:**
- Modify: `agent_vm/src/features/runtime-control/runtime-config-editor.ts`
- Modify: `agent_vm/src/features/runtime-control/mount-policy.ts`
- Modify: `agent_vm/src/features/runtime-control/vm-runtime-loader.ts`
- Modify: `agent_vm/src/features/runtime-control/runtime-config-editor.unit.test.ts`
- Modify: `agent_vm/src/features/runtime-control/vm-runtime-loader.unit.test.ts`
- Modify: `agent_vm/tests/ctl-mount.integration.test.ts`

**Step 1: Add failing editor-level coverage for invalid host paths**

Add a unit test in `agent_vm/src/features/runtime-control/runtime-config-editor.unit.test.ts` that proves `upsertMountEntry(...)` rejects host paths that remain relative after interpolation:

```ts
it('rejects host mount paths that are not absolute after interpolation', async () => {
  await expect(
    upsertMountEntry({
      workDir,
      tier: 'local',
      mode: 'rw',
      guestPath: '${WORKSPACE}/cache',
      hostPath: './cache',
    }),
  ).rejects.toThrow(/absolute host path/u);
});
```

**Step 2: Add failing merged-config coverage**

Add a unit test in `agent_vm/src/features/runtime-control/vm-runtime-loader.unit.test.ts` that writes a `vm-runtime.local.json` with an invalid host path and verifies `loadVmRuntimeConfig(workDir)` throws instead of letting the adapter skip it later:

```ts
it('rejects extraMount host paths that resolve to relative paths', () => {
  writeJson(path.join(configDir, 'vm-runtime.local.json'), {
    extraMounts: {
      '${WORKSPACE}/cache': './cache',
    },
  });

  expect(() => loadVmRuntimeConfig(workDir)).toThrow(/absolute host path/u);
});
```

**Step 3: Add failing CLI integration coverage**

Extend `agent_vm/tests/ctl-mount.integration.test.ts` with a case that runs:

```bash
agent-vm ctl mount add --tier local --mode rw --guest '${WORKSPACE}/cache' --host ./cache
```

and expects a non-zero exit plus a clear error message about the host path needing to resolve to an absolute path.

**Step 4: Implement minimal validation**

In `agent_vm/src/features/runtime-control/mount-policy.ts`, add a helper that validates interpolated host mount paths:

```ts
export function validateResolvedHostMountPath(hostPath: string): string {
  if (!path.isAbsolute(hostPath)) {
    throw new Error(`Mount host path '${hostPath}' must resolve to an absolute host path.`);
  }
  return normalizeHostPath(hostPath);
}
```

Use it from:
- `runtime-config-editor.ts` before persisting new mount entries
- `vm-runtime-loader.ts` after interpolation so hand-edited config files are also validated

Do not add new path-creation behavior in this task. The goal is to fail fast and loudly, not to expand mount semantics.

**Step 5: Run focused tests**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/runtime-config-editor.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/vm-runtime-loader.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/ctl-mount.integration.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/features/runtime-control/runtime-config-editor.ts agent_vm/src/features/runtime-control/mount-policy.ts agent_vm/src/features/runtime-control/vm-runtime-loader.ts agent_vm/src/features/runtime-control/runtime-config-editor.unit.test.ts agent_vm/src/features/runtime-control/vm-runtime-loader.unit.test.ts agent_vm/tests/ctl-mount.integration.test.ts
git commit -m "fix: reject invalid host mount paths before runtime"
```

---

### Task 2: Generate Portable Schema References During `agent-vm init`

**Files:**
- Modify: `agent_vm/src/features/repo-init/init-agent-vm.ts`
- Modify: `agent_vm/tests/init-agent-vm.integration.test.ts`
- Modify: `agent_vm/templates/.agent_vm/build.project.json`
- Modify: `agent_vm/templates/.agent_vm/vm-runtime.repo.json`

**Step 1: Add failing integration coverage for external repos**

Extend `agent_vm/tests/init-agent-vm.integration.test.ts` so it computes the expected schema path relative to the target repo’s `.agent_vm/` directory and asserts the generated files use that path:

```ts
const schemaDir = path.join(getAgentVmRoot(), 'schemas');
const expectedBuildSchema = path.relative(
  path.join(tempRepo, '.agent_vm'),
  path.join(schemaDir, 'build-config.schema.json'),
);
const expectedRuntimeSchema = path.relative(
  path.join(tempRepo, '.agent_vm'),
  path.join(schemaDir, 'vm-runtime.schema.json'),
);

expect(readJson(path.join(tempRepo, '.agent_vm', 'build.project.json')).$schema).toBe(expectedBuildSchema);
expect(readJson(path.join(tempRepo, '.agent_vm', 'vm-runtime.repo.json')).$schema).toBe(expectedRuntimeSchema);
expect(readJson(path.join(tempRepo, '.agent_vm', 'vm-runtime.local.json')).$schema).toBe(expectedRuntimeSchema);
```

**Step 2: Run test to verify failure**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/init-agent-vm.integration.test.ts`

Expected: FAIL because the generated files still contain hardcoded `../../agent_vm/...` paths.

**Step 3: Implement schema-path injection at init time**

In `agent_vm/src/features/repo-init/init-agent-vm.ts`:
- add a helper that computes schema references relative to the target `.agent_vm` directory
- rewrite `$schema` in:
  - `build.project.json`
  - `vm-runtime.repo.json`
  - generated `vm-runtime.local.json`

Use this shape:

```ts
function resolveSchemaRef(targetRoot: string, schemaFilename: string): string {
  return path.relative(targetRoot, path.join(getAgentVmRoot(), 'schemas', schemaFilename));
}
```

and a small JSON rewrite helper instead of relying on template literals alone.

**Step 4: Minimize template drift**

Update the repo templates so they no longer pretend the hardcoded path is universally correct. Keep them simple because init-time rewrite is now the source of truth.

**Step 5: Run focused tests**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/init-agent-vm.integration.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/features/repo-init/init-agent-vm.ts agent_vm/tests/init-agent-vm.integration.test.ts agent_vm/templates/.agent_vm/build.project.json agent_vm/templates/.agent_vm/vm-runtime.repo.json
git commit -m "fix: generate portable schema paths during init"
```

---

### Task 3: Make Init Scripts Use The Same Zsh-First Shell Wrapper

**Files:**
- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`
- Modify: `agent_vm/src/features/runtime-control/shell-command.ts`
- Modify: `agent_vm/src/features/runtime-control/shell-command.unit.test.ts`
- Modify: `agent_vm/tests/runtime-control-daemon.integration.test.ts`

**Step 1: Add failing daemon coverage**

Extend `agent_vm/tests/runtime-control-daemon.integration.test.ts` with a case that configures foreground and background init scripts, captures the fake VM `exec(...)` commands, and asserts the daemon uses zsh-first wrapping for script execution:

```ts
expect(recordedCommands).toContainEqual(
  expect.stringContaining('/bin/zsh -i -c'),
);
expect(recordedCommands).not.toContainEqual(
  expect.stringContaining("/bin/sh -lc '/tmp/init-foreground.sh'"),
);
```

**Step 2: Add failing shell helper coverage**

Add a unit test in `agent_vm/src/features/runtime-control/shell-command.unit.test.ts` for script-path execution:

```ts
it('wraps init script execution in zsh-first interactive shell', () => {
  expect(wrapCommandForInteractiveShell('/tmp/init script.sh')).toContain('/bin/zsh -i -c');
});
```

**Step 3: Run tests to verify failure**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/shell-command.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/runtime-control-daemon.integration.test.ts`

Expected: FAIL because init scripts still run via `/bin/sh -lc`.

**Step 4: Implement minimal runtime change**

In `agent_vm/src/features/runtime-control/session-daemon.ts`, replace direct `/bin/sh -lc ${shellEscape(scriptPath)}` execution for foreground/background init scripts with the shared wrapper:

```ts
const wrappedScriptCommand = wrapCommandForInteractiveShell(shellEscape(scriptPath));
```

If this becomes awkward because of double-escaping, add a tiny helper in `shell-command.ts` instead:

```ts
export function wrapExecutablePathForInteractiveShell(executablePath: string): string {
  return wrapCommandForInteractiveShell(shellEscape(executablePath));
}
```

Keep the rest of daemon lifecycle behavior unchanged.

**Step 5: Run focused tests**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/shell-command.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project integration tests/runtime-control-daemon.integration.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/features/runtime-control/session-daemon.ts agent_vm/src/features/runtime-control/shell-command.ts agent_vm/src/features/runtime-control/shell-command.unit.test.ts agent_vm/tests/runtime-control-daemon.integration.test.ts
git commit -m "fix: give init scripts zsh shell parity"
```

---

### Task 4: Document The Contract And Run Final Regression

**Files:**
- Modify: `agent_vm/INSTRUCTIONS.md`
- Modify: `agent_vm/tests/e2e/shell-parity.e2e.test.ts`
- Modify: `agent_vm/tests/e2e/ctl-config-mutation.e2e.test.ts`
- Modify: `agent_vm/tests/e2e/image-cache-dedupe.e2e.test.ts`

**Step 1: Tighten docs around the actual contract**

Update `agent_vm/INSTRUCTIONS.md` so it explicitly states:
- local development assumption is macOS on Apple Silicon
- CI/Kubernetes image builds must run on an architecture-appropriate runner
- mount host paths must resolve to absolute host paths after interpolation
- init scripts and interactive sessions both use zsh-first shell parity

Keep this short and operational.

**Step 2: Review the e2e expectations**

Re-check the three e2e tests and adjust only if they are asserting behavior that no longer matches the intended contract. In particular:
- `shell-parity.e2e.test.ts` should validate CLI presence only for tools the parity image actually installs
- `ctl-config-mutation.e2e.test.ts` should keep the mount/firewall mutation round-trip
- `image-cache-dedupe.e2e.test.ts` should keep the by-fingerprint dedupe assertion

Do not weaken the assertions just to get green tests; update them only if the current expectation is outside the documented product contract.

**Step 3: Run build + targeted regression**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm build`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm test`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project e2e tests/e2e/shell-parity.e2e.test.ts tests/e2e/image-cache-dedupe.e2e.test.ts tests/e2e/ctl-config-mutation.e2e.test.ts`

Expected:
- build: PASS
- unit/integration: PASS
- targeted e2e: PASS

**Step 4: Commit**

```bash
git add agent_vm/INSTRUCTIONS.md agent_vm/tests/e2e/shell-parity.e2e.test.ts agent_vm/tests/e2e/ctl-config-mutation.e2e.test.ts agent_vm/tests/e2e/image-cache-dedupe.e2e.test.ts
git commit -m "docs: align agent vm contract and regression coverage"
```

