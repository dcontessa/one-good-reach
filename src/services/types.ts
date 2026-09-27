import type {
  Action,
  ActionIntent,
  CheckIn,
  CheckInArea,
  Completion,
  Person,
} from '@/domain/types';

/**
 * Service contracts. Screens depend on these interfaces, never on SDKs directly.
 * Local adapters keep personal data on device. RevenueCat implements purchases
 * in production without introducing an application backend.
 */

// Auth

export interface AuthUser {
  id: string;
  email: string | null;
  isGuest: boolean;
}

export interface AuthService {
  getCurrentUser(): Promise<AuthUser | null>;
  continueAsGuest(): Promise<AuthUser>;
  signInWithEmail(email: string, password: string): Promise<AuthUser>;
  signUpWithEmail(email: string, password: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  /** Removes the local profile. */
  deleteAccount(): Promise<void>;
}

// Data

export interface DataSnapshot {
  persons: Person[];
  checkIns: CheckIn[];
  actions: Action[];
  completions: Completion[];
}

export interface DataService {
  load(userId: string): Promise<DataSnapshot>;
  addPerson(userId: string, person: Person): Promise<void>;
  addCheckIn(userId: string, checkIn: CheckIn): Promise<void>;
  addAction(userId: string, action: Action): Promise<void>;
  addCompletion(userId: string, completion: Completion): Promise<void>;
  /** Removes all of the user's local records. */
  clearAll(userId: string): Promise<void>;
}

// Purchases (RevenueCat)

export interface PurchasePackage {
  identifier: string;
  title: string;
  priceString: string;
  period: string;
  description: string;
}

export interface PurchaseOffering {
  identifier: string;
  packages: PurchasePackage[];
}

export interface PurchaseStatus {
  isPremium: boolean;
}

export interface PurchaseService {
  configure(userId: string): Promise<void>;
  getOffering(): Promise<PurchaseOffering>;
  getStatus(): Promise<PurchaseStatus>;
  purchase(packageIdentifier: string): Promise<PurchaseStatus>;
  restore(): Promise<PurchaseStatus>;
}

// Bounded action generator. V1 runs locally and never sends private notes.

export interface GenerateActionRequest {
  area: CheckInArea;
  intent: ActionIntent;
  personLabel: string | null;
  /** Optional user note. Safety is already checked before this is called. */
  note: string;
  isPremium: boolean;
  /** Hard safety flag. When true, the generator must refuse normal output. */
  safetyFlagged: boolean;
}

export interface GeneratedAction {
  title: string;
  rationale: string;
  suggestedMessage: string;
}

export interface AiService {
  /**
   * Produce a bounded, editable suggestion. Never sends anything. When
   * safetyFlagged is true, implementations must not return a normal action.
   */
  generateAction(request: GenerateActionRequest): Promise<GeneratedAction>;
}
