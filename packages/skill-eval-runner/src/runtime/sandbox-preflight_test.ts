import { assertEquals } from "jsr:@std/assert@1";
import { sandboxPreflightMessage } from "./sandbox-preflight.ts";
Deno.test("sandbox preflight rejects a Codex sandbox", () => {
  assertEquals(
    sandboxPreflightMessage({ CODEX_SANDBOX: "seatbelt" })?.includes(
      "unsandboxed shell",
    ),
    true,
  );
});
Deno.test("sandbox preflight permits a normal shell", () => {
  assertEquals(sandboxPreflightMessage({}), undefined);
});
