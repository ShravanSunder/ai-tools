import type { JudgeVerdict } from "../contracts/judge-verdict.ts";
export type JudgeInput = {
  criterion: string;
  request: string;
  evidence: readonly string[];
};
export interface JudgePort {
  judge(
    input: JudgeInput,
  ): Promise<JudgeVerdict | { kind: "malformed"; raw: string }>;
}
export class FakeJudge implements JudgePort {
  constructor(
    private readonly verdict: JudgeVerdict | { kind: "malformed"; raw: string },
  ) {}
  judge(
    _input: JudgeInput,
  ): Promise<JudgeVerdict | { kind: "malformed"; raw: string }> {
    return Promise.resolve(this.verdict);
  }
}
