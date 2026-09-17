# Agent Router 0.7.2

- Updates the committed `agent-collaboration` skill copy to codex-router v0.1.28 (`788be52`), recorded as a full-SHA pin in `plugin-sources.json`.
- Board: adds the `implementer` participant role and topic-scoped listen alongside named and watched threads.
- Listen: adds `--lifetime short|long`, `--deliver session` for Codex session delivery, and `listen show` / `listen cancel` by listen id.
- Sessions: adds `--access write-restricted|workspace-write`, `--root-message-id` shared scratch, and `--approver` for client approval authority.
- Sessions: model and effort are chosen at creation; resume and fork may omit them and inherit the thread's persisted values.
- Discovery: adds `session rename` and scoped `sessions list` with an explicit scope and source, plus the `result.record` envelope and the Router delivery header.
- The committed copy is the codex-router v0.1.28 (`788be52`) skill plus the ai-tools-owned `agents/openai.yaml` Codex display block ("Collaboration: Agents"), which upstream does not carry.
- Updates Codex and Claude plugin manifests and Claude marketplace metadata to 0.7.2; the Codex marketplace entry pins no version.
- Validation: `claude plugin validate .` passed; `diff -r` against the pinned source tree differs only by the ai-tools-owned `agents/openai.yaml`.
- Refresh/reinstall status: pending owner.
