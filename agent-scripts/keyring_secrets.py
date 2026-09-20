#!/usr/bin/env python3

"""Shared macOS Keychain helper for agent-scripts.

Identity is service (namespace) plus username (secret name). Load order is
process env, then Keychain. Provision reads 1Password into memory and stores
it with Security.framework. Stdlib only. Never put the resolved secret in argv.
Never call provision from a Stop hook.
"""

import argparse
import ctypes
import os
import stat
import subprocess
import sys
import typing as t
from dataclasses import dataclass
from pathlib import Path

SECURITY_FRAMEWORK = "/System/Library/Frameworks/Security.framework/Security"
SECURITY_BIN = "/usr/bin/security"


class KeyringSecretError(RuntimeError):
    pass


@dataclass(frozen=True)
class LoadSecretProps:
    service: str
    username: str
    env_name: str | None = None


@dataclass(frozen=True)
class LoadOpRefProps:
    op_ref_env: str
    configured_ref: str | None = None
    machine_env: Path | None = None


@dataclass(frozen=True)
class PersistOpRefProps:
    machine_env: Path
    op_ref_env: str
    op_ref: str


@dataclass(frozen=True)
class ProvisionSecretProps:
    service: str
    username: str
    op_ref: str


@dataclass(frozen=True)
class ProvisionCliProps:
    service: str
    username: str
    op_ref_env: str
    op_ref: str | None = None
    machine_env: Path | None = None


def get_keychain_password(service: str, username: str) -> str | None:
    completed = subprocess.run(
        [SECURITY_BIN, "find-generic-password", "-s", service, "-a", username, "-w"],
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        return None
    value = completed.stdout.rstrip("\n")
    return value or None


def set_keychain_password(service: str, username: str, password: str) -> None:
    subprocess.run(
        [SECURITY_BIN, "delete-generic-password", "-s", service, "-a", username],
        check=False,
        capture_output=True,
        text=True,
    )
    security = ctypes.cdll.LoadLibrary(SECURITY_FRAMEWORK)
    service_b = service.encode()
    username_b = username.encode()
    password_b = password.encode()
    status = int(
        security.SecKeychainAddGenericPassword(
            None,
            len(service_b),
            service_b,
            len(username_b),
            username_b,
            len(password_b),
            password_b,
            None,
        )
    )
    if status != 0:
        raise KeyringSecretError("keychain write failed")


def load_secret(props: LoadSecretProps) -> str:
    if props.env_name:
        from_env = os.environ.get(props.env_name, "").strip()
        if from_env:
            return from_env
    stored = get_keychain_password(props.service, props.username)
    if stored:
        return stored
    raise KeyringSecretError(f"missing secret {props.service}/{props.username}")


def read_machine_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        values[name.strip()] = value.strip().strip("'").strip('"')
    return values


def load_op_ref(props: LoadOpRefProps) -> str | None:
    configured = (props.configured_ref or "").strip() or os.environ.get(props.op_ref_env, "").strip()
    if configured:
        return configured
    if props.machine_env is None:
        return None
    value = read_machine_env(props.machine_env).get(props.op_ref_env, "").strip()
    return value or None


def persist_op_ref(props: PersistOpRefProps) -> None:
    values = read_machine_env(props.machine_env)
    values[props.op_ref_env] = props.op_ref
    props.machine_env.parent.mkdir(parents=True, exist_ok=True)
    rendered = "".join(f"{name}={value}\n" for name, value in values.items())
    props.machine_env.write_text(rendered, encoding="utf-8")
    props.machine_env.chmod(stat.S_IRUSR | stat.S_IWUSR)


def provision_secret(props: ProvisionSecretProps) -> None:
    completed = subprocess.run(
        ["op", "read", props.op_ref],
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        raise KeyringSecretError("op read failed")
    value = completed.stdout.strip()
    if not value:
        raise KeyringSecretError("1Password returned an empty secret")
    set_keychain_password(props.service, props.username, value)


def parse_provision_args(argv: list[str] | None = None) -> ProvisionCliProps:
    parser = argparse.ArgumentParser(description="Provision a namespaced Keychain secret from 1Password")
    parser.add_argument("--provision", action="store_true", required=True)
    parser.add_argument("--service", required=True)
    parser.add_argument("--username", required=True)
    parser.add_argument("--op-ref-env", required=True)
    parser.add_argument("--op-ref", default="")
    parser.add_argument("--machine-env", default="")
    args = parser.parse_args(argv)
    machine_env = Path(args.machine_env) if args.machine_env.strip() else None
    op_ref = args.op_ref.strip() or None
    return ProvisionCliProps(
        service=args.service,
        username=args.username,
        op_ref_env=args.op_ref_env,
        op_ref=op_ref,
        machine_env=machine_env,
    )


def main(argv: list[str] | None = None) -> int:
    cli = parse_provision_args(argv)
    ref = load_op_ref(
        LoadOpRefProps(
            op_ref_env=cli.op_ref_env,
            configured_ref=cli.op_ref,
            machine_env=cli.machine_env,
        )
    )
    if ref is None:
        print(f"skip keyring: no op ref for {cli.service}/{cli.username}", file=sys.stderr)
        return 0
    provision_secret(
        ProvisionSecretProps(service=cli.service, username=cli.username, op_ref=ref)
    )
    if cli.machine_env is not None:
        persist_op_ref(
            PersistOpRefProps(
                machine_env=cli.machine_env,
                op_ref_env=cli.op_ref_env,
                op_ref=ref,
            )
        )
    print(f"provisioned keyring {cli.service}/{cli.username}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
