import { z } from "npm:zod@4.6.5";
export const judgeVerdictSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("decided"),
    result: z.enum(["pass", "fail"]),
    evidenceQuote: z.string(),
    rationale: z.string(),
  }),
  z.strictObject({
    kind: z.literal("undecidable"),
    reason: z.enum(["evidence-insufficient", "criterion-ambiguous"]),
  }),
]);
export type JudgeVerdict = z.infer<typeof judgeVerdictSchema>;
