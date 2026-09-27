import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import {
  computeInsights,
  createId,
  mostDepletedArea,
  nowIso,
  scanForCrisis,
  selectAction,
  type Action,
  type ActionIntent,
  type CheckIn,
  type CheckInRatings,
  type Completion,
  type PatternInsights,
  type Person,
} from '@/domain';
import { services } from '@/services';
import type { AuthUser, DataSnapshot, GeneratedAction } from '@/services/types';

/**
 * App state. Holds the authenticated session, premium status, the loaded data
 * snapshot, and the in-progress check-in draft that flows across the loop
 * screens. All mutations go through services so swapping to real backends
 * later needs no store changes.
 */

export interface DraftAction extends GeneratedAction {
  intent: ActionIntent;
  personId: string | null;
  premium: boolean;
}

export interface LoopDraft {
  checkIn: CheckIn | null;
  action: DraftAction | null;
  /** True when the current check-in routed to safety instead of an action. */
  safety: boolean;
}

interface State {
  status: 'loading' | 'ready';
  user: AuthUser | null;
  isPremium: boolean;
  data: DataSnapshot;
  draft: LoopDraft;
}

const emptyData: DataSnapshot = { persons: [], checkIns: [], actions: [], completions: [] };
const emptyDraft: LoopDraft = { checkIn: null, action: null, safety: false };

type Msg =
  | { type: 'ready'; user: AuthUser | null; isPremium: boolean; data: DataSnapshot }
  | { type: 'setUser'; user: AuthUser | null }
  | { type: 'setPremium'; isPremium: boolean }
  | { type: 'setData'; data: DataSnapshot }
  | { type: 'setDraft'; draft: LoopDraft }
  | { type: 'reset' };

function reducer(state: State, msg: Msg): State {
  switch (msg.type) {
    case 'ready':
      return { ...state, status: 'ready', user: msg.user, isPremium: msg.isPremium, data: msg.data };
    case 'setUser':
      return { ...state, user: msg.user };
    case 'setPremium':
      return { ...state, isPremium: msg.isPremium };
    case 'setData':
      return { ...state, data: msg.data };
    case 'setDraft':
      return { ...state, draft: msg.draft };
    case 'reset':
      return { ...state, user: null, isPremium: false, data: emptyData, draft: emptyDraft };
    default:
      return state;
  }
}

export interface CheckInResult {
  routedToSafety: boolean;
}

interface AppContextValue extends State {
  insights: PatternInsights;
  // Auth
  continueAsGuest: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  // People
  addPerson: (label: string, relationship?: string) => Promise<Person>;
  // Core loop
  submitCheckIn: (ratings: CheckInRatings, note: string) => Promise<CheckInResult>;
  generateActionForDraft: (personId: string | null, personLabel?: string) => Promise<void>;
  updateDraftMessage: (message: string) => void;
  completeAction: (reflection: string, feltBetter: boolean | null) => Promise<void>;
  clearDraft: () => void;
  // Purchases
  refreshPremium: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    status: 'loading',
    user: null,
    isPremium: false,
    data: emptyData,
    draft: emptyDraft,
  });

  // Bootstrap: restore session, premium status, and data.
  useEffect(() => {
    let active = true;
    (async () => {
      const user = await services.auth.getCurrentUser();
      let isPremium = false;
      let data = emptyData;
      if (user) {
        await services.purchases.configure(user.id);
        const status = await services.purchases.getStatus();
        isPremium = status.isPremium;
        data = await services.data.load(user.id);
      }
      if (active) dispatch({ type: 'ready', user, isPremium, data });
    })();
    return () => {
      active = false;
    };
  }, []);

  const reload = useCallback(async (userId: string) => {
    const data = await services.data.load(userId);
    dispatch({ type: 'setData', data });
  }, []);

  const startSession = useCallback(async (user: AuthUser) => {
    await services.purchases.configure(user.id);
    const status = await services.purchases.getStatus();
    const data = await services.data.load(user.id);
    dispatch({ type: 'setUser', user });
    dispatch({ type: 'setPremium', isPremium: status.isPremium });
    dispatch({ type: 'setData', data });
  }, []);

  const continueAsGuest = useCallback(async () => {
    const user = await services.auth.continueAsGuest();
    await startSession(user);
  }, [startSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const user = await services.auth.signInWithEmail(email, password);
      await startSession(user);
    },
    [startSession],
  );

  const signOut = useCallback(async () => {
    await services.auth.signOut();
    dispatch({ type: 'reset' });
  }, []);

  const deleteAccount = useCallback(async () => {
    if (state.user) {
      await services.data.clearAll(state.user.id);
      await services.auth.deleteAccount();
    }
    dispatch({ type: 'reset' });
  }, [state.user]);

  const addPerson = useCallback(
    async (label: string, relationship?: string): Promise<Person> => {
      if (!state.user) throw new Error('No user');
      const person: Person = {
        id: createId(),
        label: label.trim(),
        relationship: relationship?.trim() || undefined,
        createdAt: nowIso(),
      };
      await services.data.addPerson(state.user.id, person);
      await reload(state.user.id);
      return person;
    },
    [state.user, reload],
  );

  const submitCheckIn = useCallback(
    async (ratings: CheckInRatings, note: string): Promise<CheckInResult> => {
      if (!state.user) throw new Error('No user');
      const safety = scanForCrisis(note);
      const checkIn: CheckIn = {
        id: createId(),
        createdAt: nowIso(),
        soul: ratings.soul,
        mind: ratings.mind,
        body: ratings.body,
        note: note.trim(),
        depletedArea: mostDepletedArea(ratings),
        safetyFlagged: safety.flagged,
      };
      await services.data.addCheckIn(state.user.id, checkIn);
      await reload(state.user.id);
      dispatch({ type: 'setDraft', draft: { checkIn, action: null, safety: safety.flagged } });
      return { routedToSafety: safety.flagged };
    },
    [state.user, reload],
  );

  const generateActionForDraft = useCallback(
    async (personId: string | null, personLabel?: string) => {
      const { checkIn } = state.draft;
      if (!checkIn) throw new Error('No check-in in draft');
      if (checkIn.safetyFlagged) throw new Error('Cannot generate action in safety state');

      const recentIntents = state.data.actions.map((a) => a.intent);
      const { intent, template } = selectAction({
        area: checkIn.depletedArea,
        recentIntents,
        isPremium: state.isPremium,
      });

      const person = personId ? state.data.persons.find((p) => p.id === personId) : null;
      const generated = await services.ai.generateAction({
        area: checkIn.depletedArea,
        intent,
        personLabel: personLabel?.trim() || person?.label || null,
        note: checkIn.note,
        isPremium: state.isPremium,
        safetyFlagged: checkIn.safetyFlagged,
      });

      dispatch({
        type: 'setDraft',
        draft: {
          checkIn,
          safety: false,
          action: {
            ...generated,
            intent,
            personId: personId ?? null,
            premium: template.premium,
          },
        },
      });
    },
    [state.draft, state.data.actions, state.data.persons, state.isPremium],
  );

  const updateDraftMessage = useCallback(
    (message: string) => {
      if (!state.draft.action) return;
      dispatch({
        type: 'setDraft',
        draft: {
          ...state.draft,
          action: { ...state.draft.action, suggestedMessage: message },
        },
      });
    },
    [state.draft],
  );

  const completeAction = useCallback(
    async (reflection: string, feltBetter: boolean | null) => {
      if (!state.user) throw new Error('No user');
      const { checkIn, action: draftAction } = state.draft;
      if (!checkIn || !draftAction) throw new Error('No action in draft');

      const action: Action = {
        id: createId(),
        checkInId: checkIn.id,
        intent: draftAction.intent,
        personId: draftAction.personId,
        title: draftAction.title,
        rationale: draftAction.rationale,
        suggestedMessage: draftAction.suggestedMessage,
        premium: draftAction.premium,
        createdAt: nowIso(),
      };
      const completion: Completion = {
        id: createId(),
        actionId: action.id,
        completedAt: nowIso(),
        reflection: reflection.trim(),
        feltBetter,
      };
      await services.data.addAction(state.user.id, action);
      await services.data.addCompletion(state.user.id, completion);
      await reload(state.user.id);
      dispatch({ type: 'setDraft', draft: emptyDraft });
    },
    [state.user, state.draft, reload],
  );

  const clearDraft = useCallback(() => {
    dispatch({ type: 'setDraft', draft: emptyDraft });
  }, []);

  const refreshPremium = useCallback(async () => {
    const status = await services.purchases.getStatus();
    dispatch({ type: 'setPremium', isPremium: status.isPremium });
  }, []);

  const insights = useMemo(
    () =>
      computeInsights(
        state.data.checkIns,
        state.data.actions,
        state.data.completions,
        state.data.persons,
      ),
    [state.data],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      insights,
      continueAsGuest,
      signIn,
      signOut,
      deleteAccount,
      addPerson,
      submitCheckIn,
      generateActionForDraft,
      updateDraftMessage,
      completeAction,
      clearDraft,
      refreshPremium,
    }),
    [
      state,
      insights,
      continueAsGuest,
      signIn,
      signOut,
      deleteAccount,
      addPerson,
      submitCheckIn,
      generateActionForDraft,
      updateDraftMessage,
      completeAction,
      clearDraft,
      refreshPremium,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppStoreProvider');
  return ctx;
}
