# Task Manager

A modern task management application built with Angular 21, NgRx Signal Store, and a custom design system based on Atomic Design principles. Developed as a technical assessment project.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (Standalone, Zoneless) |
| State Management | NgRx Signal Store |
| Styling | SCSS + CSS Custom Properties (OKLch) |
| Icons | Lucide Angular |
| Drag & Drop | Angular CDK |
| Mock API | JSON Server |
| Testing | Vitest + Angular Testing Utilities |
| Language | TypeScript 5.9 (strict mode) |

---

## Features

- **Kanban board** — Tasks organized in four columns: New, Active, Resolved, Closed
- **Drag & drop** — Move tasks between columns; state history is updated automatically
- **Per-column pagination** — Up to 3 cards per column with independent page controls
- **Create / Edit / Delete** tasks via a modal form with dynamic notes array
- **Confirm dialog** before deleting a task
- **Live search** — Filters across all columns simultaneously, resets pagination
- **State history timeline** — Each card shows a collapsible timeline of all state changes
- **Expandable notes** — Loaded lazily with `@defer` to keep initial bundle small
- **Toast notifications** — Contextual success / error feedback on every operation
- **Dark / Light theme** toggle persisted to `data-theme` attribute
- **Responsive design** — Desktop board layout; mobile segmented-control tab navigation
- **HTTP error interceptor** — Catches 0, 404, 500 errors and surfaces user-friendly messages via toast
- **Accessible markup** — `role="dialog"`, `aria-modal`, `aria-expanded`, `aria-hidden` throughout

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 11+
- Angular CLI (`npm install -g @angular/cli`)

### Install dependencies

```bash
npm install
```

### Run the mock API (JSON Server)

The application reads and writes data to a local JSON Server. Start it in a dedicated terminal:

```bash
npm run api
```

This serves the REST API at `http://localhost:3000` using `db.json` at the project root. The endpoints are:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Fetch all tasks |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/states` | Fetch available states |

> Data is **persisted** to `db.json` on disk. Restarting the server does not reset changes.

### Run the Angular dev server

```bash
npm start
```

Open `http://localhost:4200` in your browser.

### Run unit tests

```bash
npm test
```

---

## Project Structure

```
src/
├── styles/
│   ├── _tokens.scss        # Design tokens (colors, spacing, typography, radii)
│   ├── _themes.scss        # Dark / light theme CSS custom properties
│   ├── _glass.scss         # Glass-morphism utility classes
│   └── _animations.scss    # Shared keyframe animations
└── app/
    ├── core/
    │   ├── models/         # TypeScript interfaces and types
    │   ├── services/       # ToastService
    │   └── interceptors/   # HTTP error interceptor
    ├── data-access/
    │   ├── task.service.ts # HTTP REST client
    │   └── task.store.ts   # NgRx Signal Store
    ├── features/
    │   ├── tasks/          # Task list page + layout template
    │   └── design-system/  # Component library showcase page
    └── shared/ui/
        ├── atoms/          # 8 base components
        ├── molecules/      # 9 composite components
        └── organisms/      # 5 feature-rich components
```

---

## Atomic Design

The component library follows the [Atomic Design](https://atomicdesign.bradfrost.com/) methodology strictly. Every UI element lives in exactly one layer.

### Atoms — Base building blocks

| Component | Description |
|---|---|
| `BadgeComponent` | Colored status label |
| `ButtonComponent` | 4 variants (`primary`, `secondary`, `ghost`, `danger`), 3 sizes, loading state |
| `CheckboxComponent` | Styled checkbox input |
| `IconComponent` | Lucide icon wrapper with 5 size presets (`xs` → `xl`) |
| `InputComponent` | Text input field |
| `SkeletonComponent` | Loading placeholder |
| `SpinnerComponent` | Animated loading ring (`sm`, `md`, `lg`) |
| `TextareaComponent` | Textarea input |

### Molecules — Atom combinations

| Component | Description |
|---|---|
| `ConfirmDialogComponent` | Danger confirmation dialog with title, message, confirm / cancel |
| `EmptyStateComponent` | Empty column placeholder with icon and message |
| `FormFieldComponent` | Label + input + validation error wrapper |
| `KanbanTabsComponent` | Mobile segmented control: one tab per state with task count |
| `ModalShellComponent` | Reusable glass overlay + panel (`sm` / `md`) via `ng-content` |
| `NoteFieldRowComponent` | Editable note row with optional delete button |
| `PaginatorComponent` | Previous / next controls with current page indicator |
| `SearchBarComponent` | Search input with clear button |
| `TaskStatusTagComponent` | Color-coded state label (per-state OKLch palette) |

### Organisms — Feature-complete components

| Component | Description |
|---|---|
| `AppNavbarComponent` | Logo + search + actions on desktop; logo + New Task + hamburger on mobile |
| `KanbanColumnComponent` | Full kanban column: header, paginated task list, CDK drop list |
| `TaskCardComponent` | Card with expandable notes (deferred) and collapsible state history timeline |
| `TaskFormComponent` | Reactive form for create / edit with dynamic notes `FormArray` |
| `ToastComponent` | Stacked toast notification display |

### Templates

`TaskListTemplateComponent` — Presentational layout shell: navbar, mobile tabs, horizontal board, spinner.

### Pages

`TaskListPageComponent` — Smart component. Orchestrates the store, handles all user events (create, update, delete, drag & drop, search, pagination, theme toggle), and controls modal visibility.

---

## State Management

The store is built with **NgRx Signal Store** and keeps all application state in one place.

```
TaskStore
├── State
│   ├── tasks[]              Raw task list from the API
│   ├── availableStates[]    State definitions from the API
│   ├── loading              Fetch in-progress flag
│   ├── error                Last error message or null
│   ├── searchQuery          Live search filter
│   ├── columnPages          Per-column current page (Record<TaskStateName, number>)
│   └── pageSize             Cards per column (3)
├── Computed
│   ├── tasksByColumn        Filtered tasks grouped by current state
│   ├── isEmpty              True when no tasks pass the search filter
│   ├── paginatedByColumn    Current page slice per column
│   └── totalPagesByColumn   Total pages per column
└── Methods (rxMethod)
    ├── init()               forkJoin /tasks + /states on load
    ├── createTask()         POST → inserts result into task list
    ├── updateTask()         PUT → replaces task in list
    ├── deleteTask()         DELETE → removes task from list
    ├── setSearch()          Updates query and resets all column pages to 1
    └── setColumnPage()      Updates page for a single column
```

---

## Theming

Two themes are defined via CSS custom properties on the `[data-theme]` attribute:

```scss
[data-theme="dark"]  { --bg-page: ...; --text-primary: ...; ... }
[data-theme="light"] { --bg-page: ...; --text-primary: ...; ... }
```

The root `AppComponent` reads the saved preference from `localStorage` and applies the attribute on init. The navbar theme toggle flips between `dark` and `light` and persists the choice.

All colors use the **OKLch** color space for perceptual uniformity across themes.

---

## Design Tokens

Defined in `src/styles/_tokens.scss` and available globally:

```
--color-primary     --color-success     --color-warning
--color-danger      --color-info

--radius-xs  --radius-sm  --radius-md  --radius-lg  --radius-xl

--space-1 (4px) → --space-12 (48px)

--font-size-xs → --font-size-2xl
--font-sans  --font-mono

--transition-fast (150ms)  --transition-md (250ms)  --transition-slow (400ms)

--glass-bg  --glass-border  --glass-shadow
```

---

## Kanban Board

The board displays one column per task state. Each column:

- Lists tasks filtered by `stateHistory.at(-1).state`
- Paginates at 3 cards per column with independent page controls
- Accepts drops from any other column via `@angular/cdk/drag-drop`
- Shows an `EmptyStateComponent` when no tasks match the active filter

On **mobile** the board collapses to a single-column view controlled by a segmented tab bar (`KanbanTabsComponent`). Each tab shows the state name and current task count; the active tab gets a per-state accent color.

---

## Drag & Drop

Implemented with `@angular/cdk/drag-drop`:

- Each column registers as a `CdkDropList` with `id="drop-{state}"`
- Every card is a `CdkDrag` with `[cdkDragData]="task"`
- Columns are mutually connected via `[cdkDropListConnectedTo]`
- On drop across columns the store calls `updateTask({ ...task, newState: targetState })` which appends a new `StateEntry` to `stateHistory` and PUTs to the API
- A dashed placeholder (`*cdkDragPlaceholder`) shows the drop target position

---

## Testing

**Framework:** Vitest via `@angular/build:unit-test`

```
4 test files | 25 tests | 0 skipped
```

| File | Tests | Coverage |
|---|---|---|
| `task.store.spec.ts` | 9 | Init, pagination, grouping, search, totalPages, isEmpty |
| `task-form.component.spec.ts` | 10 | Validation, FormArray, edit mode pre-population, select options |
| `error.interceptor.spec.ts` | 4 | 500, 404, re-throw, success (no toast) |
| `app.spec.ts` | 1 | Root component creation |

Run with:

```bash
npm test
# or watch mode
npx ng test
```

---

## Design System Showcase

Navigate to `/design-system` (or click **Design System** in the navbar) to explore all components interactively: atoms, molecules, organisms, color tokens, typography scale, and modal/dialog demos.
