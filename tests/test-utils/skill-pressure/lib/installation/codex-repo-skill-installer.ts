import { createHash, randomUUID } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
} from "node:fs";
import path from "node:path";

export interface InstallCodexRepoSkillProps {
  readonly sourceSkillDirectory: string;
  readonly repositoryDirectory: string;
  readonly skillName: string;
  readonly overwrite?: boolean;
}

export interface CodexRepoSkillFileReceipt {
  readonly relativePath: string;
  readonly sourceDigest: string;
  readonly installedDigest: string;
}

export interface CodexRepoSkillInstallReceipt {
  readonly installer: "repo-owned-typescript-v1";
  readonly scope: "repo";
  readonly skillName: string;
  readonly sourceDirectory: string;
  readonly destinationDirectory: string;
  readonly closureDigest: string;
  readonly files: readonly CodexRepoSkillFileReceipt[];
}

interface SourceFile {
  readonly absolutePath: string;
  readonly relativePath: string;
  readonly digest: string;
}

export function installCodexRepoSkill(
  props: InstallCodexRepoSkillProps,
): CodexRepoSkillInstallReceipt {
  validateSkillName(props.skillName);
  const sourceDirectory = path.resolve(props.sourceSkillDirectory);
  const repositoryDirectory = path.resolve(props.repositoryDirectory);
  validateSourceDirectory(sourceDirectory);
  validateRepositoryDirectory(repositoryDirectory);

  const sourceFiles = collectSourceFiles(sourceDirectory);
  if (!sourceFiles.some((file) => file.relativePath === "SKILL.md")) {
    throw new Error("source skill directory must contain a regular SKILL.md");
  }

  const skillsDirectory = path.join(repositoryDirectory, ".codex", "skills");
  const destinationDirectory = path.join(skillsDirectory, props.skillName);
  if (existsSync(destinationDirectory) && props.overwrite !== true) {
    throw new Error(`skill destination already exists: ${destinationDirectory}`);
  }

  mkdirSync(skillsDirectory, { recursive: true });
  const temporaryDirectory = path.join(
    skillsDirectory,
    `.${props.skillName}.installing-${randomUUID()}`,
  );

  try {
    for (const sourceFile of sourceFiles) {
      const temporaryFile = path.join(
        temporaryDirectory,
        ...sourceFile.relativePath.split("/"),
      );
      mkdirSync(path.dirname(temporaryFile), { recursive: true });
      copyFileSync(sourceFile.absolutePath, temporaryFile);
    }

    if (props.overwrite === true) {
      rmSync(destinationDirectory, { recursive: true, force: true });
    }
    renameSync(temporaryDirectory, destinationDirectory);
  } catch (error) {
    rmSync(temporaryDirectory, { recursive: true, force: true });
    throw error;
  }

  const files = sourceFiles.map((sourceFile) => {
    const installedFile = path.join(
      destinationDirectory,
      ...sourceFile.relativePath.split("/"),
    );
    return {
      relativePath: sourceFile.relativePath,
      sourceDigest: sourceFile.digest,
      installedDigest: digestFile(installedFile),
    } satisfies CodexRepoSkillFileReceipt;
  });

  return {
    installer: "repo-owned-typescript-v1",
    scope: "repo",
    skillName: props.skillName,
    sourceDirectory,
    destinationDirectory,
    closureDigest: digestClosure(files),
    files,
  };
}

function validateSkillName(skillName: string): void {
  if (!/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/u.test(skillName)) {
    throw new Error("skillName must be lowercase hyphen-case without traversal");
  }
}

function validateSourceDirectory(sourceDirectory: string): void {
  const sourceStats = lstatSync(sourceDirectory);
  if (sourceStats.isSymbolicLink() || !sourceStats.isDirectory()) {
    throw new Error("source skill path must be a real directory, not a symlink");
  }
}

function validateRepositoryDirectory(repositoryDirectory: string): void {
  const gitEntry = path.join(repositoryDirectory, ".git");
  if (!existsSync(gitEntry)) {
    throw new Error("destination must be a Git repository");
  }
}

function collectSourceFiles(sourceDirectory: string): readonly SourceFile[] {
  const sourceFiles: SourceFile[] = [];
  walkSourceDirectory(sourceDirectory, sourceDirectory, sourceFiles);
  return sourceFiles.sort((left, right) => {
    if (left.relativePath < right.relativePath) {
      return -1;
    }
    if (left.relativePath > right.relativePath) {
      return 1;
    }
    return 0;
  });
}

function walkSourceDirectory(
  sourceRoot: string,
  currentDirectory: string,
  sourceFiles: SourceFile[],
): void {
  const entries = readdirSync(currentDirectory, { withFileTypes: true }).sort(
    (left, right) => left.name.localeCompare(right.name),
  );

  for (const entry of entries) {
    const absolutePath = path.join(currentDirectory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`source closure contains a symlink: ${absolutePath}`);
    }
    if (entry.isDirectory()) {
      walkSourceDirectory(sourceRoot, absolutePath, sourceFiles);
      continue;
    }
    if (!entry.isFile()) {
      throw new Error(`source closure contains a non-regular file: ${absolutePath}`);
    }
    sourceFiles.push({
      absolutePath,
      relativePath: path.relative(sourceRoot, absolutePath).split(path.sep).join("/"),
      digest: digestFile(absolutePath),
    });
  }
}

function digestFile(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function digestClosure(
  files: readonly CodexRepoSkillFileReceipt[],
): string {
  const canonicalFiles = files.map((file) => ({
    relativePath: file.relativePath,
    digest: file.installedDigest,
  }));
  return createHash("sha256")
    .update(JSON.stringify(canonicalFiles))
    .digest("hex");
}
