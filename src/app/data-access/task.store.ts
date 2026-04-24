import { computed, inject, InjectionToken } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, delay, forkJoin, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { StateDefinition, Task, TaskFormValue, TaskStateName, TaskStoreState } from '../core/models/task.model';
import { TaskService } from './task.service';
import { ToastService } from '../core/services/toast.service';

export const STORE_INIT_DELAY = new InjectionToken<number>('STORE_INIT_DELAY', { factory: () => 2000 });

const withDelay = (ms: number) => <T>(source: Observable<T>): Observable<T> =>
  ms > 0 ? source.pipe(delay(ms)) : source;

const STATES: TaskStateName[] = ['new', 'active', 'resolved', 'closed'];

const initialState: TaskStoreState = {
  tasks: [],
  availableStates: [],
  loading: false,
  error: null,
  columnPages: { new: 1, active: 1, resolved: 1, closed: 1 },
  pageSize: 3,
  searchQuery: '',
};

const filterTasks = (tasks: Task[], query: string): Task[] => {
  const q = query.toLowerCase().trim();
  return q
    ? tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    : tasks;
};

const taskState = (task: Task): TaskStateName =>
  task.stateHistory.at(-1)?.state ?? 'new';

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ tasks, searchQuery }) => ({
    tasksByColumn: computed(() => {
      const filtered = filterTasks(tasks(), searchQuery());
      return STATES.reduce(
        (acc, s) => ({ ...acc, [s]: filtered.filter(t => taskState(t) === s) }),
        {} as Record<TaskStateName, Task[]>
      );
    }),
    isEmpty: computed(() => filterTasks(tasks(), searchQuery()).length === 0),
  })),

  withComputed(({ tasksByColumn, columnPages, pageSize }) => ({
    paginatedByColumn: computed(() => {
      const byCol = tasksByColumn();
      const pages = columnPages();
      const size = pageSize();
      return STATES.reduce((acc, s) => {
        const start = (pages[s] - 1) * size;
        return { ...acc, [s]: byCol[s].slice(start, start + size) };
      }, {} as Record<TaskStateName, Task[]>);
    }),
    totalPagesByColumn: computed(() => {
      const byCol = tasksByColumn();
      const size = pageSize();
      return STATES.reduce(
        (acc, s) => ({ ...acc, [s]: Math.max(1, Math.ceil(byCol[s].length / size)) }),
        {} as Record<TaskStateName, number>
      );
    }),
  })),

  withMethods((store, taskService = inject(TaskService), toast = inject(ToastService), initDelay = inject(STORE_INIT_DELAY)) => ({
    init: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          forkJoin({
            tasks: taskService.getTasks(),
            availableStates: taskService.getStates(),
          }).pipe(
            withDelay(initDelay),
            tapResponse({
              next: ({ tasks, availableStates }) => {
                patchState(store, { tasks, availableStates, loading: false });
                toast.show(`${tasks.length} task${tasks.length !== 1 ? 's' : ''} loaded`, 'success');
              },
              error: (err: Error) =>
                patchState(store, { error: err.message, loading: false }),
            })
          )
        )
      )
    ),

    createTask: rxMethod<TaskFormValue>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(formValue => {
          const newTask: Omit<Task, 'id'> = {
            title: formValue.title,
            description: formValue.description,
            dueDate: formValue.dueDate,
            completed: formValue.completed,
            stateHistory: [{ state: formValue.newState, date: new Date().toISOString().split('T')[0] }],
            notes: formValue.notes.filter(n => n.trim()),
          };
          return taskService.create(newTask).pipe(
            tapResponse({
              next: task => {
                patchState(store, { tasks: [...store.tasks(), task], loading: false });
                toast.show('Task created successfully', 'success');
              },
              error: (err: Error) => patchState(store, { error: err.message, loading: false }),
            })
          );
        })
      )
    ),

    updateTask: rxMethod<Task & { newState?: string }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(({ newState, ...task }) => {
          const currentState = task.stateHistory.at(-1)?.state;
          const isStateChange = !!newState && newState !== currentState;
          const updatedTask: Task = {
            ...task,
            stateHistory: isStateChange
              ? [...task.stateHistory, { state: newState as TaskStateName, date: new Date().toISOString().split('T')[0] }]
              : task.stateHistory,
          };
          return taskService.update(updatedTask).pipe(
            tapResponse({
              next: saved => {
                patchState(store, {
                  tasks: store.tasks().map(t => (t.id === saved.id ? saved : t)),
                  loading: false,
                });
                const label = (newState ?? currentState ?? 'unknown');
                const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
                toast.show(
                  isStateChange ? `Task moved to "${capitalized}"` : 'Task updated successfully',
                  'success'
                );
              },
              error: (err: Error) => patchState(store, { error: err.message, loading: false }),
            })
          );
        })
      )
    ),

    deleteTask: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(id =>
          taskService.delete(id).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  tasks: store.tasks().filter(t => t.id !== id),
                  loading: false,
                });
                toast.show('Task deleted', 'success');
              },
              error: (err: Error) => patchState(store, { error: err.message, loading: false }),
            })
          )
        )
      )
    ),

    setColumnPage(state: TaskStateName, page: number): void {
      patchState(store, { columnPages: { ...store.columnPages(), [state]: page } });
    },

    setSearch(query: string): void {
      patchState(store, {
        searchQuery: query,
        columnPages: { new: 1, active: 1, resolved: 1, closed: 1 },
      });
    },
  }))
);
