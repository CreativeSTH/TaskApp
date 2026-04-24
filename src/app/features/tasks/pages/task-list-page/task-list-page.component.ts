import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TaskStore } from '../../../../data-access/task.store';
import { Task, TaskFormValue, TaskStateName } from '../../../../core/models/task.model';
import { ToastService } from '../../../../core/services/toast.service';
import { TaskListTemplateComponent } from '../../templates/task-list-template/task-list-template.component';
import { KanbanColumnComponent, TaskDropEvent } from '../../../../shared/ui/organisms/kanban-column/kanban-column.component';
import { TaskFormComponent } from '../../../../shared/ui/organisms/task-form/task-form.component';
import { ModalShellComponent } from '../../../../shared/ui/molecules/modal-shell/modal-shell.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/molecules/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/ui/molecules/empty-state/empty-state.component';
import { ButtonComponent } from '../../../../shared/ui/atoms/button/button.component';
import { IconComponent } from '../../../../shared/ui/atoms/icon/icon.component';

const STATES: TaskStateName[] = ['new', 'active', 'resolved', 'closed'];

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TaskListTemplateComponent,
    KanbanColumnComponent,
    TaskFormComponent,
    ModalShellComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
    ButtonComponent,
    IconComponent,
  ],
  template: `
    <app-task-list-template
      [theme]="theme()"
      [loading]="store.loading()"
      [selectedState]="selectedState()"
      [countByState]="countByState()"
      (search)="store.setSearch($event)"
      (newTask)="openForm(null)"
      (themeToggle)="toggleTheme()"
      (stateSelect)="selectedState.set($event)"
    >
      @if (store.isEmpty() && !store.loading()) {
        <div class="page__empty-wrapper">
          <app-empty-state
            icon="layout-panel-left"
            title="No tasks found"
            [description]="store.searchQuery()
              ? 'No results for your search. Try a different term.'
              : 'Create your first task to get started.'">
            @if (!store.searchQuery()) {
              <button appBtn variant="primary" size="sm" style="margin-top: 8px" (click)="openForm(null)">
                <app-icon name="plus" size="sm" /> New Task
              </button>
            }
          </app-empty-state>
        </div>
      }

      @for (state of states; track state) {
        <app-kanban-column
          [class.active]="selectedState() === state"
          [state]="state"
          [tasks]="store.paginatedByColumn()[state]"
          [totalCount]="store.tasksByColumn()[state].length"
          [currentPage]="store.columnPages()[state]"
          [totalPages]="store.totalPagesByColumn()[state]"
          [connectedTo]="otherColumns(state)"
          (pageChange)="store.setColumnPage(state, $event)"
          (edit)="openForm($event)"
          (delete)="requestDelete($event)"
          (newTask)="openForm(null)"
          (taskDrop)="handleDrop($event)"
        />
      }
    </app-task-list-template>

    @defer (when showForm()) {
      @if (showForm()) {
        <app-modal-shell (overlayClick)="cancelForm()">
          <app-task-form
            [taskToEdit]="taskToEdit()"
            [availableStates]="store.availableStates()"
            (formSubmit)="handleSubmit($event)"
            (cancel)="cancelForm()"
          />
        </app-modal-shell>
      }
    }

    @defer (when showConfirm()) {
      @if (showConfirm()) {
        <app-modal-shell size="sm" (overlayClick)="cancelDelete()">
          <app-confirm-dialog
            title="Delete task?"
            message="This action is permanent and cannot be undone."
            (confirm)="confirmDelete()"
            (cancel)="cancelDelete()"
          />
        </app-modal-shell>
      }
    }
  `,
  styles: [`
    .page__empty-wrapper {
      min-width: 300px;
      max-width: 600px;
      margin: auto;
    }
  `],
})
export class TaskListPageComponent {
  protected store  = inject(TaskStore);
  private   toast  = inject(ToastService);
  protected states = STATES;

  protected theme           = signal<'dark' | 'light'>('dark');
  protected selectedState   = signal<TaskStateName>('new');
  protected showForm        = signal(false);
  protected showConfirm     = signal(false);
  protected taskToEdit      = signal<Task | null>(null);
  protected pendingDeleteId = signal<string | null>(null);

  protected countByState = computed(() => {
    const byCol = this.store.tasksByColumn();
    return STATES.reduce(
      (acc, s) => ({ ...acc, [s]: byCol[s].length }),
      {} as Record<TaskStateName, number>
    );
  });

  constructor() {
    const saved = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' | null;
    if (saved) this.theme.set(saved);
    this.store.init();
  }

  protected toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
  }

  protected openForm(task: Task | null): void {
    this.taskToEdit.set(task);
    this.showForm.set(true);
  }

  protected cancelForm(): void {
    this.toast.show('No changes were saved', 'info');
    this.showForm.set(false);
    this.taskToEdit.set(null);
  }

  protected handleSubmit(value: TaskFormValue): void {
    const editing = this.taskToEdit();
    if (editing) {
      this.store.updateTask({ ...editing, ...value });
    } else {
      this.store.createTask(value);
    }
    this.showForm.set(false);
    this.taskToEdit.set(null);
  }

  protected requestDelete(id: string): void {
    this.pendingDeleteId.set(id);
    this.showConfirm.set(true);
  }

  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id) this.store.deleteTask(id);
    this.showConfirm.set(false);
    this.pendingDeleteId.set(null);
  }

  protected cancelDelete(): void {
    this.toast.show('Deletion cancelled', 'info');
    this.showConfirm.set(false);
    this.pendingDeleteId.set(null);
  }

  protected otherColumns(state: TaskStateName): string[] {
    return STATES.filter(s => s !== state).map(s => 'drop-' + s);
  }

  protected handleDrop({ task, targetState }: TaskDropEvent): void {
    this.store.updateTask({ ...task, newState: targetState });
  }
}
