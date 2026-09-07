import typing as t
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field, field_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)


class EventPayloadFields(StrictModel):
    decision: str
    why: str
    evidence: t.List[str]
    result: str
    detail: str | None = None
    supersedes: str | None = None

    @field_validator("decision", "why", "result")
    @classmethod
    def require_nonempty_text(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("field must not be empty")
        return value

    @field_validator("evidence")
    @classmethod
    def require_text_evidence(cls, values: t.List[str]) -> t.List[str]:
        if any(not value.strip() for value in values):
            raise ValueError("evidence entries must not be empty")
        return values


class AppendPayload(EventPayloadFields):
    phase: str

    @field_validator("phase")
    @classmethod
    def require_nonempty_phase(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("field must not be empty")
        return value


class FinishPayload(EventPayloadFields):
    phase: t.Literal["finish"] = "finish"


class GitIdentity(StrictModel):
    repo_id: str
    repo_path: str
    worktree_path: str
    branch: str


class RunMetadata(StrictModel):
    schema_version: t.Literal[1] = 1
    run_id: str
    created_at: str
    repo_id: str
    repo_path: str
    initial_worktree_path: str
    initial_branch: str
    session_id: str
    session_provenance: t.Literal["provided", "generated"]


class StoredEvent(StrictModel):
    schema_version: t.Literal[1] = 1
    event_id: str = Field(pattern=r"^event-[0-9]{6}$")
    timestamp: str
    repo_id: str
    repo_path: str
    worktree_path: str
    branch: str
    session_id: str
    session_provenance: t.Literal["provided", "generated"]
    run_id: str
    phase: str
    decision: str
    why: str
    evidence: t.List[str]
    result: str
    detail: str | None = Field(default=None, pattern=r"^details/event-[0-9]{6}\.md$")
    supersedes: str | None = Field(default=None, pattern=r"^event-[0-9]{6}$")


class AppendEventProps(StrictModel):
    trail: Path
    repository: Path
    payload: AppendPayload | FinishPayload
    finish: bool = False

    model_config = ConfigDict(extra="forbid", frozen=True, arbitrary_types_allowed=True)


class TrailPaths(StrictModel):
    trail: Path
    metadata: Path
    events: Path
    details: Path
    lock: Path
    view: Path

    model_config = ConfigDict(extra="forbid", frozen=True, arbitrary_types_allowed=True)
