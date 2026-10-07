import { join } from "node:path";
import { mkdtemp, symlink } from "node:fs/promises";
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
import { normalizeAssistantMessage } from "../runtime/normalize-acp-events.ts";
export class AcpxJudge implements JudgePort {
  constructor(private readonly environment: PreparedEnvironment) {}
  async judge(
    input: JudgeInput,
  ): Promise<JudgeVerdict | { kind: "malformed"; raw: string }> {
    const root = await mkdtemp(join(tmpdir(), "skill-eval-judge-"));
    const cwd = await mkdtemp(join(tmpdir(), "skill-eval-judge-cwd-"));
    const homeDir = await mkdtemp(join(tmpdir(), "skill-eval-judge-home-"));
    const codexHome = await mkdtemp(
      join(tmpdir(), "skill-eval-judge-codex-home-"),
    );
    await symlink(this.environment.authPath, join(codexHome, "auth.json"));
    const state = await mkdtemp(join(tmpdir(), "skill-eval-judge-state-"));
    const runtime = createAcpRuntime({
      cwd,
      agentProcessEnv: {
        ...this.environment.agentEnv,
        HOME: homeDir,
        CODEX_HOME: codexHome,
        CODEX_CONFIG: JSON.stringify({
          model: "gpt-6-luna",
          model_reasoning_effort: "high",
          approvals_reviewer: "user",
          features: { hooks: false, remote_plugin: false, memories: false },
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
        cwd,
      });
      const turn = runtime.startTurn({
        handle,
        text: buildJudgePrompt(input),
        mode: "prompt",
        requestId: crypto.randomUUID(),
        timeoutMs: 120000,
        onPermissionRequest: () => Promise.resolve({ outcome: "reject_once" }),
      });
      const events: AcpRuntimeEvent[] = [];
      for await (const event of turn.events) {
        const typed = event as AcpRuntimeEvent;
        if (typed.type === "text_delta" && typed.stream !== "thought") {
          events.push(typed);
        }
      }
      const result = await turn.result;
      const rawReply = normalizeAssistantMessage(events);
      if (result.status !== "completed") {
        return { kind: "malformed", raw: rawReply.slice(0, 300) };
      }
      try {
        const parsed: unknown = JSON.parse(
          rawReply.trim(),
        );
        const verdict = judgeVerdictSchema.safeParse(parsed);
        return verdict.success
          ? verdict.data
          : { kind: "malformed", raw: rawReply.slice(0, 300) };
      } catch {
        return { kind: "malformed", raw: rawReply.slice(0, 300) };
      }
    } finally {
      await runtime.shutdown().catch(() => undefined);
      await Deno.remove(root, { recursive: true }).catch(() => undefined);
      await Deno.remove(cwd, { recursive: true }).catch(() => undefined);
      await Deno.remove(homeDir, { recursive: true }).catch(() => undefined);
      await Deno.remove(codexHome, { recursive: true }).catch(() => undefined);
      await Deno.remove(state, { recursive: true }).catch(() => undefined);
    }
  }
}
