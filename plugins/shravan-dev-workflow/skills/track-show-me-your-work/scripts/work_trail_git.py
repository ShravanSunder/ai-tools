import hashlib
import subprocess
import typing as t
from pathlib import Path

from work_trail_models import (  # pyright: ignore[reportImplicitRelativeImport]
    GitIdentity,
)


class GitIdentityError(Exception):
    pass


def run_git(repository: Path, arguments: t.Sequence[str]) -> str:
    try:
        process = subprocess.run(
            ["git", "-C", str(repository), *arguments],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError) as error:
        raise GitIdentityError from error
    return process.stdout.strip()


def discover_git_identity(repository: Path) -> GitIdentity:
    try:
        requested_path = repository.expanduser().resolve(strict=True)
        common_directory = Path(
            run_git(
                requested_path,
                ["rev-parse", "--path-format=absolute", "--git-common-dir"],
            )
        ).resolve(strict=True)
        worktree_path = Path(
            run_git(requested_path, ["rev-parse", "--show-toplevel"])
        ).resolve(strict=True)
        branch_output = run_git(
            requested_path, ["symbolic-ref", "--quiet", "--short", "HEAD"]
        )
        branch = branch_output or "detached"
    except GitIdentityError:
        head = run_git(repository.expanduser(), ["rev-parse", "--verify", "HEAD"])
        if not head:
            raise GitIdentityError
        requested_path = repository.expanduser().resolve(strict=True)
        common_directory = Path(
            run_git(
                requested_path,
                ["rev-parse", "--path-format=absolute", "--git-common-dir"],
            )
        ).resolve(strict=True)
        worktree_path = Path(
            run_git(requested_path, ["rev-parse", "--show-toplevel"])
        ).resolve(strict=True)
        branch = "detached"
    except (OSError, RuntimeError) as error:
        raise GitIdentityError from error

    repo_id = hashlib.sha256(str(common_directory).encode("utf-8")).hexdigest()
    return GitIdentity(
        repo_id=repo_id,
        repo_path=str(common_directory.parent.resolve()),
        worktree_path=str(worktree_path),
        branch=branch,
    )
