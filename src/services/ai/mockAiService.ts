import { PERSON_FALLBACK, TEMPLATES } from '@/content/actions';
import type { AiService, GenerateActionRequest, GeneratedAction } from '@/services/types';

/**
 * Offline AI adapter. Fills static templates locally so the whole loop works
 * with no network and no model key. A server adapter will implement the same
 * interface and call a provider-agnostic endpoint.
 *
 * It honors the safety flag as a hard stop, mirroring what a real server must do.
 */
export class MockAiService implements AiService {
  async generateAction(request: GenerateActionRequest): Promise<GeneratedAction> {
    if (request.safetyFlagged) {
      throw new Error('Safety flag set. Normal action generation is not allowed.');
    }

    const template = TEMPLATES.find((t) => t.intent === request.intent);
    if (!template) {
      throw new Error(`No template for intent ${request.intent}`);
    }

    const name = request.personLabel?.trim() || PERSON_FALLBACK;
    const suggestedMessage = template.messageTemplate.replace('{name}', name);

    // Premium users get a slightly richer rationale to reflect deeper journeys.
    const rationale = request.isPremium
      ? `${template.rationale} Because your ${request.area} feels low today, this small reach can matter more than it seems.`
      : template.rationale;

    // Simulate a brief think time so the UI can show a calm loading state.
    await new Promise((resolve) => setTimeout(resolve, 350));

    return {
      title: template.title,
      rationale,
      suggestedMessage,
    };
  }
}
