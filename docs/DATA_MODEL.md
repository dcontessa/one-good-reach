# Data Model

Store the minimum personal data. Relationship contacts are user-created labels, not address-book imports. All records are private to the user.

## Entities

### Person (connection)
A user-created label for someone that matters. Never sourced from the address book.

| field | type | notes |
| --- | --- | --- |
| id | string | uuid |
| label | string | user-provided name or nickname |
| relationship | string | optional freeform (friend, sibling, mentor) |
| createdAt | ISO string | |

### CheckIn
A single Soul, Mind, Body check-in.

| field | type | notes |
| --- | --- | --- |
| id | string | uuid |
| createdAt | ISO string | |
| soul | number | 1 to 5 |
| mind | number | 1 to 5 |
| body | number | 1 to 5 |
| note | string | optional free text |
| depletedArea | 'soul' \| 'mind' \| 'body' | computed |
| safetyFlagged | boolean | true if crisis language detected |

### Action
The one recommended action tied to a check-in.

| field | type | notes |
| --- | --- | --- |
| id | string | uuid |
| checkInId | string | fk |
| intent | ActionIntent | gratitude \| check_in \| invitation \| support \| repair |
| personId | string \| null | optional linked Person |
| title | string | short label |
| rationale | string | why this was chosen |
| suggestedMessage | string | editable draft, never sent automatically |
| premium | boolean | whether it required premium |
| createdAt | ISO string | |

### Completion / Reflection
Marks an action done and stores a private reflection.

| field | type | notes |
| --- | --- | --- |
| id | string | uuid |
| actionId | string | fk |
| completedAt | ISO string | |
| reflection | string | optional private note |
| feltBetter | boolean \| null | optional lightweight signal |

### Pattern insight (derived)
Computed from history, not stored raw. Examples: most depleted area over last 7 check-ins, most reached-for person, streak of completed actions. Deeper insights are premium.

## Storage

- Mock mode: `AsyncStorage` under namespaced keys (`ogr:persons`, `ogr:checkins`, `ogr:actions`, `ogr:completions`, `ogr:profile`).
- Production V1: `AsyncStorage` on the user's device. No account, contact import, or cloud database is required.

## Deletion

Deletion clears all local records immediately. The settings screen exposes this path clearly.

## Privacy notes

- Free text is scanned locally for safety routing before any network call.
- No contact is ever messaged or imported automatically.
- Guest mode requires no personal identifiers.
