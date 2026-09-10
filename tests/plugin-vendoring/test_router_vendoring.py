"""Real Git/filesystem coverage for pinned skill vendoring."""

import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = (
    Path(__file__).resolve().parents[2]
    / "agent-scripts/plugin-vendoring/sync-router-skills.py"
)
spec = importlib.util.spec_from_file_location("router_vendoring", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class RouterVendoringTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.source = self.root / "source"
        self.package = self.root / "package"
        self.source.mkdir()
        self.package.mkdir()
        self.original_root = module.REPO_ROOT
        self.addCleanup(setattr, module, "REPO_ROOT", self.original_root)
        module.REPO_ROOT = self.package
        self.git("init", "-q")
        self.skill = self.source / module.SOURCE_PATH / "SKILL.md"
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
        self.manifest = {
            "codex-router": {
                "commit": self.pin,
                "sourcePath": module.SOURCE_PATH,
                "destinationPath": module.DESTINATION_PATH,
            }
        }
        self.save_manifest()

    def git(self, *args):
        return subprocess.check_output(["git", "-C", str(self.source), *args])

    def save_manifest(self):
        (self.package / "plugin-sources.json").write_text(json.dumps(self.manifest))

    def test_sync_uses_commit_and_check_detects_drift_without_writing(self):
        self.skill.write_text("dirty source\n")
        module.sync_skills(self.source, False)
        output = self.package / module.DESTINATION_PATH / "SKILL.md"
        self.assertEqual(output.read_text(), "committed skill\n")
        module.sync_skills(self.source, True)
        output.write_text("changed copy\n")
        with self.assertRaisesRegex(ValueError, "differs"):
            module.sync_skills(self.source, True)
        self.assertEqual(output.read_text(), "changed copy\n")

    def test_symlink_destination_cannot_write_outside_package(self):
        outside = self.root / "outside"
        outside.mkdir()
        (self.package / "plugins").symlink_to(outside, target_is_directory=True)
        with self.assertRaisesRegex(ValueError, "symlinks"):
            module.sync_skills(self.source, False)
        self.assertEqual(list(outside.iterdir()), [])

    def test_invalid_pin_leaves_destination_untouched(self):
        self.manifest["codex-router"]["commit"] = "main"
        self.save_manifest()
        with self.assertRaisesRegex(ValueError, "complete lowercase"):
            module.sync_skills(self.source, False)
        self.assertFalse((self.package / "plugins").exists())

    def test_sync_removes_stale_owned_files_preserving_siblings(self):
        module.sync_skills(self.source, False)
        target = self.package / module.DESTINATION_PATH
        (target / "obsolete.md").write_text("old")
        sibling = target.parent / "other-skill"
        sibling.mkdir()
        (sibling / "SKILL.md").write_text("keep")
        module.sync_skills(self.source, False)
        self.assertFalse((target / "obsolete.md").exists())
        self.assertEqual((sibling / "SKILL.md").read_text(), "keep")


if __name__ == "__main__":
    unittest.main()
