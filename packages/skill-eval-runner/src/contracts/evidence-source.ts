import { z } from "npm:zod@4.6.5";
export const fileRefSchema = z.string().min(1);
export const evidenceSourceSchema = z.union([
  z.literal("finalMessage"),
  z.literal("conversation"),
  z.literal("toolCalls"),
  z.strictObject({ file: fileRefSchema }),
]);
export type EvidenceSource = z.infer<typeof evidenceSourceSchema>;
