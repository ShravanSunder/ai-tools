import { describe, expect, it } from "vitest";

import { resolveSubjectExecutionPolicy } from "./behavioral-scenario-runner.js";

describe("behavioral scenario subject policy", () => {
  it("enables disposable-repository writes only for path-bounded scenarios", () => {
    expect(resolveSubjectExecutionPolicy({ allowedTools: [], allowedWritePaths: [] })).toEqual({
      permissionMode: "approve-reads",
      allowedTools: [],
      allowedWritePaths: [],
    });
    expect(resolveSubjectExecutionPolicy({
      allowedTools: ["write"],
      allowedWritePaths: ["reports/result.md"],
    })).toEqual({
      permissionMode: "approve-all",
      allowedTools: ["write"],
      allowedWritePaths: ["reports/result.md"],
    });
  });
});
