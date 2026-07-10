# Monitor Loop

Use bounded, API-budget aware monitoring for asynchronous PR state. Do not
babysit forever and do not claim readiness from the first green state.

## Loop Shape

1. Fetch checks, comments, review threads, mergeability, and PR head SHA.
2. Classify blockers and new events.
3. If blocked, fix/reply/ask/route or report blockers.
4. If all gates first appear clear, wait for one full quiet poll.
5. Re-fetch all gate state.
6. Only then report readiness or proceed to merge authorization checks.

## Delegated Monitoring

A Mini Operator Delegate may perform the loop's observation steps: fetch and
classify state, wait for the bounded quiet interval, and re-fetch. It
replaces the loop's action and readiness steps with decision packets to the
main agent. Use `manage-agents` for its pattern, assignment route, model,
packet, receipt, and decision boundary.

The monitor may fetch and classify checks, comments, thread state,
mergeability, rate limits, and head SHA. It must not reply to comments, change
code, resolve disputes, declare readiness, or merge. When the next action needs
judgment, a code change, disputed-review handling, scope change, or merge
authorization, it sends the main agent a decision packet and then waits,
continues read-only monitoring, or stops exactly as its packet permits.

Completion: delegated monitoring returns assignment-bound state evidence, and
every authority-bearing action remains with the main agent.

Default cadence for general checks/comments/review-state monitoring is about 2
minutes. Use 30-60 seconds only for short active windows, such as a fresh push,
checks starting, or quiet-poll confirmation. Use a bounded timeout. If the
window expires, report remaining blockers and stop.

## API Budget

Use cheap probes before expensive snapshots:

- REST first where it is sufficient for checks, PR metadata, comments, reviews,
  and timestamps.
- Conditional REST requests with saved `ETag`/`If-None-Match` or
  `Last-Modified`/`If-Modified-Since` where the endpoint supports them.
- Serialized requests; do not run concurrent GitHub polling loops.
- GraphQL only for narrow state REST cannot provide, especially review-thread
  resolution and unresolved thread node IDs.
- Persist small cursor state: last head SHA, latest relevant timestamps,
  unresolved thread IDs, check conclusions, mergeability, ETags, and
  `x-ratelimit-*` headers.
- If `Retry-After` is present, wait that long. If `x-ratelimit-remaining` is
  `0`, calculate the wait duration from the `x-ratelimit-reset` epoch timestamp
  minus the current time. For secondary-limit responses without a reset time,
  stop or back off for at least one minute before retrying.

GitHub references:

- REST best practices:
  https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api
- REST rate limits:
  https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- GraphQL rate limits:
  https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api

## Events That Reset Readiness

- new bot comment;
- new human comment;
- new or reopened review thread;
- failed or restarted check;
- merge conflict or unknown mergeability;
- PR head SHA changes;
- local `HEAD` no longer matches PR head.

Rate-limit resets and secondary-limit boundaries are API-budget events, not PR
readiness events. They can invalidate or bypass cached proof and force backoff,
but they do not reset readiness unless a PR lifecycle state also changed.

## Readiness From Cache

Cached state reduces polling cost; it does not replace readiness proof. Final
readiness needs either a fresh authoritative fetch for every gate, or a
validated `304 Not Modified` response against same-key cached payload that is
current for the PR head and exact request identity, including query parameters,
pagination, representation headers, and GraphQL variables/cursors.

When a rate-limit boundary is reached, invalidate or bypass affected cached
proof as needed, wait/back off according to GitHub headers, then re-establish
the final proof path. Do not treat the rate-limit boundary itself as a PR
comment, check, thread, mergeability, or head-SHA readiness reset.
