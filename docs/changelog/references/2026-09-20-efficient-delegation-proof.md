# Efficient delegation validation evidence

## Evidence boundary

The change is based on accepted user-directed intent, not a reproduced behavioral failure. The owner deferred all model-behavior tests for cost. No live pressure subject, semantic judge, benchmark, Frontier trial, or production Router exercise ran. Source assertions, static checks, and any fake harness plumbing prove only structure and routing fixtures; actual model dispatch and instruction compliance remain unverified.

## Source coverage

The implementation updates the runtime selection owner, design-ready continuation, implementation-goal routing, directly affected scenarios, maintainer guidance, and workflow 2.18.0 metadata. Provider-specific native Codex, Claude, Cursor, ACPX, job-packet, and session-ledger references were inspected; no contrary provider encoding required edits. Independent source review returned `great` after remediation 1. That is the review disposition supplied to the implementer, not an independent reexecution by the implementer.

The canonical Router `agent-collaboration` tree at commit `d9b3431fe834d7cc839c63dfa1784f6b046f4b97` was copied byte-for-byte into `plugins/agent-router/skills/agent-collaboration/`, excluding the preserved vendor-only `agents/openai.yaml`. `plugin-sources.json` pins that exact commit, and the agent-router Codex/Claude manifests plus Claude marketplace entry advance together to 0.9.0. Workflow metadata remains 2.18.0.

## Validation

```sh
pnpm --dir tests/skills install --frozen-lockfile
pnpm --dir tests/skills run test:unit
pnpm --dir tests/skills run typecheck
uv run --no-project --with pyyaml python <quick_validate.py> <changed-skill>
claude plugin validate .
jq empty <changed plugin and marketplace manifests>
codex plugin list --marketplace ai-tools --available --json
diff -ru --exclude=agents <canonical-agent-collaboration> plugins/agent-router/skills/agent-collaboration
git diff --check
```

The authorized frozen install refreshed only the test package's ignored `node_modules` to locked Vitest 4.1.11 and changed no package or lock file. Results: `122/122` unit tests passed; TypeScript passed; official validators passed for `manage-agents`, `orchestrator-design`, and `orchestrator-implementation-goal` using isolated temporary PyYAML; Claude marketplace validation, JSON parsing, Codex local marketplace discovery of workflow 2.18.0, reference/scenario inventory, public-doc privacy, changelog-length, and diff checks passed. A focused deterministic parser run passed `9/9`, including both new forbidden-regex polarity cases: compliant negations remain allowed and explicit positive relay/supervisor violations still match. This proves fixture mechanics, not agent semantics.

Before the authorized dependency refresh, pnpm aborted because the existing modules held Vitest 4.1.10 and the custom `vitest-evals` reporter was absent. Those were environment setup failures before test execution, not failing assertions. No fake evaluator run was needed. Live model behavior remains owner-deferred and unverified.

Final source assessment removed a stale Composer Operator fallback from two directly touched fixtures; the unchanged runtime Operator catalog remains OpenAI Luna high only. Fresh focused parser proof passed `9/9`, all affected fixture regexes compiled, no Composer fallback remained, and `git diff --check` passed. No broader legacy fixture or runtime catalog change was made.

The persistent-resume guidance preserves stable identity/model/effort and no automatic switching while qualifying cache behavior as provider- and route-dependent: a model or effort change may reduce or invalidate reuse, but no hit or miss is claimed without actual evidence. Fresh `manage-agents` validation and diff checks passed; no adapter, API, configuration, or live-provider probe was added.

Final mechanical handoff proof: canonical and vendored quick validators passed; canonical/vendor byte comparison was empty outside preserved `agents/`; the preserved `openai.yaml` checksum was unchanged; all affected JSON parsed; Claude marketplace validation passed; Codex marketplace discovery reported workflow 2.18.0 and agent-router 0.9.0 available; version, link, privacy, changelog-length, and diff checks passed. These results are implementer static proof, not independent reexecution or live model behavior. No unit or model suite was repeated because no semantic source changed after the accepted review. No cache, home, or provider operation was performed.
