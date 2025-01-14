import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, TaskStore, VaultTask } from '@/renderer/task-utils';
import { getAllTasks } from '@/renderer/task-utils';

interface TaskFilters {
  status: 'all' | 'open' | 'completed';
  search: string;
}

interface ExtendedTaskStore extends TaskStore {
  filters: TaskFilters;
  setFilters: (filters: Partial<TaskFilters>) => void;
  applyFilters: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useTaskStore = create<ExtendedTaskStore>()(
  persist(
    (set, get) => {
      // Helper function to apply filters
      const applyFilters = () => {
        const { tasks, filters } = get();
        const filtered = tasks.filter((task) => {
          const matchesStatus =
            filters.status === 'all'
              ? true
              : filters.status === 'completed'
                ? task.completed
                : !task.completed;

          const matchesSearch = task.title
            .toLowerCase()
            .includes(filters.search.toLowerCase());

          return matchesStatus && matchesSearch;
        });
        set({ filteredTasks: filtered });
      };

      return {
        tasks: [],
        filteredTasks: [],
        filters: {
          status: 'all',
          search: '',
        },
        isLoading: false,
        _hasHydrated: false,
        setHasHydrated: (state) => set({ _hasHydrated: state }),

        setTasks: (tasks) => {
          set({ tasks });
          applyFilters();
        },

        addTask: (task) => {
          const newTask = {
            ...task,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            automated: false,
          };
          set((state) => ({ tasks: [...state.tasks, newTask] }));
          applyFilters();
        },

        updateTask: (task) => {
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
          }));
          applyFilters();
        },

        setFilteredTasks: (filteredTasks) => set({ filteredTasks }),

        setFilters: (newFilters) => {
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          }));
          applyFilters();
        },

        applyFilters,

        loadTasks: async () => {
          set({ isLoading: true });
          try {
            const vaultPath = await window.api
              .getVaultConfig()
              .then((config) => config?.path);

            if (!vaultPath) {
              throw new Error('No vault path configured');
            }

            const tasks = await getAllTasks(vaultPath);
            set({ tasks });
            applyFilters();
            set({ isLoading: false });
          } catch (error) {
            console.error('Failed to load tasks:', error);
            set({ isLoading: false });
          }
        },

        handleTaskToggle: async (taskId) => {
          const { tasks, updateTask } = get();
          const task = tasks.find((t) => t.id === taskId);

          if (task) {
            const updatedTask = { ...task, completed: !task.completed };
            updateTask(updatedTask);

            if (task.filePath) {
              try {
                // Convert to VaultTask format for file update
                const vaultTask: VaultTask = {
                  ...task,
                  completed: !task.completed,
                  filePath: task.filePath,
                  tags: task.tags || [],
                  context: task.context || '',
                  stats: task.stats || {
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                  },
                  obsidianUrl: task.obsidianUrl || '',
                };

                await window.api.updateTaskInFile(task.filePath, vaultTask);
              } catch (error) {
                console.error('Failed to update task in file:', error);
                updateTask(task); // Revert on error
              }
            }
          }
        },
      };
    },
    {
      name: 'task-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        tasks: state.tasks,
        filters: state.filters
      }),
      onRehydrateStorage: (state) => {
        // Called when hydration starts
        return (state) => {
          // Called when hydration finishes
          state?.setHasHydrated(true);
        };
      },
    }
  )
);

// Optional: Export a hook to check hydration status
export const useHydration = () => {
  const hasHydrated = useTaskStore((state) => state._hasHydrated);
  return hasHydrated;
};
