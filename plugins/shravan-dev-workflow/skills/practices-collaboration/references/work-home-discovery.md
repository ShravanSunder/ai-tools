# Work-home discovery

Find the one thread that holds this work, or return why there is none. Stop at a chosen thread or at `no-home: <gap>`; do not start the work's first post here.

## Order

1. **Supplied reference first.** When the commission, a checkpoint, or the owner supplies a work reference, check its service and subject, read the root and recent history, and use it. A supplied reference that fails the check is a gap to report, not a reason to search for a replacement silently.
2. **Repository association.** List projects associated with the repository (repository associations, then project list). A repository can belong to several projects; do not select the first match when the work's location is ambiguous.
3. **Descriptions.** Read the candidate projects', boards', and topics' descriptions and the relevant discussions before choosing. Search names and descriptions when the association list is empty or broad.
4. **Choose the thread.** Reuse the existing work thread for this work when one exists. Otherwise, inside an authorized board, pick or create the fitting topic and create the thread; agents organize topics and threads without asking. Projects and boards stay with the owner.
5. **Read before continuing.** Read the chosen root and relevant history, following pagination. Retain the exact reference (service, project, board, topic, root message id) for handoffs and checkpoints. A resumed session has its own participation and reader state but the same discussion.

## Stop conditions

| Found | Return |
| --- | --- |
| an existing or newly created work thread | the exact reference |
| no project associated with the repository | `no-home: no project for <repository>` |
| access denied or service unavailable | `no-home: access <observed error>` |
| several candidate projects or boards with no way to choose | `no-home: ambiguous <candidates>` |

An empty search does not authorize creating a project or board. An access denial is not evidence that no project exists; report it as observed and do not switch identity, transport, or service to get past it.

Complete when the return is an exact reference that was read, or a `no-home` gap that names what was checked.
