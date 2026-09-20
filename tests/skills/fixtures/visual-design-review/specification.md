# Specification

The system MUST return `accepted`, `rejected`, or `indeterminate` for an admission request. On timeout it MUST return `indeterminate` and MUST NOT promise an automatic retry.

The system remains opaque to the consumer.
