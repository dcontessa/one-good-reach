import { MockAiService } from './ai/mockAiService';
import { MockAuthService } from './auth/mockAuthService';
import { MockDataService } from './data/mockDataService';
import { MockPurchaseService } from './purchases/mockPurchaseService';
import {
  RevenueCatPurchaseService,
  revenueCatApiKey,
} from './purchases/revenueCatPurchaseService';
import type { AiService, AuthService, DataService, PurchaseService } from './types';

/**
 * Service container. Screens import from here and never touch adapters directly.
 *
 * Personal data always stays in local adapters for V1. RevenueCat becomes live
 * when a platform SDK key is present and mock mode is not forced.
 */

export interface Services {
  auth: AuthService;
  data: DataService;
  purchases: PurchaseService;
  ai: AiService;
  mode: 'mock' | 'live';
}

function forceMock(): boolean {
  // Default to mock unless explicitly disabled. Keeps demos deterministic.
  return process.env.EXPO_PUBLIC_FORCE_MOCK !== 'false';
}

function createServices(): Services {
  const apiKey = revenueCatApiKey();
  const useLivePurchases = !forceMock() && Boolean(apiKey);

  return {
    auth: new MockAuthService(),
    data: new MockDataService(),
    purchases: useLivePurchases
      ? new RevenueCatPurchaseService(apiKey as string)
      : new MockPurchaseService(),
    ai: new MockAiService(),
    mode: useLivePurchases ? 'live' : 'mock',
  };
}

export const services: Services = createServices();

export * from './types';
