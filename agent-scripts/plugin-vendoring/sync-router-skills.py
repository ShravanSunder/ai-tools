#!/usr/bin/env python3
"""Explicit offline vendoring of the pinned Router skill; never installs skills."""

import argparse
import json
from pathlib import Path, PurePosixPath
import re
import stat
import subprocess

REPO_ROOT = Path(__file__).resolve().parents[2]
SOURCE_PATH = "agent-skills/router-controls"
DESTINATION_PATH = "plugins/codex-router/skills/router-controls"


def read_git(repository: Path, *arguments: str) -> bytes:
    return subprocess.check_output(["git", "-C", str(repository), *arguments])


def sync_skills(repository: Path, check_only: bool) -> None:
    sources = json.loads((REPO_ROOT / "plugin-sources.json").read_text())
    source = sources["codex-router"]
    commit = source["commit"]
    if not re.fullmatch(r"[0-9a-f]{40}", commit):
        raise ValueError("source commit must be a complete lowercase Git SHA")
    if (
        source["sourcePath"] != SOURCE_PATH
        or source["destinationPath"] != DESTINATION_PATH
    ):
        raise ValueError(
            "source/destination paths must match the owned Router skill paths"
        )
    resolved = (
        read_git(repository, "rev-parse", "--verify", commit + "^{commit}")
        .decode()
        .strip()
    )
    if resolved != commit:
        raise ValueError("source commit did not resolve exactly")
    entries = read_git(repository, "ls-tree", "-r", "-z", commit, "--", SOURCE_PATH)
    expected = {}
    for entry in entries.split(b"\0"):
        if not entry:
            continue
        metadata, raw_path = entry.split(b"\t", 1)
        mode, object_type, object_id = metadata.decode().split()
        if mode != "100644" or object_type != "blob":
            raise ValueError("only regular non-executable skill files may be vendored")
        relative = PurePosixPath(raw_path.decode()).relative_to(SOURCE_PATH)
        if ".." in relative.parts:
            raise ValueError("unsafe source path")
        expected[str(relative)] = read_git(repository, "cat-file", "blob", object_id)
    if "SKILL.md" not in expected:
        raise ValueError("pinned commit does not contain router-controls/SKILL.md")
    destination = REPO_ROOT / DESTINATION_PATH
    for ancestor in [destination, *destination.parents]:
        if ancestor == REPO_ROOT:
            break
        if ancestor.is_symlink():
            raise ValueError("destination ancestors must not be symlinks")
    existing = {}
    if destination.exists():
        for path in destination.rglob("*"):
            if path.is_symlink():
                raise ValueError("vendored skill must not contain symlinks")
            metadata = path.lstat()
            if stat.S_ISDIR(metadata.st_mode):
                continue
            if not stat.S_ISREG(metadata.st_mode):
                raise ValueError(
                    "vendored entries must be regular files or directories"
                )
            if metadata.st_nlink != 1:
                raise ValueError("vendored files must not be hard linked")
            if metadata.st_mode & 0o111:
                raise ValueError("vendored skill files must not be executable")
            existing[str(path.relative_to(destination))] = path.read_bytes()
    for name in expected:
        target = destination / name
        if target.exists() and not target.is_file():
            raise ValueError("expected file conflicts with existing directory")
        for ancestor in target.parents:
            if ancestor == REPO_ROOT:
                break
            if ancestor.exists() and not ancestor.is_dir():
                raise ValueError("expected directory conflicts with existing file")
    if check_only:
        if existing != expected:
            raise ValueError(
                "vendored skill differs from pinned commit; run explicit sync"
            )
        print(f"Pinned skill verified: {commit} ({len(expected)} files)")
        return
    # All source reads and path checks precede mutation. No network, hooks, or code execution.
    destination.mkdir(parents=True, exist_ok=True)
    for name, content in expected.items():
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
    for name in existing.keys() - expected.keys():
        (destination / name).unlink()
    print(f"Vendored Router skill: {commit} ({len(expected)} files)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source-repo",
        type=Path,
        required=True,
        help="Local Router clone containing the pinned commit",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Verify only; never change the packaged copy",
    )
    arguments = parser.parse_args()
    try:
        sync_skills(arguments.source_repo.resolve(), arguments.check)
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"Router skill sync failed: {error}\n")


if __name__ == "__main__":
    main()
