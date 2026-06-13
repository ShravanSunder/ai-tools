# Monitor Loop

Use bounded monitoring for asynchronous PR state. Do not babysit forever and do
not claim readiness from the first green state.

## Loop Shape

1. Fetch checks, comments, review threads, mergeability, and PR head SHA.
2. Classify blockers and new events.
3. If blocked, fix/reply/ask/route or report blockers.
4. If all gates first appear clear, wait for one full quiet poll.
5. Re-fetch all gate state.
6. Only then report readiness or proceed to merge authorization checks.

Poll about once per minute unless repo instructions require a different cadence.
Use a bounded timeout. If the window expires, report remaining blockers and
stop.

## Events That Reset Readiness

- new bot comment;
- new human comment;
- new or reopened review thread;
- failed or restarted check;
- merge conflict or unknown mergeability;
- PR head SHA changes;
- local `HEAD` no longer matches PR head.
