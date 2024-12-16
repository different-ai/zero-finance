import { create } from 'zustand'

export type Task = {
  id: number
  title: string
  completed: boolean
  date: string
  automated: boolean
}

type DashboardStore = {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id'>) => void
  automationRate: () => number
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  tasks: [
    {
      id: 1,
      title: 'Review Unconf speaker list',
      completed: false,
      date: '2023-06-15',
      automated: false,
    },
    {
      id: 2,
      title: 'Prepare Vitalik introduction',
      completed: true,
      date: '2023-06-10',
      automated: true,
    },
    {
      id: 3,
      title: 'Update Unconf website',
      completed: false,
      date: '2023-06-20',
      automated: false,
    },
    {
      id: 4,
      title: 'Coordinate with sponsors',
      completed: false,
      date: '2023-06-25',
      automated: true,
    },
    {
      id: 5,
      title: 'Draft tweet about Vitalik',
      completed: false,
      date: '2023-06-30',
      automated: true,
    },
  ],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, { ...task, id: state.tasks.length + 1 }] 
  })),
  automationRate: () => {
    const tasks = get().tasks
    return (tasks.filter((task) => task.automated).length / tasks.length) * 100
  },
})) 