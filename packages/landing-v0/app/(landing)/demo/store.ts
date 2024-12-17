import { create } from 'zustand';

interface StatsState {
  tasksCompleted: number;
  totalPoints: number;
  streak: number;
  updateStats: (points: number, isSubtask?: boolean) => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  tasksCompleted: 0,
  totalPoints: 0,
  streak: 0,
  updateStats: (points: number, isSubtask: boolean = false) =>
    set((state) => ({
      tasksCompleted: isSubtask ? state.tasksCompleted : state.tasksCompleted + 1,
      totalPoints: state.totalPoints + points,
      streak: isSubtask ? state.streak : state.streak + 1,
    })),
}));