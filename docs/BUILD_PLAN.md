# Build Plan

Deadline: September 30, 2026. Target: polished working app, store build, demo video under two minutes, screenshots, icon, store link, RevenueCat project ID, and judge trial or promo access.

## Milestone 0: Planning and scaffold (this pass)
- Planning docs.
- Expo + TypeScript + Expo Router scaffold, strict TS, lint, test setup.

## Milestone 1: Offline-first vertical slice (this pass)
- Design system: theme and core components.
- Domain logic: check-in, depletion, action engine, safety routing.
- Service interfaces with mock adapters (AI, Auth, Data, Purchases).
- Local persistence and app state.
- All screens for the core loop wired end to end.
- Tests for action engine and safety routing.
- Typecheck, lint, test green.

## Milestone 2: Real purchases (credential-dependent)
- RevenueCat project, entitlement `premium`, offering, and Google Play products.
- RevenueCat production adapter selected by platform SDK key.
- Development build for testing real Google Play purchases.
- Personal wellbeing data remains local and requires no backend.

## Milestone 3: Store readiness
- App icon and splash.
- iOS and Android build config via EAS.
- Store listings, screenshots, privacy nutrition labels, data safety form.
- Internal testing builds.

## Milestone 4: Submission package
- Public demo video under two minutes.
- Screenshots and icon.
- Store link.
- RevenueCat project ID.
- Judge trial or promo access.

## Quality gates every pass
- `npm run typecheck`
- `npm run lint`
- `npm run test`

## Risks and mitigations
- AI safety false positives or negatives: keep detection conservative, test it, keep human-editable output, never auto-send.
- Store review of wellbeing claims: avoid clinical language, clear non-therapy disclaimer.
- RevenueCat product setup delays: build paywall against the interface early so wiring is a config change.
