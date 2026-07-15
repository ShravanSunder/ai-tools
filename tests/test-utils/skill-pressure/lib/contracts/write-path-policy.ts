export function isPathAllowedByWritePolicy(
  allowedPath: string,
  candidatePath: string,
): boolean {
  return candidatePath === allowedPath || candidatePath.startsWith(`${allowedPath}/`);
}
