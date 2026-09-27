# Safety and Privacy

One Good Reach is a wellbeing and relationship-support tool. It is not therapy, diagnosis, crisis care, or an AI companion. We do not make clinical claims.

## Crisis and self-harm handling

- Free-text input is scanned locally by `domain/safety` before any action is generated or any network request is made.
- Detection uses a curated set of high-signal phrases covering self-harm, suicidal ideation, and intent to harm others, with simple negation and past-tense softening to reduce obvious false positives. It is intentionally conservative: it does not diagnose, it routes to support.
- When crisis language is detected:
  - The app does not generate a normal relationship action.
  - It shows a supportive safety screen with plain, non-clinical language.
  - It surfaces appropriate emergency guidance and helpline information.
  - The check-in is stored with `safetyFlagged: true` and no action is attached.
- Safety information is never behind the paywall.

This detection is a supportive nudge toward real help. It is not a clinical screening tool and should not be described as one.

## Emergency guidance shown

The safety screen presents general, region-aware guidance:
- If there is immediate danger, contact local emergency services.
- A short list of well-known helplines with a note that availability varies by country.
- Encouragement to reach a trusted person or professional.

Helpline data lives in `src/content/safety.ts` so it can be localized and reviewed. It is presented as information, not advice.

## Consent and data minimization

- Guest mode requires no personal identifiers.
- Relationship contacts are user-created labels. No address-book access in V1.
- We store the minimum needed for the core loop and insights.
- Clear consent copy appears during onboarding.
- Account deletion is reachable from settings and purges local and, when signed in, server-side data.

## No automatic outreach

The app never sends messages, contacts people, or posts anything. Message drafts are always editable and require the user to copy or send them manually through their own apps.

## AI guardrails

- AI output is bounded to short, safe, editable suggestions.
- The AI service receives a safety flag; a server implementation must refuse to produce normal content when the flag is set.
- No model API keys in the client. Generation happens server-side behind `AiService`.
- Suggestions are framed as options the user can change or ignore.

## Copy rules

- Warm, plain, adult language.
- No clinical or diagnostic claims.
- No em dashes in user-facing copy.
