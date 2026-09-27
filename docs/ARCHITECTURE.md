# Architecture

## Principles

- Offline-first vertical slice. The app runs end to end with no network and no credentials.
- Service interfaces, not direct SDK calls. Screens depend on interfaces (`AuthService`, `DataService`, `PurchaseService`, `AiService`). Local adapters protect private data; RevenueCat is the production purchase adapter.
- Bounded local recommendations. V1 does not upload private notes or require a model API.
- Strict TypeScript. `strict: true`, no implicit any.

## Layers

```
app/                      Expo Router routes (screens only, thin)
src/
  theme/                  design tokens and styles
  components/             reusable UI (Button, Card, Screen, etc.)
  domain/                 pure logic: check-in, depletion, action engine, safety
  services/
    types.ts              service interfaces + shared DTOs
    ai/                   Local bounded action suggestion adapter
    auth/                 Local profile adapter, no credentials
    data/                 Private on-device data adapter
    purchases/            Preview + production RevenueCat adapters
    index.ts              service container / provider selection
  store/                  app state (context + reducer) and persistence
  content/                static copy, action templates, safety resources
```

## Data flow for the core loop

1. Check-in screen collects Soul, Mind, Body ratings and optional free-text note.
2. `domain/safety` scans the note. If crisis language is detected, the app routes to the safety screen and stops. No action is generated.
3. `domain/depletion` picks the most depleted area from the ratings.
4. `domain/actionEngine` selects an action intent and template based on the depleted area, recent history, and premium status.
5. `AiService.generateAction()` produces a bounded, editable suggestion locally. Private notes do not leave the device.
6. User edits and marks complete. `DataService` persists the check-in, action, and reflection locally.
7. History and connection map read back from `DataService`.

## Service selection

`src/services/index.ts` exposes a single `services` object. Personal data always uses local adapters. Purchases use RevenueCat when a platform SDK key is configured and otherwise use preview data.

## Safety in the pipeline

Safety detection runs before action generation and is a hard gate. It is pure and synchronous so it is trivially testable and cannot be skipped by an async race. The AI adapter also receives a safety flag so a server implementation can refuse to generate normal content.

## Navigation

Expo Router with a root stack. Onboarding and auth are presented before the main tab-less stack. The core loop is a linear flow: home to check-in to action card to preparation to completion, then back to home. History, paywall, and settings are pushed routes.

## State and persistence

Lightweight React context + reducer holds session state. Persistence goes through `DataService`, which in mock mode writes to `AsyncStorage`. Entities are defined in `docs/DATA_MODEL.md`.
