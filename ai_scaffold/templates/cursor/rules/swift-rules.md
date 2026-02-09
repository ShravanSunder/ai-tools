---
alwaysApply: true
---
# Swift / SwiftUI Rules

## Types

- **No `Any` type** — Always use explicit, narrow types or generics
- **Avoid force unwraps (`!`)** — Use `guard let`, `if let`, or nil coalescing (`??`)
- **Avoid force casts (`as!`)** — Use conditional casts (`as?`) with proper error handling
- **Prefer generics** — Use `<T>`, `<T: SomeProtocol>` for flexible, type-safe functions
- **Use `@Observable` over `ObservableObject`** — Prefer the Observation framework (iOS 17+/macOS 14+)
- **Strict concurrency** — Enable strict concurrency checking, use `Sendable` where required
- For functions with >3 parameters, use a dedicated configuration struct

## Data Models

- **Codable for serialization** — Implement `Codable` for all data transfer types
- **SwiftData for persistence** — Use `@Model` macro for persistent models
- **Value types by default** — Prefer `struct` over `class` unless reference semantics are needed
- **No force unwraps in models** — All optional properties must be safely unwrapped
- Prefer timezone-aware `Date` objects

## Formatting

- Indent code with 4 spaces
- Follow SwiftFormat defaults (configured in `.swiftformat`)
- Maximum line length: 160 characters
- Use trailing closures for single-closure parameters

## SwiftUI Patterns

- **MVVM with @Observable** — Extract business logic into ViewModels using `@Observable`
- **Extract subviews** — Break complex views into smaller, focused subviews
- **`@State` must be `private`** — Always mark `@State` and `@StateObject` properties as `private`
- **Use `@Environment` for shared state** — Prefer environment injection over manual passing
- **Accessibility** — Always add accessibility labels for images and traits for buttons
- **Preview macros** — Use `#Preview` for all views

## Architecture

- **Protocol-oriented design** — Define contracts with protocols, implement with concrete types
- **Dependency injection** — Inject dependencies via initializers or `@Environment`
- **Error handling** — Use typed errors (`enum AppError: Error`) over generic `Error`

## Testing

### Test Setup

- Test framework: **Swift Testing** (`import Testing`)
- Test location: `Tests/` directory following SPM convention
- Use `@Test` macro for test functions
- Use `@Suite` for test organization
- Use **XCTest only** for UI tests (`XCUITest`) and performance tests

### Test Quality

- Follow *Arrange / Act / Assert* comments to structure tests
- *Quality over quantity*: cover critical paths with concise, readable tests
  - Tests should be minimal, valuable and easy to maintain
  - Focus on testing business logic
  - Test critical paths

### Testing Pyramid

- Most tests: Unit tests on ViewModels and business logic
- Some tests: Integration tests for data layer
- Few tests: UI tests only for critical user flows

## Documentation

- Skip return-type sections in docstrings when type annotations suffice
- Write concise, high-impact documentation that explains *why*, not just *what*

## Swift Commands

Do not run random commands for linting and testing. You MUST follow the ones below without any variations.

### Build & Test

- `swift build` to build the project
- `swift test` to run tests

### SwiftLint

- `swiftlint --strict` to run linting

### SwiftFormat

- `swiftformat .` to format code
