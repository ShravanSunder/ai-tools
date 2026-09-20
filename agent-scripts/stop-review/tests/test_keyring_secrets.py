#!/usr/bin/env python3

import sys
import typing as t
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from keyring_secrets import (
    KeyringSecretError,
    LoadOpRefProps,
    LoadSecretProps,
    PersistOpRefProps,
    ProvisionSecretProps,
    load_op_ref,
    load_secret,
    persist_op_ref,
    provision_secret,
)


class LoadSecretTests(unittest.TestCase):
    def test_load_prefers_env(self) -> None:
        with patch.dict("os.environ", {"OPENROUTER_API_KEY": "from-env"}):
            with patch("keyring_secrets.get_keychain_password") as get_password:
                value = load_secret(
                    LoadSecretProps(
                        service="ai-tools.stop-review",
                        username="openrouter",
                        env_name="OPENROUTER_API_KEY",
                    )
                )
        self.assertEqual(value, "from-env")
        get_password.assert_not_called()

    def test_load_uses_keychain(self) -> None:
        with patch.dict("os.environ", {}, clear=True):
            with patch("keyring_secrets.get_keychain_password", return_value="from-keychain"):
                value = load_secret(
                    LoadSecretProps(
                        service="ai-tools.stop-review",
                        username="openrouter",
                        env_name="OPENROUTER_API_KEY",
                    )
                )
        self.assertEqual(value, "from-keychain")

    def test_load_missing_raises(self) -> None:
        with patch.dict("os.environ", {}, clear=True):
            with patch("keyring_secrets.get_keychain_password", return_value=None):
                with self.assertRaises(KeyringSecretError):
                    load_secret(
                        LoadSecretProps(
                            service="ai-tools.stop-review",
                            username="openrouter",
                            env_name="OPENROUTER_API_KEY",
                        )
                    )


class OpRefTests(unittest.TestCase):
    def test_load_op_ref_prefers_configured(self) -> None:
        ref = load_op_ref(
            LoadOpRefProps(
                op_ref_env="CODEX_STOP_REVIEW_OPENROUTER_OP_REF",
                configured_ref="op://Vault/Item/field",
            )
        )
        self.assertEqual(ref, "op://Vault/Item/field")

    def test_load_op_ref_reads_machine_env(self) -> None:
        machine_env = Path(self.id().replace(".", "-"))
        # use TemporaryDirectory via addCleanup
        from tempfile import TemporaryDirectory

        tmp = TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        path = Path(tmp.name) / "machine.env"
        path.write_text("CODEX_STOP_REVIEW_OPENROUTER_OP_REF=op://Vault/Item/field\n", encoding="utf-8")
        ref = load_op_ref(
            LoadOpRefProps(
                op_ref_env="CODEX_STOP_REVIEW_OPENROUTER_OP_REF",
                machine_env=path,
            )
        )
        self.assertEqual(ref, "op://Vault/Item/field")

    def test_persist_op_ref_writes_mode_600(self) -> None:
        from tempfile import TemporaryDirectory

        tmp = TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        path = Path(tmp.name) / "nested" / "machine.env"
        persist_op_ref(
            PersistOpRefProps(
                machine_env=path,
                op_ref_env="CODEX_STOP_REVIEW_OPENROUTER_OP_REF",
                op_ref="op://Vault/Item/field",
            )
        )
        self.assertEqual(
            path.read_text(encoding="utf-8"),
            "CODEX_STOP_REVIEW_OPENROUTER_OP_REF=op://Vault/Item/field\n",
        )
        self.assertEqual(path.stat().st_mode & 0o777, 0o600)


class ProvisionTests(unittest.TestCase):
    def test_provision_uses_op_stdout_not_argv(self) -> None:
        completed = Mock()
        completed.returncode = 0
        completed.stdout = "test-key\n"
        with patch("keyring_secrets.subprocess.run", return_value=completed) as run:
            with patch("keyring_secrets.set_keychain_password") as set_password:
                provision_secret(
                    ProvisionSecretProps(
                        service="ai-tools.stop-review",
                        username="openrouter",
                        op_ref="op://Vault/Item/field",
                    )
                )
        argv: list[str] = run.call_args.args[0]
        self.assertEqual(argv, ["op", "read", "op://Vault/Item/field"])
        self.assertNotIn("test-key", argv)
        set_password.assert_called_once_with("ai-tools.stop-review", "openrouter", "test-key")

    def test_provision_empty_secret_fails(self) -> None:
        completed = Mock()
        completed.returncode = 0
        completed.stdout = "\n"
        with patch("keyring_secrets.subprocess.run", return_value=completed):
            with patch("keyring_secrets.set_keychain_password") as set_password:
                with self.assertRaises(KeyringSecretError):
                    provision_secret(
                        ProvisionSecretProps(
                            service="ai-tools.stop-review",
                            username="openrouter",
                            op_ref="op://Vault/Item/field",
                        )
                    )
        set_password.assert_not_called()


if __name__ == "__main__":
    unittest.main()
