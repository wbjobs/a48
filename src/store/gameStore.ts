import { create } from 'zustand';
import type { ChallengeType, ChallengeResponse, Record } from '../../shared/types';

export type GamePhase = 'boot' | 'ready' | 'challenge' | 'success' | 'shutdown';

interface GameState {
  phase: GamePhase;
  currentChallenge: ChallengeResponse | null;
  errorCount: number;
  startTime: number;
  timeLeft: number;
  message: string;
  records: Record[];
  totalRecords: number;
  successRecords: number;
  showHint: boolean;

  setPhase: (phase: GamePhase | ((prev: GamePhase) => GamePhase)) => void;
  setChallenge: (challenge: ChallengeResponse) => void;
  setErrorCount: (count: number | ((prev: number) => number)) => void;
  setStartTime: (time: number) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setMessage: (message: string) => void;
  setRecords: (records: Record[], total: number, successCount: number) => void;
  setShowHint: (show: boolean) => void;
  resetGame: () => void;
}

const initialState = {
  phase: 'boot' as GamePhase,
  currentChallenge: null,
  errorCount: 0,
  startTime: 0,
  timeLeft: 0,
  message: '',
  records: [] as Record[],
  totalRecords: 0,
  successRecords: 0,
  showHint: false,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  setPhase: (phase) =>
    set((state) => ({ phase: typeof phase === 'function' ? phase(state.phase) : phase })),
  setChallenge: (challenge) => set({ currentChallenge: challenge }),
  setErrorCount: (count) =>
    set((state) => ({
      errorCount: typeof count === 'function' ? count(state.errorCount) : count,
    })),
  setStartTime: (time) => set({ startTime: time }),
  setTimeLeft: (time) =>
    set((state) => ({
      timeLeft: typeof time === 'function' ? time(state.timeLeft) : time,
    })),
  setMessage: (message) => set({ message }),
  setRecords: (records, total, successCount) =>
    set({ records, totalRecords: total, successRecords: successCount }),
  setShowHint: (show) => set({ showHint: show }),

  resetGame: () =>
    set({
      phase: 'boot',
      currentChallenge: null,
      errorCount: 0,
      startTime: 0,
      timeLeft: 0,
      message: '',
      showHint: false,
    }),
}));
