import { z } from "npm:zod@4.6.5";
import { evidenceSourceSchema } from "./evidence-source.ts";
export const questionCardSchema = z.strictObject({
  id: z.string(),
  serves: z.string(),
  type: z.enum(["yes_no", "choice"]),
  question: z.string(),
  options: z.array(z.string()).optional(),
  evidence: z.array(evidenceSourceSchema).min(1),
  combine: z.unknown().optional(),
  // Keyed by the Jev engine the bands were measured for: a score is trusted only for that engine.
  calibration: z.record(
    z.string(),
    z.strictObject({ bands: z.record(z.string(), z.number()) }),
  ).optional(),
}).superRefine((c, ctx) => {
  if (c.type === "choice" && (!c.options || c.options.length === 0)) {
    ctx.addIssue({
      code: "custom",
      message: "choice card requires options",
      path: ["options"],
    });
  }
});
export type QuestionCard = z.infer<typeof questionCardSchema>;
export const questionCardsSchema = z.array(questionCardSchema);
