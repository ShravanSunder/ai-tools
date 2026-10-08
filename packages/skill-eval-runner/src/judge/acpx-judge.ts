import { join } from "node:path";
import { mkdtemp, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import {
  type AcpRuntimeEvent,
  createAcpRuntime,
  createAgentRegistry,
  createFileSessionStore,
} from "npm:acpx@0.19.4/runtime";
import type { PreparedEnvironment } from "../environment/prepare-environment.ts";
import { buildJudgePrompt } from "./judge-prompt.ts";
import type { JudgeAnswer, JudgeInput, JudgePort } from "./judge-port.ts";
import { judgeAnswerFromSession } from "./judge-session-answer.ts";
// The judge's own Codex config. Its shell commands are not told where its linked login lives,
// matching the subject (confirmed on Codex 0.160.0, see prepare-environment.ts).
export const judgeCodexConfig = {
  model: "gpt-6-luna",
  model_reasoning_effort: "high",
  approvals_reviewer: "user",
  shell_environment_policy: { exclude: ["CODEX_HOME"] },
  features: { hooks: false, remote_plugin: false, memories: false },
} as const;
export class AcpxJudge implements JudgePort {
  constructor(private readonly environment: PreparedEnvironment) {}
  async judge(input: JudgeInput): Promise<JudgeAnswer> {
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
        CODEX_CONFIG: JSON.stringify(judgeCodexConfig),
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
        if (typed.type === "text_delta" && typed.stream === "thought") continue;
        events.push(typed);
      }
      const result = await turn.result;
      return judgeAnswerFromSession({
        events,
        completed: result.status === "completed",
        judgeCodexHomePaths: [
          ...new Set([
            codexHome,
            await Deno.realPath(codexHome).catch(() => codexHome),
          ]),
        ],
      });
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
