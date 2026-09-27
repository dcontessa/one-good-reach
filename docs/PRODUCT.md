# Product Spec: One Good Reach

## Pitch

One Good Reach turns a quick emotional check-in into one small, achievable action that helps someone reconnect with a person who matters. It uses AI to strengthen real relationships, not replace them.

The product should feel like a quiet daily ritual. Calm, warm, private, and adult.

## Positioning

This is a wellbeing and relationship-support tool. It is not therapy, diagnosis, crisis care, or an AI companion. We avoid clinical claims. AI outputs are bounded, editable, and framed as suggestions.

## Core loop (V1)

1. Short Soul, Mind, Body check-in.
2. Identify which area feels most depleted.
3. Suggest one safe action that takes about five minutes.
4. Reconnect with a real person through one of five intents:
   - Gratitude
   - Checking in
   - Making an invitation
   - Asking for support
   - Preparing a repair
5. Mark the action complete and privately reflect.
6. Build a private connection map and simple pattern insights over time.

## Screens (V1)

- Welcome and concise onboarding
- Sign in or continue in a demo-friendly guest mode
- Home with today's check-in
- Soul, Mind, Body check-in flow
- Recommended action card with why it was chosen
- Action preparation screen with editable message suggestion (never sends automatically)
- Completion and reflection
- Private history and connection map
- Premium paywall using RevenueCat
- Settings: privacy, safety, account deletion entry point, subscription restore

## Monetization

Powered by RevenueCat. At least one real in-app purchase (a Premium subscription).

### Free
- Daily check-in
- One recommended action
- Basic reflection and recent history

### Premium
- Personalized journeys
- Deeper pattern insights
- Difficult-conversation preparation
- Relationship-specific plans
- Multilingual content

### Never paywalled
- Essential safety information
- The user's basic journal history

## Content and tone rules

- Calm, warm, private, adult voice.
- Do not use em dashes in user-facing copy.
- No childish gamification, no generic wellness gradients.
- Large readable type, generous spacing, subtle motion.

## Out of scope for V1

- Community feed
- Public profiles
- Open-ended AI companion chat
- Huge wellness content library
- Multiple challenges or complex streak mechanics
- Address-book access
- Automatic message sending
- Complex admin dashboard

## Success criteria for the vertical slice

- The full loop runs offline with mock data.
- Safety routing intercepts crisis language before any normal action is generated.
- Paywall renders premium offering through the RevenueCat interface (mocked).
- Type-safe, linted, and covered by tests on decision and safety logic.
