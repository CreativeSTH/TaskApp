export type TaskStateName = 'new' | 'active' | 'resolved' | 'closed';

export interface StateEntry {
  state: TaskStateName;
  date: string;
}

export interface StateDefinition {
  id: string;
  name: TaskStateName;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  stateHistory: StateEntry[];
  notes: string[];
}

export interface TaskFormValue {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  newState: TaskStateName;
  notes: string[];
}

export interface TaskStoreState {
  tasks: Task[];
  availableStates: StateDefinition[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
