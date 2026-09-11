"""Run the vendoring script the same way production does: `uv run` + PEP 723."""

import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = (
    Path(__file__).resolve().parents[2]
    / "scripts/sync-skills.py"
)
SOURCE_PATH = "agent-skills/demo-skill"
DESTINATION_PATH = "plugins/demo/skills/demo-skill"


class SkillVendoringTests(unittest.TestCase):
    def setUp(self) -> None:
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.source = self.root / "source"
        self.package = self.root / "package"
        self.source.mkdir()
        self.package.mkdir()
        self.git("init", "-q")
        self.skill = self.source / SOURCE_PATH / "SKILL.md"
        self.skill.parent.mkdir(parents=True)
        self.skill.write_text("committed skill\n")
        self.git("add", ".")
        self.git(
            "-c",
            "user.name=Test",
            "-c",
            "user.email=test@example.invalid",
            "-c",
            "commit.gpgsign=false",
            "commit",
            "-qm",
            "fixture",
        )
        self.pin = self.git("rev-parse", "HEAD").decode().strip()
        self.manifest: dict[str, dict[str, dict[str, str]]] = {
            "skills": {
                "demo-skill": {
                    "status": "current",
                    "commit": self.pin,
                    "sourcePath": SOURCE_PATH,
                    "destinationPath": DESTINATION_PATH,
                }
            }
        }
        self.save_manifest()

    def git(self, *args: str) -> bytes:
        return subprocess.check_output(["git", "-C", str(self.source), *args])

    def save_manifest(self) -> None:
        (self.package / "plugin-sources.json").write_text(json.dumps(self.manifest))

    def run_sync(self, arguments: list[str]) -> subprocess.CompletedProcess[str]:
        env = os.environ.copy()
        env["PLUGIN_SOURCES_ROOT"] = str(self.package)
        return subprocess.run(
            ["uv", "run", "--script", str(SCRIPT), *arguments],
            capture_output=True,
            text=True,
            env=env,
            check=False,
        )

    def sync_current(self, *, check_only: bool, skill_name: str = "demo-skill") -> subprocess.CompletedProcess[str]:
        arguments = ["--skill", skill_name, "--source-repo", str(self.source)]
        if check_only:
            arguments.append("--check")
        return self.run_sync(arguments)

    def test_sync_uses_commit_and_check_detects_drift_without_writing(self) -> None:
        self.skill.write_text("dirty source\n")
        synced = self.sync_current(check_only=False)
        self.assertEqual(synced.returncode, 0, synced.stderr)
        output = self.package / DESTINATION_PATH / "SKILL.md"
        self.assertEqual(output.read_text(), "committed skill\n")
        checked = self.sync_current(check_only=True)
        self.assertEqual(checked.returncode, 0, checked.stderr)
        output.write_text("changed copy\n")
        drifted = self.sync_current(check_only=True)
        self.assertNotEqual(drifted.returncode, 0)
        self.assertRegex(drifted.stderr, "differs")
        self.assertEqual(output.read_text(), "changed copy\n")

    def test_symlink_destination_cannot_write_outside_package(self) -> None:
        outside = self.root / "outside"
        outside.mkdir()
        (self.package / "plugins").symlink_to(outside, target_is_directory=True)
        result = self.sync_current(check_only=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertRegex(result.stderr, "symlinks")
        self.assertEqual(list(outside.iterdir()), [])

    def test_unsafe_existing_files_are_rejected_before_writing(self) -> None:
        target = self.package / DESTINATION_PATH
        target.mkdir(parents=True)
        entry = target / "SKILL.md"
        outside = self.root / "outside.txt"
        outside.write_text("outside")
        os.link(outside, entry)
        result = self.sync_current(check_only=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(outside.read_text(), "outside")
        entry.unlink()
        os.mkfifo(entry)
        result = self.sync_current(check_only=True)
        self.assertNotEqual(result.returncode, 0)
        entry.unlink()
        entry.write_text("committed skill\n")
        entry.chmod(0o755)
        result = self.sync_current(check_only=True)
        self.assertNotEqual(result.returncode, 0)

    def test_invalid_pin_leaves_destination_untouched(self) -> None:
        self.manifest["skills"]["demo-skill"]["commit"] = "main"
        self.save_manifest()
        result = self.sync_current(check_only=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertRegex(result.stderr, "complete lowercase")
        self.assertFalse((self.package / "plugins").exists())

    def test_unknown_skill_name_is_rejected(self) -> None:
        result = self.sync_current(check_only=False, skill_name="missing")
        self.assertNotEqual(result.returncode, 0)
        self.assertRegex(result.stderr, "unknown skill")

    def test_sync_removes_stale_owned_files_preserving_siblings(self) -> None:
        synced = self.sync_current(check_only=False)
        self.assertEqual(synced.returncode, 0, synced.stderr)
        target = self.package / DESTINATION_PATH
        (target / "obsolete.md").write_text("old")
        sibling = target.parent / "other-skill"
        sibling.mkdir()
        (sibling / "SKILL.md").write_text("keep")
        again = self.sync_current(check_only=False)
        self.assertEqual(again.returncode, 0, again.stderr)
        self.assertFalse((target / "obsolete.md").exists())
        self.assertEqual((sibling / "SKILL.md").read_text(), "keep")

    def test_deprecated_skill_is_removed_and_check_refuses_leftovers(self) -> None:
        synced = self.sync_current(check_only=False)
        self.assertEqual(synced.returncode, 0, synced.stderr)
        leftover = self.package / "plugins/demo/skills/old-skill"
        leftover.mkdir(parents=True)
        (leftover / "SKILL.md").write_text("stale")
        self.manifest["skills"]["old-skill"] = {
            "status": "deprecated",
            "destinationPath": "plugins/demo/skills/old-skill",
        }
        self.save_manifest()
        leftover_check = self.sync_current(check_only=True)
        self.assertNotEqual(leftover_check.returncode, 0)
        self.assertRegex(leftover_check.stderr, "deprecated skill still present")
        self.assertEqual((leftover / "SKILL.md").read_text(), "stale")
        pruned = self.sync_current(check_only=False)
        self.assertEqual(pruned.returncode, 0, pruned.stderr)
        self.assertFalse(leftover.exists())
        self.assertEqual(
            (self.package / DESTINATION_PATH / "SKILL.md").read_text(),
            "committed skill\n",
        )
        checked = self.sync_current(check_only=True)
        self.assertEqual(checked.returncode, 0, checked.stderr)

    def test_named_deprecated_skill_prunes_without_source_repo(self) -> None:
        leftover = self.package / "plugins/demo/skills/old-skill"
        leftover.mkdir(parents=True)
        (leftover / "SKILL.md").write_text("stale")
        self.manifest = {
            "skills": {
                "old-skill": {
                    "status": "deprecated",
                    "destinationPath": "plugins/demo/skills/old-skill",
                }
            }
        }
        self.save_manifest()
        result = self.run_sync(["--skill", "old-skill"])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertFalse(leftover.exists())

    def test_current_and_deprecated_cannot_share_a_destination(self) -> None:
        self.manifest["skills"]["old-skill"] = {
            "status": "deprecated",
            "destinationPath": DESTINATION_PATH,
        }
        self.save_manifest()
        result = self.sync_current(check_only=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertRegex(result.stderr, "collides")


if __name__ == "__main__":
    unittest.main()
