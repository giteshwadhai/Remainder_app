export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

export type FilterType = 'all' | 'pending' | 'completed';