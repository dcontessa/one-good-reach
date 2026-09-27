import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesPackage,
} from 'react-native-purchases';
import type {
  PurchaseOffering,
  PurchaseService,
  PurchaseStatus,
} from '@/services/types';

const PREMIUM_ENTITLEMENT = 'premium';

function periodLabel(aPackage: PurchasesPackage): string {
  switch (aPackage.packageType) {
    case 'WEEKLY':
      return 'week';
    case 'MONTHLY':
      return 'month';
    case 'TWO_MONTH':
      return '2 months';
    case 'THREE_MONTH':
      return '3 months';
    case 'SIX_MONTH':
      return '6 months';
    case 'ANNUAL':
      return 'year';
    case 'LIFETIME':
      return 'once';
    default:
      return aPackage.product.subscriptionPeriod ?? 'billing period';
  }
}

function statusFrom(customerInfo: CustomerInfo): PurchaseStatus {
  return {
    isPremium: Boolean(customerInfo.entitlements.active[PREMIUM_ENTITLEMENT]),
  };
}

/**
 * Production purchase adapter. RevenueCat is the only network-backed service
 * required for V1. Personal check-ins and reflections remain on device.
 */
export class RevenueCatPurchaseService implements PurchaseService {
  private configured = false;
  private packages = new Map<string, PurchasesPackage>();

  constructor(private readonly apiKey: string) {}

  async configure(userId: string): Promise<void> {
    if (!this.configured) {
      Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);
      Purchases.configure({ apiKey: this.apiKey, appUserID: userId });
      this.configured = true;
      return;
    }

    const customerInfo = await Purchases.getCustomerInfo();
    if (customerInfo.originalAppUserId !== userId) {
      await Purchases.logIn(userId);
    }
  }

  async getOffering(): Promise<PurchaseOffering> {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current || current.availablePackages.length === 0) {
      throw new Error('Premium products are not available yet. Please try again later.');
    }

    this.packages.clear();
    current.availablePackages.forEach((aPackage) => {
      this.packages.set(aPackage.identifier, aPackage);
    });

    return {
      identifier: current.identifier,
      packages: current.availablePackages.map((aPackage) => ({
        identifier: aPackage.identifier,
        title: aPackage.product.title,
        priceString: aPackage.product.priceString,
        period: periodLabel(aPackage),
        description: aPackage.product.description,
      })),
    };
  }

  async getStatus(): Promise<PurchaseStatus> {
    return statusFrom(await Purchases.getCustomerInfo());
  }

  async purchase(packageIdentifier: string): Promise<PurchaseStatus> {
    let aPackage = this.packages.get(packageIdentifier);
    if (!aPackage) {
      await this.getOffering();
      aPackage = this.packages.get(packageIdentifier);
    }
    if (!aPackage) throw new Error('The selected Premium option is unavailable.');

    const result = await Purchases.purchasePackage(aPackage);
    return statusFrom(result.customerInfo);
  }

  async restore(): Promise<PurchaseStatus> {
    return statusFrom(await Purchases.restorePurchases());
  }
}

export function revenueCatApiKey(): string | null {
  if (Platform.OS === 'ios') return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || null;
  if (Platform.OS === 'android') return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || null;
  return null;
}
