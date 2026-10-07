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
  public calls = 0;
  private readonly verdicts:
    readonly (JudgeVerdict | { kind: "malformed"; raw: string })[];
  constructor(
    verdict:
      | JudgeVerdict
      | { kind: "malformed"; raw: string }
      | readonly (JudgeVerdict | { kind: "malformed"; raw: string })[],
  ) {
    this.verdicts = Array.isArray(verdict) ? verdict : [verdict];
  }
  judge(
    _input: JudgeInput,
  ): Promise<JudgeVerdict | { kind: "malformed"; raw: string }> {
    const verdict =
      this.verdicts[Math.min(this.calls, this.verdicts.length - 1)];
    this.calls += 1;
    return Promise.resolve(verdict);
  }
}
