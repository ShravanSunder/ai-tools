# Agent VM Zsh/Shell Parity + Hybrid Mount/Firewall Controls Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver sidecar-equivalent shell/tooling behavior in `agent_vm` with a hybrid security model (readonly by default, explicit opt-in writable mounts), plus CLI/config workflows to add/change mounts and firewall policy safely.

**Architecture:** Keep daemon/session ownership and C+ cache model. Add parity in two tracks: (1) shell/runtime semantics (`zsh`-first, preset execution environment), and (2) layered image baseline with deterministic parity source hashing so Docker layer reuse stays effective and cache fingerprints stay stable. Add daemon-independent `ctl` config mutation commands for mounts/firewall while preserving existing daemon-backed fast policy toggles.

**Tech Stack:** TypeScript (`cmd-ts`, `zod`, `vitest`), Gondolin VM runtime, Docker/OrbStack local image builds, `execa`, existing `agent_vm` by-fingerprint cache.

---

### Task 1: Add Failing Coverage for Shell Parity and Config Resolution Semantics

**Files:**
- Create: `agent_vm/src/features/runtime-control/shell-command.unit.test.ts`
- Create: `agent_vm/src/build/parity-image.unit.test.ts`
- Create: `agent_vm/tests/e2e/shell-parity.e2e.test.ts`
- Modify: `agent_vm/src/features/runtime-control/build-config-loader.unit.test.ts`

**Step 1: Write failing unit test for shell command generation**

```ts
it('builds interactive command with zsh-first and sh fallback', () => {
  const command = buildInteractiveShellCommand('/workspace');
  expect(command).toContain('if [ -x /bin/zsh ]');
  expect(command).toContain('exec /bin/zsh -il');
  expect(command).toContain('exec /bin/sh -l');
});
```

**Step 2: Write failing unit test for preset wrapping behavior**

```ts
it('wraps preset command in zsh -i -c with fallback', () => {
  const wrapped = wrapCommandForInteractiveShell('codex --dangerously-bypass-approvals-and-sandbox resume --last');
  expect(wrapped).toContain('/bin/zsh -i -c');
  expect(wrapped).toContain('/bin/sh -lc');
});
```

**Step 3: Write failing unit test for dual overlay path resolution**

```ts
it('resolves base-layer ociOverlay paths from agent_vm root and project-layer paths from workspace', () => {
  const loaded = loadBuildConfig(workDir);
  expect(loaded.ociOverlay?.dockerfile).toMatch(/agent_vm\/config\/parity/u);
});
```

**Step 4: Write failing e2e parity probe without launching interactive agent sessions**

```ts
const probe = [
  'for t in zsh node pnpm npm uv git claude codex gemini opencode cursor; do',
  'command -v "$t" >/dev/null 2>&1 || { echo "missing:$t"; exit 1; };',
  'done',
  'echo shell_ok',
].join(' ');

const result = spawnSync(binPath, ['run', '--work-dir', workDir, '--run', probe], { encoding: 'utf8' });
expect(result.status).toBe(0);
expect(result.stdout).toContain('shell_ok');
```

**Step 5: Run tests to verify failures**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/shell-command.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/build-config-loader.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project e2e tests/e2e/shell-parity.e2e.test.ts`

Expected: FAIL on missing helper module, unresolved path rules, and missing toolchain.

**Step 6: Commit failing tests**

```bash
git add agent_vm/src/features/runtime-control/shell-command.unit.test.ts agent_vm/src/build/parity-image.unit.test.ts agent_vm/tests/e2e/shell-parity.e2e.test.ts agent_vm/src/features/runtime-control/build-config-loader.unit.test.ts
git commit -m "test: add failing shell parity and config resolution coverage"
```

---

### Task 2: Implement Zsh-First Shell Command Builder and Runtime Wiring

**Files:**
- Create: `agent_vm/src/features/runtime-control/shell-command.ts`
- Modify: `agent_vm/src/features/runtime-control/run-orchestrator.ts`
- Modify: `agent_vm/src/features/runtime-control/session-daemon.ts`
- Modify: `agent_vm/src/features/runtime-control/agent-launcher.ts`
- Create: `agent_vm/src/core/platform/shell-escape.ts`

**Step 1: Implement shared shell escaping helper to avoid duplication**

```ts
export function shellEscape(value: string): string {
  return `'${value.replaceAll("'", "'\"'\"'")}'`;
}
```

**Step 2: Implement shell command module**

```ts
export function buildInteractiveShellCommand(workDir: string): string {
  const escaped = shellEscape(workDir);
  return [
    `cd ${escaped}`,
    `if [ -x /bin/zsh ]; then exec /bin/zsh -il; fi`,
    `exec /bin/sh -l`,
  ].join(' && ');
}

export function wrapCommandForInteractiveShell(command: string): string {
  const escaped = shellEscape(command);
  return `if [ -x /bin/zsh ]; then exec /bin/zsh -i -c ${escaped}; fi; exec /bin/sh -lc ${escaped}`;
}
```

**Step 3: Wire interactive attach path in orchestrator**

- Replace hardcoded `/bin/sh -l` path with `buildInteractiveShellCommand(identity.workDir)`.

**Step 4: Wire daemon attach/preset execution paths**

- Wrap explicit attach commands with `wrapCommandForInteractiveShell(...)`.
- Keep daemon status/stream semantics unchanged.

**Step 5: Run tests**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/shell-command.unit.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/run-orchestrator.unit.test.ts tests/runtime-control-daemon.integration.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/features/runtime-control/shell-command.ts agent_vm/src/features/runtime-control/run-orchestrator.ts agent_vm/src/features/runtime-control/session-daemon.ts agent_vm/src/features/runtime-control/agent-launcher.ts agent_vm/src/core/platform/shell-escape.ts
git commit -m "feat: make shell execution zsh-first with safe fallback"
```

---

### Task 3: Implement Parity Image Strategy with Stable Fingerprint Inputs

**Files:**
- Create: `agent_vm/src/build/parity-image.ts`
- Modify: `agent_vm/src/features/runtime-control/build-config-loader.ts`
- Modify: `agent_vm/src/build/build-assets.ts`
- Modify: `agent_vm/config/build.base.json`
- Create: `agent_vm/config/parity/agent-vm-parity.overlay.dockerfile`
- Create: `agent_vm/config/parity/extra.base.zshrc`

**Step 1: Implement parity source hashing (not runtime digest hashing)**

```ts
export function computeParitySourceHash(paths: readonly string[]): string {
  // hash file contents (Dockerfile + referenced shell config + known build inputs)
  // return stable sha256 short hash
}
```

**Step 2: Implement parity base image ensure/build with explicit guardrails**

```ts
export async function ensureParityBaseImage(): Promise<{ imageTag: string; imageDigest: string; sourceHash: string }> {
  // verify sidecar Dockerfile exists first; if missing throw actionable error
  // docker image inspect agent-sidecar-base:node-py
  // if missing -> docker build -f agent_sidecar/node-py.base.dockerfile -t agent-sidecar-base:node-py agent_sidecar
  // inspect digest for runtime use/logging only
  // compute sourceHash from Dockerfile + required setup files
}
```

**Step 3: Update build config path resolution strategy explicitly**

- Base-layer `ociOverlay` paths resolve relative to `agent_vm` root.
- Project-layer `ociOverlay` paths resolve relative to workspace root.
- Add unit tests for both paths and mixed scenarios.

**Step 4: Wire parity inputs into `buildGuestAssets` fingerprint payload**

- Include `paritySourceHash` in fingerprint payload.
- Do **not** include ephemeral runtime image digest in fingerprint key.
- Keep digest available for logging/traceability.

**Step 5: Configure base overlay defaults**

Set base build defaults to parity overlay with stable local tag source:

```json
{
  "ociOverlay": {
    "baseImage": "agent-sidecar-base:node-py",
    "dockerfile": "config/parity/agent-vm-parity.overlay.dockerfile",
    "contextDir": "."
  }
}
```

**Step 6: Run tests + build**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm build`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/build/parity-image.unit.test.ts src/build/build-assets.unit.test.ts src/features/runtime-control/build-config-loader.unit.test.ts`

Expected: PASS.

**Step 7: Commit**

```bash
git add agent_vm/src/build/parity-image.ts agent_vm/src/features/runtime-control/build-config-loader.ts agent_vm/src/build/build-assets.ts agent_vm/config/build.base.json agent_vm/config/parity/agent-vm-parity.overlay.dockerfile agent_vm/config/parity/extra.base.zshrc
git commit -m "feat: add deterministic parity image strategy with stable fingerprint inputs"
```

---

### Task 4: Enforce Hybrid Mount Policy with Allowlist-Based Writable Boundaries

**Files:**
- Modify: `agent_vm/src/core/models/vm-runtime-config.ts`
- Modify: `agent_vm/src/features/runtime-control/vm-runtime-loader.ts`
- Create: `agent_vm/src/features/runtime-control/mount-policy.ts`
- Create: `agent_vm/src/features/runtime-control/mount-policy.unit.test.ts`
- Modify: `agent_vm/config/vm-runtime.base.json`
- Modify: `agent_vm/templates/.agent_vm/vm-runtime.repo.json`
- Modify: `agent_vm/schemas/vm-runtime.schema.json` (generated)

**Step 1: Add failing tests for allowlist enforcement**

```ts
it('rejects writable mount outside allowed prefixes', () => {
  expect(() => validateWritableMount('/etc/nginx', '/tmp/host', defaults)).toThrow(/outside writable allowlist/u);
});

it('permits writable mount under ${WORKSPACE} and /home/agent', () => {
  expect(() => validateWritableMount('${WORKSPACE}/.cache/foo', '${WORKSPACE}/.cache/foo', defaults)).not.toThrow();
});
```

**Step 2: Run tests to verify failure**

Run: `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/mount-policy.unit.test.ts`
Expected: FAIL because policy module/schema fields do not exist.

**Step 3: Add mount control schema**

```ts
mountControls: z.object({
  allowAuthWrite: z.boolean().default(false),
  writableAllowedGuestPrefixes: z.array(z.string().min(1)).default([
    '${WORKSPACE}',
    '/home/agent',
    '/tmp',
  ]),
})
```

**Step 4: Validate mount policy in runtime loader (not adapter)**

- After interpolation + merge, validate `readonlyMounts` and `extraMounts`.
- Enforce auth mounts readonly unless `allowAuthWrite === true`.
- Reject writable mounts outside allowlist prefixes.

**Step 5: Regenerate schema and run tests**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm build`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/mount-policy.unit.test.ts src/features/runtime-control/vm-runtime-loader.unit.test.ts src/core/infrastructure/vm-adapter.unit.test.ts`

Expected: PASS.

**Step 6: Commit**

```bash
git add agent_vm/src/core/models/vm-runtime-config.ts agent_vm/src/features/runtime-control/vm-runtime-loader.ts agent_vm/src/features/runtime-control/mount-policy.ts agent_vm/src/features/runtime-control/mount-policy.unit.test.ts agent_vm/config/vm-runtime.base.json agent_vm/templates/.agent_vm/vm-runtime.repo.json agent_vm/schemas/vm-runtime.schema.json
git commit -m "feat: enforce hybrid mount policy with writable allowlist boundaries"
```

---

### Task 5: Add Daemon-Independent Persistent Mount Commands (`ctl mount ...`)

**Files:**
- Modify: `agent_vm/src/features/cli/ctl.ts`
- Create: `agent_vm/src/features/runtime-control/runtime-config-editor.ts`
- Create: `agent_vm/src/features/runtime-control/runtime-config-editor.unit.test.ts`
- Modify: `agent_vm/src/features/cli/ctl.unit.test.ts`
- Create: `agent_vm/tests/ctl-mount.integration.test.ts`

**Step 1: Write failing tests for config mutation without daemon socket**

```ts
it('ctl mount add works when daemon is not running', async () => {
  await runCtlCli(['mount', 'add', '--tier', 'local', '--mode', 'ro', '--guest', '/home/agent/.cursor', '--host', '${HOST_HOME}/.cursor', '--work-dir', workDir]);
  const json = JSON.parse(fs.readFileSync(localRuntimePath, 'utf8'));
  expect(json.readonlyMounts['/home/agent/.cursor']).toBe('${HOST_HOME}/.cursor');
});
```

**Step 2: Add failing concurrency test for editor locking**

```ts
it('serializes concurrent writes with file lock', async () => {
  await Promise.all([addMountA(), addMountB()]);
  const json = JSON.parse(fs.readFileSync(localRuntimePath, 'utf8'));
  expect(json.readonlyMounts['/home/agent/.a']).toBeDefined();
  expect(json.readonlyMounts['/home/agent/.b']).toBeDefined();
});
```

**Step 3: Run tests to verify failure**

Run: `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/cli/ctl.unit.test.ts src/features/runtime-control/runtime-config-editor.unit.test.ts tests/ctl-mount.integration.test.ts`
Expected: FAIL because command/editor/locking does not exist.

**Step 4: Implement editor with explicit lock**

```ts
export async function upsertMountEntry(args: UpsertMountEntryArgs): Promise<void> {
	await withFileLockAsync(lockPathForConfig(configPath), async () => {
		// for mode=rw, call validateWritableMount(...) before mutating file
		// reject immediately if guest path is outside writable allowlist
		// read or initialize JSON
		// mode=ro -> readonlyMounts[guest]=host; delete extraMounts[guest]
		// mode=rw -> extraMounts[guest]=host; delete readonlyMounts[guest]
		// stable write
	});
}
```

**Step 5: Add `ctl mount` command group (direct file ops)**

- `ctl mount add --tier repo|local --mode ro|rw --guest ... --host ... --work-dir ...`
- `ctl mount remove --tier repo|local --guest ... --work-dir ...`
- `ctl mount list --source repo|local|merged --work-dir ...`

No daemon required for add/remove/list.

**Step 6: Run tests**

Run: `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/cli/ctl.unit.test.ts src/features/runtime-control/runtime-config-editor.unit.test.ts tests/ctl-mount.integration.test.ts`
Expected: PASS.

**Step 7: Commit**

```bash
git add agent_vm/src/features/cli/ctl.ts agent_vm/src/features/runtime-control/runtime-config-editor.ts agent_vm/src/features/runtime-control/runtime-config-editor.unit.test.ts agent_vm/src/features/cli/ctl.unit.test.ts agent_vm/tests/ctl-mount.integration.test.ts
git commit -m "feat: add daemon-independent persistent mount management commands"
```

---

### Task 6: Add Daemon-Independent Persistent Firewall Commands (`ctl firewall ...`) and Keep Fast Toggles

**Files:**
- Modify: `agent_vm/src/features/cli/ctl.ts`
- Create: `agent_vm/src/features/runtime-control/policy-config-editor.ts`
- Create: `agent_vm/src/features/runtime-control/policy-config-editor.unit.test.ts`
- Modify: `agent_vm/src/features/runtime-control/policy-manager.ts`
- Modify: `agent_vm/src/features/cli/ctl.unit.test.ts`
- Create: `agent_vm/tests/ctl-firewall.integration.test.ts`

**Step 1: Write failing tests for persistent firewall file edits**

```ts
it('adds domain to policy-allowlist-extra.repo.txt', async () => {
  await runCtlCli(['firewall', 'add', '--tier', 'repo', '--domain', 'api.linear.app', '--work-dir', workDir]);
  expect(fs.readFileSync(repoPolicyPath, 'utf8')).toContain('api.linear.app');
});

it('lists merged policy sources without daemon', async () => {
  const output = await captureStdout(() => runCtlCli(['firewall', 'list', '--source', 'merged', '--work-dir', workDir]));
  expect(output).toContain('api.openai.com');
});
```

**Step 2: Add failing lock/concurrency editor test**

```ts
it('does not clobber concurrent add operations', async () => {
  await Promise.all([addDomain('a.example.com'), addDomain('b.example.com')]);
  const lines = fs.readFileSync(repoPolicyPath, 'utf8');
  expect(lines).toContain('a.example.com');
  expect(lines).toContain('b.example.com');
});
```

**Step 3: Run tests to verify failure**

Run: `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/policy-config-editor.unit.test.ts src/features/cli/ctl.unit.test.ts tests/ctl-firewall.integration.test.ts`
Expected: FAIL because `ctl firewall` and editor module do not exist.

**Step 4: Implement policy editor with locks**

```ts
export async function addPolicyDomain(opts: AddPolicyDomainArgs): Promise<void> {}
export async function removePolicyDomain(opts: RemovePolicyDomainArgs): Promise<void> {}
export function listPolicyDomains(opts: ListPolicyDomainsArgs): string[] {}
```

Use `withFileLockAsync` on target policy file lock path.

**Step 5: Add `ctl firewall` command group**

- `ctl firewall add --tier repo|local --domain ... --work-dir ...`
- `ctl firewall remove --tier repo|local --domain ... --work-dir ...`
- `ctl firewall list --source base|repo|local|toggles|merged --work-dir ...`

Keep existing daemon-backed `ctl policy allow|block|clear|reload` unchanged for immediate runtime toggles.

**Step 6: Run tests**

Run: `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run src/features/runtime-control/policy-config-editor.unit.test.ts src/features/cli/ctl.unit.test.ts tests/ctl-firewall.integration.test.ts src/features/runtime-control/policy-manager.unit.test.ts`
Expected: PASS.

**Step 7: Commit**

```bash
git add agent_vm/src/features/cli/ctl.ts agent_vm/src/features/runtime-control/policy-config-editor.ts agent_vm/src/features/runtime-control/policy-config-editor.unit.test.ts agent_vm/src/features/runtime-control/policy-manager.ts agent_vm/src/features/cli/ctl.unit.test.ts agent_vm/tests/ctl-firewall.integration.test.ts
git commit -m "feat: add persistent firewall config commands while preserving runtime toggles"
```

---

### Task 7: End-to-End Validation for Parity + Hybrid Controls + Cache Reuse

**Files:**
- Modify: `agent_vm/tests/e2e/shell-parity.e2e.test.ts`
- Modify: `agent_vm/tests/e2e/image-cache-dedupe.e2e.test.ts`
- Create: `agent_vm/tests/e2e/ctl-config-mutation.e2e.test.ts`

**Step 1: Add failing e2e for parity cache reuse under stable source hash**

```ts
it('reuses by-fingerprint image path across two repos with same parity source inputs', async () => {
  expect(first.imagePath).toBe(second.imagePath);
});
```

**Step 2: Add failing e2e for ctl mount/firewall mutation lifecycle**

```ts
it('persists mount and firewall config changes then applies via reload', async () => {
  // ctl mount add
  // ctl firewall add
  // assert files changed
  // run agent_vm.sh run --reload --no-run
  // assert ctl status returns healthy session
});
```

**Step 3: Add failing negative e2e for disallowed writable mount**

```ts
it('rejects writable mount outside allowed guest prefixes', async () => {
  const result = spawnSync(binPath, ['ctl', 'mount', 'add', '--tier', 'local', '--mode', 'rw', '--guest', '/etc', '--host', '/tmp', '--work-dir', workDir], { encoding: 'utf8' });
  expect(result.status).not.toBe(0);
  expect(result.stderr).toMatch(/outside writable allowlist/u);
});
```

**Step 4: Run e2e tests to verify failure before final fixes**

Run: `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run --project e2e tests/e2e/shell-parity.e2e.test.ts tests/e2e/image-cache-dedupe.e2e.test.ts tests/e2e/ctl-config-mutation.e2e.test.ts`
Expected: FAIL until all prior tasks are complete.

**Step 5: Finalize e2e fixes and run full quality gate**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm fmt`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm fmt:check`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm lint`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm typecheck`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm test`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm test:e2e`

Expected: all pass, exit code 0.

**Step 6: Commit**

```bash
git add agent_vm/tests/e2e/shell-parity.e2e.test.ts agent_vm/tests/e2e/image-cache-dedupe.e2e.test.ts agent_vm/tests/e2e/ctl-config-mutation.e2e.test.ts
git commit -m "test: validate shell parity, hybrid controls, and cache reuse end-to-end"
```

---

### Task 8: Documentation Updates for New CLI and Security Model

**Files:**
- Modify: `agent_vm/README.md`
- Modify: `agent_vm/INSTRUCTIONS.md`
- Modify: `agent_vm/docs/architecture/agent-vm-architecture.md`
- Modify: `agent_vm/tests/init-agent-vm.integration.test.ts`

**Step 1: Add failing integration/doc assertions based on section markers (not brittle exact strings)**

```ts
expect(readme).toContain('## Hybrid Mount Model');
expect(readme).toContain('## Firewall Control (Config + Runtime Toggles)');
expect(readme).toContain('## Shell Parity Guarantees');
```

**Step 2: Run test to verify failure**

Run: `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run tests/init-agent-vm.integration.test.ts`
Expected: FAIL until docs include new sections.

**Step 3: Update docs with concrete workflows**

Required examples:
- `agent_vm.sh ctl mount add --tier local --mode rw --guest "${WORKSPACE}/.cursor-cache" --host "${WORKSPACE}/.cursor-cache"`
- `agent_vm.sh ctl mount list --source merged`
- `agent_vm.sh ctl firewall add --tier repo --domain api.linear.app`
- `agent_vm.sh ctl firewall list --source merged`
- `agent_vm.sh ctl policy allow --target linear --work-dir <repo>` (runtime toggle path)

**Step 4: Re-run tests and final build checks**

Run:
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm exec vitest run tests/init-agent-vm.integration.test.ts`
- `pnpm --dir /Users/shravansunder/dev/ai-tools/agent_vm build`

Expected: PASS.

**Step 5: Commit**

```bash
git add agent_vm/README.md agent_vm/INSTRUCTIONS.md agent_vm/docs/architecture/agent-vm-architecture.md agent_vm/tests/init-agent-vm.integration.test.ts
git commit -m "docs: document hybrid mount model and firewall control workflows"
```

---

## Final Verification Checklist (Definition of Done)

- [ ] `agent_vm.sh run` provides zsh-first interactive shell semantics.
- [ ] Preset launch and command execution paths are wrapped in zsh-first shell behavior.
- [ ] Toolchain parity probe passes for required binaries.
- [ ] Parity image strategy uses deterministic source hash inputs for fingerprint stability.
- [ ] By-fingerprint cache dedupe still reuses identical-input image paths across repos.
- [ ] Hybrid mount model enforced with writable allowlist and readonly-default auth behavior.
- [ ] `ctl mount` supports daemon-independent add/remove/list with file locks.
- [ ] `ctl firewall` supports daemon-independent add/remove/list with file locks.
- [ ] Existing `ctl policy` runtime toggles still work for immediate daemon-side policy updates.
- [ ] Full quality gates pass (`fmt`, `fmt:check`, `lint`, `typecheck`, `test`, `test:e2e`) with exit code 0.
