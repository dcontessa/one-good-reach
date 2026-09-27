import { createId } from '@/domain/util';
import { readJson, removeKeys, writeJson } from '@/services/storage';
import type { AuthService, AuthUser } from '@/services/types';

const USER_KEY = 'auth:user';

/**
 * Local profile adapter. V1 requires no account and stores no credentials.
 * Legacy email methods remain only for interface compatibility and are not
 * exposed in the shipping UI.
 */
export class MockAuthService implements AuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    return readJson<AuthUser | null>(USER_KEY, null);
  }

  async continueAsGuest(): Promise<AuthUser> {
    const user: AuthUser = { id: `guest_${createId()}`, email: null, isGuest: true };
    await writeJson(USER_KEY, user);
    return user;
  }

  async signInWithEmail(email: string): Promise<AuthUser> {
    const user: AuthUser = { id: `user_${createId()}`, email, isGuest: false };
    await writeJson(USER_KEY, user);
    return user;
  }

  async signUpWithEmail(email: string): Promise<AuthUser> {
    return this.signInWithEmail(email);
  }

  async signOut(): Promise<void> {
    await removeKeys([USER_KEY]);
  }

  async deleteAccount(): Promise<void> {
    await removeKeys([USER_KEY]);
  }
}
