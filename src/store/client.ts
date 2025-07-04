import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { TimePeriod } from '@/@types';
import PersistedAsyncStorage from '@/lib/async-store';

export type ActivityColumn = 'event' | 'url' | 'person' | 'timestamp';

export type ActivityDisplayMode = 'compact' | 'full';

export type AppIcon =
  | 'default'
  | 'angry'
  | 'nerd'
  | 'happy-blue'
  | 'happy-orange'
  | 'space'
  | 'cowboy'
  | 'construction';

interface IClientState {
  /** The users selected app icon */
  appIcon: AppIcon;
  /** Whether the user is currently in dev mode or not */
  devMode: boolean;
  /** The users current theme */
  theme: 'light' | 'dark';
  /** The project id that the user is currently viewing */
  project: string | null;
  /** The organization id that the user is currently viewing */
  organization: string | null;
  /** The dashboard that the user is currently viewing */
  dashboard: string | null;
  /** The display mode for the activity table */
  activityDisplayMode: ActivityDisplayMode;
  /** The columns to show in the activity table */
  activityColumns: ActivityColumn[];
  /** The endpoint that the user prefers to use */
  posthogEndpoint: 'https://us.posthog.com' | 'https://eu.posthog.com' | string;
  /** The activity time period that the user prefers to query */
  activityTimePeriod: TimePeriod;
  /** The event definition the user is filtering by in activity */
  activityEventDefinition: string | 'all';
  /** The insights time period that the user prefers to query */
  insightsTimePeriod: TimePeriod;
  /** Whether the user prefers filtering internal users or not */
  filterTestAccounts: boolean;
  /** The time when the user should be asked to kindly leave a review */
  reviewPromptTime: number | null;
  /** Whether the user has been instructed on how to use the activity page or not */
  hasSeenActivityOnboarding: boolean;
  /** Whether the user has been instructed on how to use the insights page or not */
  hasSeenInsightsOnboarding: boolean;
  /** Whether the user has been instructed on how to use the exceptions page or not */
  hasSeenExceptionsOnboarding: boolean;
  /** Whether the user has disabled 'update alerts' */
  disableUpdateAlerts: boolean;
}

interface IClientStore extends IClientState {
  clear: () => void;
  setField: <T extends keyof IClientState>(
    field: T,
    value: IClientState[T],
  ) => void;
}

const useClientStore = create<IClientStore>()(
  persist(
    (set) => {
      const initialState: IClientState = {
        devMode: false,
        theme: 'light',
        project: null,
        organization: null,
        dashboard: null,
        appIcon: 'default',
        activityEventDefinition: 'all',
        activityDisplayMode: 'full',
        activityColumns: ['event', 'url', 'timestamp'],
        activityTimePeriod: '-1dStart',
        insightsTimePeriod: '-7d',
        filterTestAccounts: false,
        posthogEndpoint: 'https://us.posthog.com',
        // 3 days after first use, show the 'please review us' prompt
        reviewPromptTime: new Date().getTime() + 3 * 24 * 60 * 60 * 1000,
        hasSeenActivityOnboarding: false,
        hasSeenInsightsOnboarding: false,
        hasSeenExceptionsOnboarding: false,
        disableUpdateAlerts: false,
      };

      const setField = <T extends keyof IClientState>(
        field: T,
        value: IClientState[T],
      ) => {
        set((state) => ({ ...state, [field]: value }));
      };

      const clear = () => {
        set(initialState);
      };

      return {
        ...initialState,
        clear,
        setField,
      };
    },
    {
      name: 'client-storage',
      storage: PersistedAsyncStorage,
    },
  ),
);

export default useClientStore;
