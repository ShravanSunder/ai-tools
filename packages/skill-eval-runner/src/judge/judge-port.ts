import type { JudgeVerdict } from "../contracts/judge-verdict.ts";
export type JudgeInput = {
  criterion: string;
  request: string;
  evidence: readonly string[];
};
export interface JudgePort {
  judge(input: JudgeInput): Promise<JudgeVerdict | { kind: "malformed" }>;
}
export class FakeJudge implements JudgePort {
  constructor(private readonly verdict: JudgeVerdict | { kind: "malformed" }) {}
  judge(
    _input: JudgeInput,
  ): Promise<JudgeVerdict | { kind: "malformed" }> {
    return Promise.resolve(this.verdict);
  }
}
