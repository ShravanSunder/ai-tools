import path from "node:path";

export const EPHEMERAL_PARENT_ACCEPTANCE_ROOT =
  "tmp/skill-pressure-evals/parent-acceptance";

export function assertEphemeralParentAcceptancePath(receiptPath: string): string {
  const normalizedPath = path.posix.normalize(receiptPath);
  if (
    normalizedPath !== receiptPath ||
    path.posix.isAbsolute(normalizedPath) ||
    !normalizedPath.startsWith(`${EPHEMERAL_PARENT_ACCEPTANCE_ROOT}/`)
  ) {
    throw new Error("parent acceptance receipt must use the ephemeral parent-acceptance root");
  }
  return normalizedPath;
}
