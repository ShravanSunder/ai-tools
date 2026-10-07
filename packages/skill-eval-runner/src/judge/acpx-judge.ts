import { join } from "node:path";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import {
  type AcpRuntimeEvent,
  createAcpRuntime,
  createAgentRegistry,
  createFileSessionStore,
} from "npm:acpx@0.19.4/runtime";
import {
  type JudgeVerdict,
  judgeVerdictSchema,
} from "../contracts/judge-verdict.ts";
import type { PreparedEnvironment } from "../environment/prepare-environment.ts";
import { buildJudgePrompt } from "./judge-prompt.ts";
import type { JudgeInput, JudgePort } from "./judge-port.ts";
export class AcpxJudge implements JudgePort {
  constructor(private readonly environment: PreparedEnvironment) {}
  async judge(
    input: JudgeInput,
  ): Promise<JudgeVerdict | { kind: "malformed" }> {
    const root = await mkdtemp(join(tmpdir(), "skill-eval-judge-"));
    await mkdir(join(root, "empty"));
    const state = await mkdtemp(join(tmpdir(), "skill-eval-judge-state-"));
    const runtime = createAcpRuntime({
      cwd: root,
      agentProcessEnv: {
        ...this.environment.agentEnv,
        CODEX_CONFIG: JSON.stringify({
          model: "gpt-6-luna",
          model_reasoning_effort: "high",
          approvals_reviewer: "user",
          features: { hooks: false, remote_plugin: false },
        }),
      },
      sessionStore: createFileSessionStore({ stateDir: state }),
      agentRegistry: createAgentRegistry({
        overrides: { "codex-judge": ["node", this.environment.codexAcpBin] },
      }),
      permissionMode: "deny-all",
      nonInteractivePermissions: "deny",
      timeoutMs: 120000,
    });
    try {
      const handle = await runtime.ensureSession({
        sessionKey: crypto.randomUUID(),
        agent: "codex-judge",
        mode: "oneshot",
        cwd: root,
      });
      const turn = runtime.startTurn({
        handle,
        text: buildJudgePrompt(input),
        mode: "prompt",
        requestId: crypto.randomUUID(),
        timeoutMs: 120000,
        onPermissionRequest: () => Promise.resolve({ outcome: "reject_once" }),
      });
      let text = "";
      for await (const event of turn.events) {
        const typed = event as AcpRuntimeEvent;
        if (typed.type === "text_delta" && typed.stream !== "thought") {
          text += typed.text;
        }
      }
      const result = await turn.result;
      if (result.status !== "completed") return { kind: "malformed" };
      try {
        const parsed: unknown = JSON.parse(text.trim());
        const verdict = judgeVerdictSchema.safeParse(parsed);
        return verdict.success ? verdict.data : { kind: "malformed" };
      } catch {
        return { kind: "malformed" };
      }
    } finally {
      await runtime.shutdown().catch(() => undefined);
      await Deno.remove(root, { recursive: true }).catch(() => undefined);
      await Deno.remove(state, { recursive: true }).catch(() => undefined);
    }
  }
}
