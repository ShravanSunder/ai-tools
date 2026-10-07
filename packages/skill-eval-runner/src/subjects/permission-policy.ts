export type PermissionDecision = "allow_once" | "reject_once";
export function decideSubjectPermission(
  inferredKind: string | undefined,
): PermissionDecision {
  return inferredKind === "read" || inferredKind === "search"
    ? "allow_once"
    : "reject_once";
}
