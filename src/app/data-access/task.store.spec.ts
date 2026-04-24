import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskStore, STORE_INIT_DELAY } from './task.store';
import { Task, StateDefinition } from '../core/models/task.model';

const mockStates: StateDefinition[] = [
  { id: 'f68b', name: 'new' },
  { id: 'e92b', name: 'active' },
  { id: 'd03e', name: 'resolved' },
  { id: '58ae', name: 'closed' },
];

const makeTask = (id: string, title: string, state = 'new' as Task['stateHistory'][0]['state']): Task => ({
  id,
  title,
  description: `Description ${id}`,
  dueDate: '2025-01-01',
  completed: false,
  stateHistory: [{ state, date: '2025-01-01' }],
  notes: [],
});

describe('TaskStore', () => {
  let store: InstanceType<typeof TaskStore>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        TaskStore,
        { provide: STORE_INIT_DELAY, useValue: 0 },
      ],
    });
    store = TestBed.inject(TaskStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const flushInit = (tasks: Task[], states = mockStates) => {
    store.init();
    http.expectOne('http://localhost:3000/tasks').flush(tasks);
    http.expectOne('http://localhost:3000/states').flush(states);
    TestBed.flushEffects();
  };

  it('loads tasks and availableStates via forkJoin on init()', () => {
    const tasks = [makeTask('1', 'Task A'), makeTask('2', 'Task B')];
    flushInit(tasks);
    expect(store.tasks().length).toBe(2);
    expect(store.availableStates().length).toBe(4);
  });

  it('paginatedByColumn returns correct slice for page 1', () => {
    const tasks = Array.from({ length: 5 }, (_, i) => makeTask(String(i + 1), `Task ${i + 1}`, 'new'));
    flushInit(tasks);
    expect(store.paginatedByColumn()['new'].length).toBe(3);
  });

  it('paginatedByColumn advances correctly on setColumnPage()', () => {
    const tasks = Array.from({ length: 5 }, (_, i) => makeTask(String(i + 1), `Task ${i + 1}`, 'new'));
    flushInit(tasks);
    store.setColumnPage('new', 2);
    expect(store.paginatedByColumn()['new'].length).toBe(2);
  });

  it('tasksByColumn groups tasks by current state', () => {
    const tasks = [
      makeTask('1', 'New task', 'new'),
      makeTask('2', 'Active task', 'active'),
      makeTask('3', 'Active task 2', 'active'),
    ];
    flushInit(tasks);
    expect(store.tasksByColumn()['new'].length).toBe(1);
    expect(store.tasksByColumn()['active'].length).toBe(2);
    expect(store.tasksByColumn()['resolved'].length).toBe(0);
  });

  it('totalPagesByColumn is correct with N tasks', () => {
    const tasks = Array.from({ length: 7 }, (_, i) => makeTask(String(i + 1), `Task ${i + 1}`, 'active'));
    flushInit(tasks);
    expect(store.totalPagesByColumn()['active']).toBe(3);
  });

  it('isEmpty is true when no tasks match searchQuery', () => {
    flushInit([makeTask('1', 'Hello world', 'new')]);
    store.setSearch('zzznomatch');
    expect(store.isEmpty()).toBe(true);
  });

  it('isEmpty is false when tasks exist', () => {
    flushInit([makeTask('1', 'Hello world', 'new')]);
    expect(store.isEmpty()).toBe(false);
  });

  it('setSearch resets all columnPages to 1', () => {
    flushInit([makeTask('1', 'Task', 'new')]);
    store.setColumnPage('new', 3);
    store.setSearch('task');
    expect(store.columnPages()['new']).toBe(1);
  });

  it('current state derives from stateHistory.at(-1)', () => {
    const task = {
      ...makeTask('1', 'Multi-state'),
      stateHistory: [
        { state: 'new' as const, date: '2025-01-01' },
        { state: 'active' as const, date: '2025-01-05' },
        { state: 'resolved' as const, date: '2025-01-10' },
      ],
    };
    flushInit([task]);
    expect(store.tasksByColumn()['resolved'].length).toBe(1);
    expect(store.tasksByColumn()['new'].length).toBe(0);
  });

  it('availableStates from /states endpoint populates the store', () => {
    flushInit([], mockStates);
    expect(store.availableStates().map(s => s.name)).toEqual(['new', 'active', 'resolved', 'closed']);
  });
});
