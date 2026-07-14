import { lstat, readFile, realpath } from "node:fs/promises";
import path from "node:path";

export const TRACKED_AUTHORITY_RECEIPT_ROOT = "tests/test-utils/skill-pressure/config/authority-receipts";

export async function readTrackedAuthorityReceiptFile(props: {
  readonly repositoryRoot: string;
  readonly receiptPath: string;
  readonly label: string;
}): Promise<Buffer> {
  const normalizedPath = path.posix.normalize(props.receiptPath);
  if (
    normalizedPath !== props.receiptPath ||
    path.posix.isAbsolute(normalizedPath) ||
    !(normalizedPath === TRACKED_AUTHORITY_RECEIPT_ROOT || normalizedPath.startsWith(`${TRACKED_AUTHORITY_RECEIPT_ROOT}/`))
  ) {
    throw new Error(`${props.label} must use the tracked authority receipt root: ${props.receiptPath}`);
  }

  const authorityRootPath = path.resolve(props.repositoryRoot, TRACKED_AUTHORITY_RECEIPT_ROOT);
  const resolvedPath = path.resolve(props.repositoryRoot, normalizedPath);
  const pathWithinAuthorityRoot = path.relative(authorityRootPath, resolvedPath);
  const authorityRootStatus = await lstat(authorityRootPath);
  if (!authorityRootStatus.isDirectory()) {
    throw new Error(`${props.label} tracked authority root must be a real directory`);
  }
  const [canonicalAuthorityRoot, canonicalReceiptPath] = await Promise.all([
    realpath(authorityRootPath),
    realpath(resolvedPath),
  ]);
  const expectedCanonicalPath = path.resolve(canonicalAuthorityRoot, pathWithinAuthorityRoot);
  if (canonicalReceiptPath !== expectedCanonicalPath) {
    throw new Error(`${props.label} cannot use a symlinked parent outside the canonical tracked authority root`);
  }

  const receiptStatus = await lstat(resolvedPath);
  if (!receiptStatus.isFile() || receiptStatus.nlink !== 1) {
    throw new Error(`${props.label} must be one regular file without links`);
  }
  return readFile(resolvedPath);
}
