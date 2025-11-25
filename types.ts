export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string; // ISO String
}

export type ThemeMode = 'light' | 'dark';
