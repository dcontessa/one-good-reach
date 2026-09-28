# Title

One Good Reach

## One-line Summary

A private daily check-in that turns how you feel into one small action to reconnect with someone who matters.

## Problem

When people feel depleted, reaching out can feel harder than it should. Many wellbeing products keep attention inside the app through content, tracking, or chat. The moment that could strengthen a real relationship is easily postponed because the first step feels too large or too awkward.

## Solution

One Good Reach is a private mobile ritual built around a simple loop: check in with Soul, Mind, and Body; receive one safe action that takes about five minutes; prepare a message or conversation; reconnect with a real person; then reflect privately.

The app does not try to become the user's companion. It helps the user move from the screen back into a human relationship.

## Why This Matters

Small acts of connection can be meaningful when someone is stressed, isolated, or emotionally depleted. One Good Reach lowers the activation energy for gratitude, checking in, making an invitation, asking for support, or preparing a repair. Its social value comes from helping people take achievable, real-world steps toward stronger relationships without turning private emotional data into a public feed.

## How We Used AI

The current release uses a bounded local recommendation engine rather than open-ended generative chat. It combines the user's Soul, Mind, and Body ratings, recent action history, and a safety gate to select an appropriate action template. Private notes never need to leave the device. This approach deliberately limits unpredictability and keeps the product focused on real human contact.

Kiro helped scaffold the initial Expo application. Codex then reviewed and rebuilt key parts of the product, removed the unused cloud backend, connected the production RevenueCat SDK adapter, tightened the privacy and safety flow, fixed state bugs, added tests, and prepared the app for Android distribution.

## How We Used Codex

Codex was used as an engineering and product collaborator. It audited the initial codebase, converted the account flow to private local use, implemented the RevenueCat purchase service behind a testable interface, added Expo development and production build configuration, corrected the person-name handoff in the action flow, generated and integrated the final app icon, and verified the project with TypeScript, ESLint, Jest, Expo Doctor, and browser-based flow testing.

## Key Features

- A quick Soul, Mind, and Body check-in
- One achievable action designed to take about five minutes
- Action paths for gratitude, checking in, inviting, asking for support, and preparing a repair
- Editable message and conversation prompts addressed to a person the user chooses
- A private completion reflection and history
- Local-only storage for check-ins, labels, messages, and reflections
- A safety gate that redirects crisis language away from the normal recommendation flow
- RevenueCat-powered Premium entitlement, offerings, purchase, and restore flows
- A calm interface with no public profiles, social feed, or competitive streaks

## Architecture

One Good Reach is an Expo React Native app written in strict TypeScript and organized with Expo Router. Thin screens call service interfaces for data, recommendations, authentication state, and purchases. Personal data is stored locally with AsyncStorage. A pure, synchronous safety gate runs before action generation. RevenueCat is the only required network service and is integrated through `react-native-purchases`; the app uses platform public SDK keys in development builds and store builds.

Built with: Expo, React Native, TypeScript, Expo Router, AsyncStorage, RevenueCat, Jest, ESLint, and EAS Build.

## Testing Instructions

1. Install and open the Android app.
2. Tap **Continue privately**.
3. Start a check-in and rate Soul, Mind, and Body.
4. Add a person, for example “My sister”.
5. Review the suggested five-minute action and edit the prepared message if desired.
6. Mark the action complete and add a private reflection.
7. Open History to see the saved check-in.
8. Open Premium to view the RevenueCat offering and use the free trial or judge access route supplied in the submission.

Automated checks currently pass: TypeScript typecheck, ESLint, 19 Jest tests across three suites, and all 18 Expo Doctor checks.

## Public Demo Link

TODO: Add the public Google Play URL after the production listing is live.

## Public Repository Link

TODO: Publish the repository only after a final secrets and license review, if a public repository is desired. A public repository is not required for the selected award categories.

## Demo Video

TODO: Record a device demo of no more than two minutes and publish it publicly on YouTube or Vimeo.

Suggested sequence:

1. Problem and promise, 10 seconds
2. Soul, Mind, and Body check-in, 20 seconds
3. Personalized action and editable message, 30 seconds
4. Completion, reflection, and history, 20 seconds
5. Premium paywall and RevenueCat purchase or trial flow, 25 seconds
6. Privacy, safety, and closing line, 15 seconds

## Screenshot Shot List

Required Devpost asset:

- 1179 × 2556 px, no device frame: Home screen with the daily check-in card and warm One Good Reach visual system

Recommended Google Play and Devpost gallery set:

- Soul, Mind, and Body check-in
- One five-minute action addressed to a chosen person
- Editable message preparation
- Private reflection and history
- Premium paywall showing the free-trial offer

## Award Responses

### RevenueCat Peace Prize

One Good Reach was designed to create social good at the scale of one relationship at a time. When someone feels depleted, the app turns a private emotional check-in into a small, achievable act of gratitude, care, invitation, support, or repair with a real person. It avoids public feeds, comparison, and an artificial companion relationship. Personal check-ins and reflections remain on the device, and a safety gate redirects crisis language away from the normal action flow. The product's purpose is not to keep people talking to technology. It is to help them take a safer first step back toward one another.

### RevenueCat Design Award

The design treats reconnection as a calm private ritual rather than a productivity contest. Warm ivory surfaces, coral and aubergine accents, rounded organic forms, generous spacing, and clear adult typography create a sense of safety without becoming clinical. The interaction is intentionally linear: notice how you feel, choose one person, prepare one small action, and close with reflection. There is no social feed, leaderboard, or streak pressure. The paired reaching forms in the app icon express the product idea in one symbol: two people moving toward a shared point of connection.

### HAMM Award

One Good Reach uses a freemium subscription model powered by RevenueCat. The core daily check-in, one safe reconnection action, safety routing, and access to personal history remain useful without payment. Premium is designed for people who want deeper pattern insights, additional guided reconnection journeys, and more choice in action formats. A subscription fits the recurring value of an ongoing relationship practice, while a free trial lets users experience the complete loop before paying. RevenueCat manages offerings, the Premium entitlement, purchase state, and restoration across installs. We deliberately avoid monetizing private emotional data or placing the safety flow behind a paywall.

## Submission Readiness Notes

- Devpost project draft exists and the account is registered for RevenueCat Shipaton 2026.
- App icon is ready at 1024 × 1024.
- Android is the selected app type.
- The local MVP builds and its automated quality gates pass.
- The first public Google Play release must be completed by September 30, 2026 Pacific Time.
- Devpost submission deadline: October 1, 2026 at 06:45 UTC, which is October 1, 2026 at 2:45 PM Malaysia time.
- Final submission must not occur until the published store URL, RevenueCat project ID, qualifying screenshot, public demo video, and free-trial or promo access are verified.

## Known Limitations

- Store publishing and live purchase testing are still pending.
- The current action recommendation system is bounded and local. It is not an open-ended generative AI companion.
- Personal data does not sync between devices.
- Safety detection is a support boundary, not medical diagnosis or crisis care.
- The first release intentionally excludes address-book access, automatic message sending, public profiles, and a community feed.

## TODO Official Form Fields

- Includes App Icon: Yes, after the 1024 × 1024 icon is attached
- Includes screenshot: Yes, after the 1179 × 2556 screenshot is attached
- First Version Date Confirmation: Yes, only after the public Google Play release is verified
- Is Staff or Sponsor: No
- App type: Android
- Google Play Store URL: TODO
- RevenueCat project ID: TODO
- Premium access: TODO, configure a free trial or add a judge promo code
- RevenueCat Peace Prize response: Ready above
- RevenueCat Design Award response: Ready above
- HAMM Award response: Ready above
- Additional notes for judges: One Good Reach is a privacy-first relationship-support tool. It is not therapy, diagnosis, crisis care, or an AI companion.
- Codex session ID: TODO only if requested by an official form field
