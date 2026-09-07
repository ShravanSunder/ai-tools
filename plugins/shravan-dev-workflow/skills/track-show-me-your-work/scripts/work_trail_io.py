import contextlib
import fcntl
import os
import secrets
import time
import typing as t
from pathlib import Path

from work_trail_models import (  # pyright: ignore[reportImplicitRelativeImport]
    TrailPaths,
)

LOCK_TIMEOUT_SECONDS = 3.0
SAFE_FILE_FLAGS = getattr(os, "O_NOFOLLOW", 0)


class TrailError(Exception):
    code: str

    def __init__(self, code: str) -> None:
        super().__init__(code)
        self.code = code


def default_root() -> Path:
    return Path.home() / "dev/memory-logs/work-trails"


def require_no_symlink(path: Path) -> None:
    current = path
    while True:
        if (current.exists() or current.is_symlink()) and current.is_symlink():
            raise TrailError("unsafe_path")
        if current == current.parent:
            return
        current = current.parent


def prepare_root(root: Path, *, create: bool) -> Path:
    expanded = root.expanduser().absolute()
    require_no_symlink(expanded)
    if create:
        expanded.mkdir(mode=0o700, parents=True, exist_ok=True)
        os.chmod(expanded, 0o700)
    elif not expanded.is_dir():
        raise TrailError("trail_root_not_found")
    return expanded.resolve(strict=True)


def ensure_within_root(path: Path, root: Path) -> Path:
    requested = path.expanduser()
    if not requested.is_absolute():
        requested = Path.cwd() / requested
    lexical = requested.absolute()
    try:
        lexical.relative_to(root)
    except ValueError as error:
        raise TrailError("unsafe_path") from error
    require_no_symlink(lexical)
    try:
        resolved = lexical.resolve(strict=True)
    except OSError as error:
        raise TrailError("trail_not_found") from error
    try:
        resolved.relative_to(root)
    except ValueError as error:
        raise TrailError("unsafe_path") from error
    return resolved


def open_directory_component(parent_descriptor: int, component: str) -> int:
    if component in {"", ".", ".."} or "/" in component:
        raise TrailError("unsafe_path")
    try:
        return os.open(
            component,
            os.O_RDONLY | os.O_DIRECTORY | SAFE_FILE_FLAGS,
            dir_fd=parent_descriptor,
        )
    except OSError as error:
        raise TrailError("unsafe_path") from error


@contextlib.contextmanager
def pinned_directory(root: Path, target: Path) -> t.Iterator[int]:
    try:
        relative = target.relative_to(root)
        descriptor = os.open(root, os.O_RDONLY | os.O_DIRECTORY | SAFE_FILE_FLAGS)
    except (OSError, ValueError) as error:
        raise TrailError("unsafe_path") from error
    try:
        for component in relative.parts:
            child_descriptor = open_directory_component(descriptor, component)
            os.close(descriptor)
            descriptor = child_descriptor
        yield descriptor
    finally:
        os.close(descriptor)


def open_private(
    path: Path,
    flags: int,
    *,
    mode: int = 0o600,
    directory_descriptor: int | None = None,
) -> int:
    try:
        target: str | Path = path.name if directory_descriptor is not None else path
        descriptor = os.open(
            target,
            flags | SAFE_FILE_FLAGS,
            mode,
            dir_fd=directory_descriptor,
        )
        if flags & os.O_CREAT:
            os.fchmod(descriptor, mode)
        return descriptor
    except OSError as error:
        raise TrailError("filesystem_access_failed") from error


@contextlib.contextmanager
def exclusive_lock(
    paths: TrailPaths, trail_descriptor: int | None = None
) -> t.Iterator[None]:
    descriptor = open_private(
        paths.lock,
        os.O_CREAT | os.O_RDWR,
        directory_descriptor=trail_descriptor,
    )
    deadline = time.monotonic() + LOCK_TIMEOUT_SECONDS
    try:
        while True:
            try:
                fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
                break
            except BlockingIOError:
                if time.monotonic() >= deadline:
                    raise TrailError("lock_timeout")
                time.sleep(0.05)
        yield
    finally:
        with contextlib.suppress(OSError):
            fcntl.flock(descriptor, fcntl.LOCK_UN)
        os.close(descriptor)


def write_exclusive(
    path: Path, content: bytes, directory_descriptor: int | None = None
) -> None:
    descriptor = open_private(
        path,
        os.O_CREAT | os.O_EXCL | os.O_WRONLY,
        directory_descriptor=directory_descriptor,
    )
    try:
        with os.fdopen(descriptor, "wb", closefd=False) as file_handle:
            file_handle.write(content)
            file_handle.flush()
            os.fsync(file_handle.fileno())
    except OSError as error:
        raise TrailError("filesystem_write_failed") from error
    finally:
        os.close(descriptor)


def replace_private(
    path: Path, content: bytes, directory_descriptor: int | None = None
) -> None:
    temporary = path.parent / f".{path.name}.{secrets.token_hex(6)}.tmp"
    write_exclusive(temporary, content, directory_descriptor)
    try:
        if directory_descriptor is None:
            os.replace(temporary, path)
            os.chmod(path, 0o600)
        else:
            os.rename(
                temporary.name,
                path.name,
                src_dir_fd=directory_descriptor,
                dst_dir_fd=directory_descriptor,
            )
            os.chmod(path.name, 0o600, dir_fd=directory_descriptor)
            os.fsync(directory_descriptor)
    except OSError as error:
        with contextlib.suppress(OSError):
            if directory_descriptor is None:
                temporary.unlink()
            else:
                os.unlink(temporary.name, dir_fd=directory_descriptor)
        raise TrailError("filesystem_write_failed") from error


def read_private(path: Path, directory_descriptor: int | None = None) -> bytes:
    descriptor = open_private(
        path, os.O_RDONLY, directory_descriptor=directory_descriptor
    )
    try:
        with os.fdopen(descriptor, "rb", closefd=False) as file_handle:
            return file_handle.read()
    except OSError as error:
        raise TrailError("filesystem_read_failed") from error
    finally:
        os.close(descriptor)
