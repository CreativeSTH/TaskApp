import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { forkJoin, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { StateDefinition, Task, TaskFormValue, TaskStoreState } from '../core/models/task.model';
import { TaskService } from './task.service';

const initialState: TaskStoreState = {
  tasks: [],
  availableStates: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 5,
  searchQuery: '',
};

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ tasks, currentPage, pageSize, searchQuery }) => ({
    filteredTasks: computed(() => {
      const query = searchQuery().toLowerCase().trim();
      if (!query) return tasks();
      return tasks().filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }),
    paginatedTasks: computed(() => {
      const query = searchQuery().toLowerCase().trim();
      const filtered = !query
        ? tasks()
        : tasks().filter(
            t =>
              t.title.toLowerCase().includes(query) ||
              t.description.toLowerCase().includes(query)
          );
      const start = (currentPage() - 1) * pageSize();
      return filtered.slice(start, start + pageSize());
    }),
    totalPages: computed(() => {
      const query = searchQuery().toLowerCase().trim();
      const count = !query
        ? tasks().length
        : tasks().filter(
            t =>
              t.title.toLowerCase().includes(query) ||
              t.description.toLowerCase().includes(query)
          ).length;
      return Math.max(1, Math.ceil(count / pageSize()));
    }),
    isEmpty: computed(() => {
      const query = searchQuery().toLowerCase().trim();
      const filtered = !query
        ? tasks()
        : tasks().filter(
            t =>
              t.title.toLowerCase().includes(query) ||
              t.description.toLowerCase().includes(query)
          );
      return filtered.length === 0;
    }),
  })),
  withMethods((store, taskService = inject(TaskService)) => ({
    init: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          forkJoin({
            tasks: taskService.getTasks(),
            availableStates: taskService.getStates(),
          }).pipe(
            tapResponse({
              next: ({ tasks, availableStates }) =>
                patchState(store, { tasks, availableStates, loading: false }),
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
              next: task =>
                patchState(store, {
                  tasks: [...store.tasks(), task],
                  loading: false,
                }),
              error: (err: Error) =>
                patchState(store, { error: err.message, loading: false }),
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
          const updatedTask: Task = {
            ...task,
            stateHistory:
              newState && newState !== currentState
                ? [...task.stateHistory, { state: newState as Task['stateHistory'][0]['state'], date: new Date().toISOString().split('T')[0] }]
                : task.stateHistory,
          };
          return taskService.update(updatedTask).pipe(
            tapResponse({
              next: saved =>
                patchState(store, {
                  tasks: store.tasks().map(t => (t.id === saved.id ? saved : t)),
                  loading: false,
                }),
              error: (err: Error) =>
                patchState(store, { error: err.message, loading: false }),
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
              next: () =>
                patchState(store, {
                  tasks: store.tasks().filter(t => t.id !== id),
                  loading: false,
                }),
              error: (err: Error) =>
                patchState(store, { error: err.message, loading: false }),
            })
          )
        )
      )
    ),

    setPage(page: number): void {
      patchState(store, { currentPage: page });
    },

    setSearch(query: string): void {
      patchState(store, { searchQuery: query, currentPage: 1 });
    },
  }))
);
