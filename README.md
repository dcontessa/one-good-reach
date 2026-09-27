# One Good Reach

One Good Reach turns a quick emotional check-in into one small, achievable action that helps someone reconnect with a person who matters. Technology supports the moment without replacing the relationship.

Built for RevenueCat Shipaton 2026. Target prize fit: Peace Prize (primary), Design and HAMM (secondary).

## What it does

1. A short Soul, Mind, Body check-in.
2. Identifies which area feels depleted.
3. Suggests one safe action that takes about five minutes.
4. Helps the user reconnect with a real person through gratitude, checking in, making an invitation, asking for support, or preparing a repair.
5. Lets the user mark the action complete and privately reflect.
6. Builds a private connection map and simple pattern insights over time.

This is a wellbeing and relationship-support tool. It is not therapy, diagnosis, crisis care, or an AI companion.

## Tech stack

- Expo (React Native) + TypeScript (strict)
- Expo Router (file-based navigation)
- AsyncStorage for private, on-device check-ins and reflections
- RevenueCat (`react-native-purchases`) for subscriptions
- A bounded local recommendation engine with a safety gate

## Current status: offline-first vertical slice

The relationship loop runs fully offline. Personal check-ins, labels, messages, and reflections stay on the device. RevenueCat is the only required network service and activates when a platform SDK key is configured.

## Getting started

```bash
npm install
npm run start      # Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
```

Quality gates:

```bash
npm run typecheck
npm run lint
npm run test
```

## Configuration

Copy `.env.example` to `.env` and add the RevenueCat public SDK key for the target platform. The app runs in purchase-preview mode without a key.

```bash
cp .env.example .env
```

No secrets are committed to this repository. RevenueCat platform SDK keys are public client configuration, not secret API keys.

## Documentation

- `docs/PRODUCT.md` product spec, scope, monetization
- `docs/ARCHITECTURE.md` app structure, service interfaces, data flow
- `docs/DATA_MODEL.md` entities and storage
- `docs/SAFETY.md` safety, privacy, and crisis handling
- `docs/BUILD_PLAN.md` milestones toward store submission

## Scope

V1 is frozen to the core loop and screens described in `docs/PRODUCT.md`. Out of scope: community feed, public profiles, open-ended AI companion chat, large content library, complex streak mechanics, address-book access, automatic message sending.
