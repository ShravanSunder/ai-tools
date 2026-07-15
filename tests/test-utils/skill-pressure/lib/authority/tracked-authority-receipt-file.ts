import { lstat, readFile, realpath } from "node:fs/promises";
import path from "node:path";

export const TRACKED_AUTHORITY_RECEIPT_ROOT = "tests/test-utils/skill-pressure/config/authority-receipts";
const OWNER_LOCAL_BASELINE_PATH = /^tests\/[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]*\/baselines\/[a-z0-9][a-z0-9-]*\.json$/u;

export async function readTrackedAuthorityReceiptFile(props: {
  readonly repositoryRoot: string;
  readonly receiptPath: string;
  readonly label: string;
}): Promise<Buffer> {
  const normalizedPath = path.posix.normalize(props.receiptPath);
  if (normalizedPath !== props.receiptPath || path.posix.isAbsolute(normalizedPath)) {
    throw new Error(`${props.label} must use a tracked receipt path: ${props.receiptPath}`);
  }
  const withinValidityRoot = normalizedPath.startsWith(`${TRACKED_AUTHORITY_RECEIPT_ROOT}/`);
  if (!withinValidityRoot && !OWNER_LOCAL_BASELINE_PATH.test(normalizedPath)) {
    throw new Error(`${props.label} must use a tracked validity receipt or owner-local baseline path: ${props.receiptPath}`);
  }

  const repositoryRootPath = path.resolve(props.repositoryRoot);
  const resolvedPath = path.resolve(props.repositoryRoot, normalizedPath);
  const receiptDirectory = path.dirname(resolvedPath);
  const receiptDirectoryStatus = await lstat(receiptDirectory);
  if (!receiptDirectoryStatus.isDirectory()) {
    throw new Error(`${props.label} tracked receipt directory must be a real directory`);
  }
  const [canonicalRepositoryRoot, canonicalReceiptPath] = await Promise.all([
    realpath(repositoryRootPath),
    realpath(resolvedPath),
  ]);
  const expectedCanonicalPath = path.resolve(canonicalRepositoryRoot, normalizedPath);
  if (canonicalReceiptPath !== expectedCanonicalPath) {
    throw new Error(`${props.label} cannot use a symlinked parent outside the canonical repository root`);
  }

  const receiptStatus = await lstat(resolvedPath);
  if (!receiptStatus.isFile() || receiptStatus.nlink !== 1) {
    throw new Error(`${props.label} must be one regular file without links`);
  }
  return readFile(resolvedPath);
}
