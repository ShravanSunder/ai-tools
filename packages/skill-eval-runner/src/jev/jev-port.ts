import type { QuestionCard } from "../contracts/question-card.ts";
// `engine` names the Jev engine that produced the score; its bands come from that engine's calibration.
export type JevAnswer = {
  kind: "answered";
  engine: string;
  value: string;
  score: number;
} | {
  kind: "unavailable";
  reason: string;
};
export interface JevDecisionPort {
  ask(card: QuestionCard, evidence: readonly string[]): Promise<JevAnswer>;
}
export class NoEngineJev implements JevDecisionPort {
  ask(
    _card: QuestionCard,
    _evidence: readonly string[],
  ): Promise<JevAnswer> {
    return Promise.resolve({ kind: "unavailable", reason: "no Jev engine" });
  }
}
