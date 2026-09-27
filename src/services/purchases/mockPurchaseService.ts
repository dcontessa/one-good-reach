import { readJson, writeJson } from '@/services/storage';
import type {
  PurchaseOffering,
  PurchaseService,
  PurchaseStatus,
} from '@/services/types';

const STATUS_KEY = 'purchases:status';

/**
 * Offline purchases adapter modeling a single premium subscription. It mirrors
 * the shape of RevenueCat offerings so the paywall screen needs no changes when
 * the real react-native-purchases adapter is wired in.
 *
 * The premium entitlement is called 'premium' in RevenueCat.
 */
export class MockPurchaseService implements PurchaseService {
  async configure(): Promise<void> {
    // No-op offline. Real adapter calls Purchases.configure with the SDK key.
  }

  async getOffering(): Promise<PurchaseOffering> {
    return {
      identifier: 'default',
      packages: [
        {
          identifier: 'ogr_premium_monthly',
          title: 'Monthly',
          priceString: '$4.99',
          period: 'month',
          description: 'Personalized journeys, deeper insights, and repair preparation.',
        },
        {
          identifier: 'ogr_premium_annual',
          title: 'Annual',
          priceString: '$39.99',
          period: 'year',
          description: 'Everything in monthly, at a lower yearly rate.',
        },
      ],
    };
  }

  async getStatus(): Promise<PurchaseStatus> {
    return readJson<PurchaseStatus>(STATUS_KEY, { isPremium: false });
  }

  async purchase(): Promise<PurchaseStatus> {
    const status: PurchaseStatus = { isPremium: true };
    await writeJson(STATUS_KEY, status);
    return status;
  }

  async restore(): Promise<PurchaseStatus> {
    return this.getStatus();
  }
}
