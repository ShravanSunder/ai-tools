import type { JudgeVerdict } from "../contracts/judge-verdict.ts";
export type JudgeInput = {
  criterion: string;
  request: string;
  evidence: readonly string[];
};
// What one judge call yields: the judge's own verdict, a reply that did not parse, or a session the
// runner discarded because the judge touched its linked login.
export type JudgeAnswer =
  | JudgeVerdict
  | { kind: "malformed"; raw: string }
  | { kind: "undecidable"; reason: "judge-credential-exposure" };
export interface JudgePort {
  judge(input: JudgeInput): Promise<JudgeAnswer>;
}
export class FakeJudge implements JudgePort {
  public calls = 0;
  private readonly answers: readonly JudgeAnswer[];
  constructor(answer: JudgeAnswer | readonly JudgeAnswer[]) {
    this.answers = Array.isArray(answer) ? answer : [answer];
  }
  judge(_input: JudgeInput): Promise<JudgeAnswer> {
    const answer = this.answers[Math.min(this.calls, this.answers.length - 1)];
    this.calls += 1;
    return Promise.resolve(answer);
  }
}
