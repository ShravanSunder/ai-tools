import { z } from "npm:zod@4.6.5";

export const revisionSchema = z.object({
  kind: z.enum(["working-tree", "commit"]),
  value: z.string().optional(),
});
export type Revision = z.infer<typeof revisionSchema>;
export const skillRefSchema = z.object({
  repoRoot: z.string().min(1),
  skillPath: z.string().min(1),
});
export type SkillRef = z.infer<typeof skillRefSchema>;
