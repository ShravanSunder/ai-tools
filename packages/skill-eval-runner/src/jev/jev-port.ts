import type { QuestionCard } from "../contracts/question-card.ts";
export type JevAnswer = { kind: "answered"; value: string; score: number } | {
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
