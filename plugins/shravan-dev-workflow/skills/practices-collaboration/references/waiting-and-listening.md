# Waiting and listening

Wait only on a real dependency, through the path that delivers it. While independent useful work remains, do that work instead.

## Choose the waiting path

| Dependency | Path |
| --- | --- |
| Board activity or a reply in a separate conversation | Arm the supported listener for the exact thread once, retain its identity, report it active, and yield. Session-delivered notifications need no additional wait call. When session delivery is unavailable, use a bounded process or call wait on that listener. |
| A future event, deadline, or follow-up | Save an authorized wake to the existing recipient, retaining the recipient, expiry, and saved wake id. A wake schedules a later turn; it is not a passive wait. |
| An owner decision | Record the checkpoint on the work thread and yield. |

For a separate conversation without a board listener, use its supported reply or event notification or an authorized wake, or report the capability gap. A Claude background command counts only when the host also delivers a native completion notification; `&` alone does not wake anyone. When a supported listener exists, do not substitute periodic wakes or list polls.

When a collaborator still owns remaining work and you have nothing independent left, keep the armed listener or save one authorized wake, then say in the stop text that it is active or saved. A stop-review hook cannot see the tool call, so the stop text is the evidence.

## While waiting

Watching selects future activity; listening delivers it. Neither shows that the recipient understood or finished anything. Activity is batched and debounced, so a short silence is not a failure, and a heartbeat needs no action.

Process received activity before acknowledging its exact scope. Fetching a page, receiving a batch, and acknowledging it are separate steps. Your own posts and the watch start boundary change what appears unread; use history for older context.

| Red flag | Required action |
| --- | --- |
| "just a quick check"; "the reply is probably in by now"; "one more list won't hurt" | Do not list, inspect, or fetch only to look for a reply. Keep the active wait; re-arm only after it ends and waiting is still required. |
| stopping while a collaborator owns remaining work, with no saved wake or armed listener reported | Save the wake or keep the listener, say so, then yield. Do not inspect the other session to keep this conversation alive. |
| a second listener for the same dependency | Keep the first; cancel the duplicate. |

## When the wait ends

After a listener finalizes, read its reason and any delivery rejection before deciding to re-arm. On an empty timeout, re-arm only when the deadline and assignment still warrant it. A timeout or cancelled wait does not show that the other agent stopped. Checking liveness after a dropped wait, or reading failure and recovery evidence, is a valid reason to inspect.

On resumption, cancel or adjust an obsolete wake and cancel a listener whose dependency ended. This does not change a reminder cadence the owner asked for.

A blocked wait process generates no model tokens, but each wake and each model-driven poll is a real turn that reprocesses context. Do not call waiting free, and do not claim every call costs the same.

Complete when the dependency has an armed listener, a saved wake, a recorded owner checkpoint, received activity that was processed, or an exact capability gap, and the stop text says which.
