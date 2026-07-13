import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";

export async function discoverAmbientSkillPaths(props: {
  readonly codexHome: string;
}): Promise<readonly string[]> {
  const matches: string[] = [];
  for (const root of [
    path.join(path.resolve(props.codexHome), "skills"),
    path.join(path.resolve(props.codexHome), "plugins", "cache"),
  ]) {
    await walk(root, matches);
  }
  return [...new Set(matches)].sort();
}

async function walk(directory: string, matches: string[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      await walk(entryPath, matches);
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      const status = await lstat(entryPath);
      if (!status.isFile() || status.isSymbolicLink()) continue;
      const source = await readFile(entryPath, "utf8");
      if (/^name:\s*[a-z0-9][a-z0-9-]*\s*$/mu.test(source)) {
        matches.push(entryPath);
      }
    }
  }
}
