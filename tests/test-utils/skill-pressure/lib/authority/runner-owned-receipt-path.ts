import path from "node:path";

export function assertRunnerOwnedReceiptPath(
  repositoryRoot: string,
  receiptPath: string,
  label: string,
): void {
  const resolvedRepositoryRoot = path.resolve(repositoryRoot);
  const resolvedReceiptPath = path.resolve(resolvedRepositoryRoot, receiptPath);
  const runnerOutputRoot = path.join(resolvedRepositoryRoot, "tmp", "skill-pressure-evals");
  const relativePath = path.relative(runnerOutputRoot, resolvedReceiptPath);
  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`${label} must be inside tmp/skill-pressure-evals`);
  }
}
