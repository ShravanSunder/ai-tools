# Ticket Templates

Templates for well-formed tickets following the docs-are-truth, tickets-are-tracking paradigm.

## Standard Task Ticket

Based on real example (LUNA-336):

```markdown
## Title: JSON-RPC command channel

## Description:

Complete the bridge with bidirectional typed commands. After this, any React
panel can push state, pull data, and send commands to Swift.

## What already exists from LUNA-335 branch

RPCRouter already has:
* Basic dispatch to registered handlers
* `__commandId` dedup via sliding window
* Batch array rejection (-32600)
* Method not found (-32601)
* Parse error (-32700)
* `bridge.ready` handler registration

## Scope

**Typed RPC infrastructure (§9.2)**

* [ ] `RPCMethod` protocol with associated `Params: Decodable` type
* [ ] Type-erased handler wrapper for typed method registration
* [ ] Replace untyped handlers with typed `RPCMethod` conformances
* [ ] Update RPCRouter registration to accept typed methods

**Method namespaces (§5.2)**

* [ ] Method definitions for `diff.*`, `review.*`, `agent.*`, `system.*`

**Error handling completeness (§5.3)**

* [ ] Invalid params error (-32602)
* [ ] Internal error (-32603)
* [ ] EmptyParams path
* [ ] Notification with no `id` → verify NO response generated

**Command acknowledgment and response**

* [ ] commandAck via state stream push
* [ ] Direct-response path: request → response via CustomEvent
* [ ] JS-side command sender with UUID

## Deferred (not in scope for this ticket)

* JS command sender requires web app to exist (LUNA-338)
* commandAck push requires `pushJSON` wiring (LUNA-337/338)
* Async command handlers — sync handlers sufficient for now

## Design doc references

* §5 Protocol Layer — JSON-RPC 2.0 format, method namespaces, error codes
* §5.1 Commands — commandId, optimistic mutation contract
* §5.2 Method Namespaces — diff.*, review.*, agent.*, system.*
* §5.3 Standard Error Codes — -32700 through -32603
* §9.2 RPC Router — method registry, dispatch, type-erased handlers
* §13 Phase 3 exit criteria
```

### Key patterns in this template

1. **Title is a concept** — "JSON-RPC command channel", not "implement typed RPC handlers"
2. **Prior art acknowledged** — what already exists from earlier work
3. **Scope grouped by doc section** — each group references the architecture doc section it implements
4. **Checklists for implementation steps** — not sub-tasks, just markdown checkboxes
5. **Deferred items are explicit** — what's NOT in scope, why, and which ticket covers it
6. **Doc section references** — precise section markers (`§5.2`, `§9.2`) that link to the architecture doc

## Minimal Task Ticket

For simpler deliverables that don't need extensive scope breakdown:

```markdown
## Title: Merge transport + push pipeline from rpc-webview-system

## Description:

Cherry-pick and integrate the transport layer and push pipeline from the
rpc-webview-system branch. This establishes the foundation for all subsequent
bridge work.

## Scope

* [ ] Cherry-pick WebViewTransport implementation
* [ ] Cherry-pick push pipeline (state stream + callJavaScript bridge)
* [ ] Resolve merge conflicts with current main
* [ ] Verify existing tests pass

## Design doc references

* §4 Transport Layer — WebViewTransport, message routing
* §6 State Stream — pushJSON, state serialization
```

## Milestone Description

Milestones are brief — just enough to explain the phase:

```markdown
## Name: Bridge Infrastructure

## Description:

Transport layer, push pipeline, and RPC router. Foundation that all
UI features build on. Completes the bidirectional communication path
between Swift and React.

## Issues:
- LUNA-335: Merge transport + push pipeline
- LUNA-336: JSON-RPC command channel
- LUNA-337: Domain models + content delivery pipeline
```

## Project Setup Ticket (bootstrapping)

When a project needs initial setup:

```markdown
## Title: Project setup and architecture doc

## Description:

Create the project structure, architecture document, and initial
milestone/ticket breakdown.

## Scope

* [ ] Create `docs/architecture/project-name.md` with design
* [ ] Create Linear project
* [ ] Create milestones for each phase
* [ ] Create initial tickets with dependencies
* [ ] Verify dependency graph is acyclic

## Notes

This ticket is the bootstrap — it creates the work plan that all
other tickets reference.
```

## Anti-patterns

### Too much detail in the ticket (duplicates the doc)

```markdown
## BAD: Title: Implement WebViewTransport

The WebViewTransport class manages the WKWebView lifecycle. It initializes
the web view with a WKWebViewConfiguration that includes a userContentController
for handling JavaScript messages. The transport implements the
WKScriptMessageHandler protocol to receive messages from JavaScript via
window.webkit.messageHandlers.bridge.postMessage(). Messages are decoded
from JSON using a JSONDecoder with .convertFromSnakeCase key decoding strategy...

[500 more words of implementation detail]
```

**Why it's bad:** This duplicates the architecture doc. When implementation changes, the ticket becomes stale. The architecture doc gets updated; the ticket doesn't.

**Fix:** Reference the doc section instead:

```markdown
## GOOD: Title: WebView transport layer

Implement the transport layer per §4 Transport Layer. Handles WKWebView
lifecycle, message routing, and JavaScript bridge.

* [ ] WebViewTransport with WKScriptMessageHandler
* [ ] Message decoding pipeline
* [ ] JavaScript injection for bridge setup

Design doc: §4 Transport Layer
```

### Implementation step as a ticket title

```markdown
## BAD:
- Ticket: "Add -32602 invalid params error"
- Ticket: "Create RPCMethod protocol"
- Ticket: "Register diff.* namespace methods"
```

**Why it's bad:** These are implementation steps, not deliverables. They can't be independently verified as "done" in a meaningful way.

**Fix:** One ticket for the concept:

```markdown
## GOOD:
- Ticket: "JSON-RPC command channel"
  - [ ] RPCMethod protocol
  - [ ] Error handling (-32602, -32603)
  - [ ] Method namespace definitions
```

### Missing deferred items

```markdown
## BAD: (nothing about what's NOT in scope)
```

**Why it's bad:** Without explicit deferral, scope creeps silently. An agent working on the ticket might implement deferred items, or a reviewer might flag them as missing.

**Fix:** Always include a "Deferred" section, even if it's just "None — this ticket is self-contained."
