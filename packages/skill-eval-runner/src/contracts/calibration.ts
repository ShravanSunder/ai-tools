import { z } from "npm:zod@4.6.5";
export const calibrationSchema = z.object({
  cardId: z.string(),
  engine: z.string(),
  labelledSet: z.string(),
  measuredAt: z.string(),
  bands: z.object({
    yes: z.number(),
    no: z.number(),
    uncertain: z.number().optional(),
    high: z.number().optional(),
    low: z.number().optional(),
  }),
});
export type Calibration = z.infer<typeof calibrationSchema>;
