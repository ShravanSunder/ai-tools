#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = [
#   "pydantic>=2",
# ]
# ///
"""Explicit offline vendoring of named pinned skills; never installs skills."""

import argparse
import os
from pathlib import Path, PurePosixPath
import re
import stat
import subprocess
import typing as t

from pydantic import (
    AfterValidator,
    BaseModel,
    ConfigDict,
    Field,
    ValidationError,
    model_validator,
)

_ROOT_OVERRIDE = os.environ.get("PLUGIN_SOURCES_ROOT")
REPO_ROOT = (
    Path(_ROOT_OVERRIDE) if _ROOT_OVERRIDE else Path(__file__).resolve().parents[1]
)
SOURCES_FILE = "plugin-sources.json"
COMMIT_PATTERN = re.compile(r"[0-9a-f]{40}")


def commit_sha(value: str) -> str:
    if not COMMIT_PATTERN.fullmatch(value):
        raise ValueError("source commit must be a complete lowercase Git SHA")
    return value


def plugin_destination(value: str) -> str:
    path = PurePosixPath(value)
    if path.is_absolute() or value.endswith("/") or not value:
        raise ValueError("destinationPath must be a relative path")
    if ".." in path.parts or path.parts[0] != "plugins":
        raise ValueError("destinationPath must stay under plugins/")
    return value


def source_tree(value: str) -> str:
    path = PurePosixPath(value)
    if path.is_absolute() or not value or ".." in path.parts:
        raise ValueError("sourcePath must be a relative path")
    return value


CommitSha = t.Annotated[str, AfterValidator(commit_sha)]
PluginDestination = t.Annotated[str, AfterValidator(plugin_destination)]
SourceTree = t.Annotated[str, AfterValidator(source_tree)]


class CurrentSkill(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    status: t.Literal["current"]
    commit: CommitSha
    source_path: SourceTree = Field(alias="sourcePath")
    destination_path: PluginDestination = Field(alias="destinationPath")
    repository: str | None = None


class DeprecatedSkill(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    status: t.Literal["deprecated"]
    destination_path: PluginDestination = Field(alias="destinationPath")


SkillEntry = t.Annotated[
    CurrentSkill | DeprecatedSkill, Field(discriminator="status")
]


class PluginSources(BaseModel):
    model_config = ConfigDict(extra="forbid")

    skills: dict[str, SkillEntry] = Field(min_length=1)

    @model_validator(mode="after")
    def unique_destinations(self) -> t.Self:
        current: dict[str, str] = {}
        deprecated: dict[str, str] = {}
        for name, skill in self.skills.items():
            table = current if isinstance(skill, CurrentSkill) else deprecated
            owner = table.get(skill.destination_path)
            if owner is not None:
                raise ValueError(
                    f"duplicate destinationPath between {owner} and {name}"
                )
            table[skill.destination_path] = name
        if set(current) & set(deprecated):
            raise ValueError(
                "deprecated destinationPath collides with a current skill"
            )
        return self


def read_git(repository: Path, *arguments: str) -> bytes:
    return subprocess.check_output(["git", "-C", str(repository), *arguments])


def load_skill_map() -> PluginSources:
    try:
        return PluginSources.model_validate_json(
            (REPO_ROOT / SOURCES_FILE).read_text()
        )
    except ValidationError as error:
        raise ValueError(str(error)) from error


def assert_destination_safe(destination: Path) -> None:
    if destination.is_symlink():
        raise ValueError("destination must not be a symlink")
    for ancestor in [destination, *destination.parents]:
        if ancestor == REPO_ROOT:
            break
        if ancestor.is_symlink():
            raise ValueError("destination ancestors must not be symlinks")


def collect_existing(destination: Path) -> dict[str, bytes]:
    existing: dict[str, bytes] = {}
    if not destination.exists():
        return existing
    if not destination.is_dir():
        raise ValueError("destination must be a directory")
    for path in destination.rglob("*"):
        if path.is_symlink():
            raise ValueError("vendored skill must not contain symlinks")
        metadata = path.lstat()
        if stat.S_ISDIR(metadata.st_mode):
            continue
        if not stat.S_ISREG(metadata.st_mode):
            raise ValueError("vendored entries must be regular files or directories")
        if metadata.st_nlink != 1:
            raise ValueError("vendored files must not be hard linked")
        if metadata.st_mode & 0o111:
            raise ValueError("vendored skill files must not be executable")
        existing[str(path.relative_to(destination))] = path.read_bytes()
    return existing


def assert_write_targets(destination: Path, expected: dict[str, bytes]) -> None:
    for name in expected:
        target = destination / name
        if target.exists() and not target.is_file():
            raise ValueError("expected file conflicts with existing directory")
        for ancestor in target.parents:
            if ancestor == REPO_ROOT:
                break
            if ancestor.exists() and not ancestor.is_dir():
                raise ValueError("expected directory conflicts with existing file")


def read_expected_files(
    repository: Path, skill_name: str, skill: CurrentSkill
) -> dict[str, bytes]:
    resolved = (
        read_git(repository, "rev-parse", "--verify", skill.commit + "^{commit}")
        .decode()
        .strip()
    )
    if resolved != skill.commit:
        raise ValueError("source commit did not resolve exactly")
    entries = read_git(
        repository, "ls-tree", "-r", "-z", skill.commit, "--", skill.source_path
    )
    expected: dict[str, bytes] = {}
    source_path = PurePosixPath(skill.source_path)
    for entry in entries.split(b"\0"):
        if not entry:
            continue
        metadata, raw_path = entry.split(b"\t", 1)
        mode, object_type, object_id = metadata.decode().split()
        if mode != "100644" or object_type != "blob":
            raise ValueError("only regular non-executable skill files may be vendored")
        relative = PurePosixPath(raw_path.decode()).relative_to(source_path)
        if ".." in relative.parts:
            raise ValueError("unsafe source path")
        expected[str(relative)] = read_git(repository, "cat-file", "blob", object_id)
    if "SKILL.md" not in expected:
        raise ValueError(f"pinned commit does not contain {skill_name}/SKILL.md")
    return expected


def write_current(
    destination: Path, expected: dict[str, bytes], existing: dict[str, bytes]
) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    for name, content in expected.items():
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
    for name in existing.keys() - expected.keys():
        (destination / name).unlink()


def remove_destination(destination: Path) -> None:
    if not destination.exists():
        return
    for path in sorted(
        destination.rglob("*"), key=lambda item: len(item.parts), reverse=True
    ):
        if path.is_dir() and not path.is_symlink():
            path.rmdir()
            continue
        path.unlink()
    destination.rmdir()


def sync_skills(
    skill_name: str, check_only: bool, repository: Path | None
) -> None:
    skills = load_skill_map().skills
    if skill_name not in skills:
        raise ValueError(f"unknown skill: {skill_name}")
    named = skills[skill_name]
    expected: dict[str, bytes] | None = None
    existing: dict[str, bytes] | None = None
    destination: Path | None = None
    if isinstance(named, CurrentSkill):
        if repository is None:
            raise ValueError("--source-repo is required to sync a current skill")
        expected = read_expected_files(repository, skill_name, named)
        destination = REPO_ROOT / named.destination_path
        assert_destination_safe(destination)
        existing = collect_existing(destination)
        assert_write_targets(destination, expected)

    deprecated_present: list[tuple[str, Path]] = []
    for name, skill in skills.items():
        if not isinstance(skill, DeprecatedSkill):
            continue
        deprecated_destination = REPO_ROOT / skill.destination_path
        assert_destination_safe(deprecated_destination)
        if deprecated_destination.exists():
            collect_existing(deprecated_destination)
            deprecated_present.append((name, deprecated_destination))

    if check_only:
        if isinstance(named, CurrentSkill):
            if existing != expected:
                raise ValueError(
                    "vendored skill differs from pinned commit; run explicit sync"
                )
            print(
                f"Pinned skill verified: {skill_name} {named.commit} "
                f"({len(expected)} files)"
            )
        if deprecated_present:
            names = ", ".join(name for name, _ in deprecated_present)
            raise ValueError(
                f"deprecated skill still present ({names}); run explicit sync"
            )
        if isinstance(named, DeprecatedSkill):
            print(f"Deprecated skill verified absent: {skill_name}")
        return

    # All source reads and path checks precede mutation. No network, hooks, or code execution.
    if isinstance(named, CurrentSkill):
        write_current(destination, expected, existing)
        print(f"Vendored skill {skill_name}: {named.commit} ({len(expected)} files)")
    for name, deprecated_destination in deprecated_present:
        remove_destination(deprecated_destination)
        print(f"Removed deprecated skill {name}: {deprecated_destination.relative_to(REPO_ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--skill",
        required=True,
        help="Skill name in plugin-sources.json",
    )
    parser.add_argument(
        "--source-repo",
        type=Path,
        help="Local clone containing the pinned commit for a current skill",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Verify only; never change the packaged copy",
    )
    arguments = parser.parse_args()
    repository = (
        arguments.source_repo.resolve() if arguments.source_repo is not None else None
    )
    try:
        sync_skills(arguments.skill, arguments.check, repository)
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"Skill sync failed: {error}\n")


if __name__ == "__main__":
    main()
