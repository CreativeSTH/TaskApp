import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TaskStore } from '../../../../data-access/task.store';
import { Task, TaskFormValue } from '../../../../core/models/task.model';
import { TaskListTemplateComponent } from '../../templates/task-list-template/task-list-template.component';
import { TaskCardComponent } from '../../../../shared/ui/organisms/task-card/task-card.component';
import { TaskFormComponent } from '../../../../shared/ui/organisms/task-form/task-form.component';
import { ModalShellComponent } from '../../../../shared/ui/molecules/modal-shell/modal-shell.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/molecules/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/ui/molecules/empty-state/empty-state.component';
import { ButtonComponent } from '../../../../shared/ui/atoms/button/button.component';
import { IconComponent } from '../../../../shared/ui/atoms/icon/icon.component';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TaskListTemplateComponent,
    TaskCardComponent,
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
      [isEmpty]="store.isEmpty()"
      [currentPage]="store.currentPage()"
      [totalPages]="store.totalPages()"
      (search)="store.setSearch($event)"
      (newTask)="openForm(null)"
      (themeToggle)="toggleTheme()"
      (pageChange)="store.setPage($event)"
    >
      @if (store.isEmpty() && !store.loading()) {
        <div class="page__empty-wrapper">
          <app-empty-state
            icon="list-checks"
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

      @for (task of store.paginatedTasks(); track task.id) {
        <app-task-card
          [task]="task"
          (edit)="openForm($event)"
          (delete)="requestDelete($event)"
        />
      }
    </app-task-list-template>

    @defer (when showForm()) {
      @if (showForm()) {
        <app-modal-shell (overlayClick)="closeForm()">
          <app-task-form
            [taskToEdit]="taskToEdit()"
            [availableStates]="store.availableStates()"
            (formSubmit)="handleSubmit($event)"
            (cancel)="closeForm()"
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
    .page__empty-wrapper { grid-column: 1 / -1; }
  `],
})
export class TaskListPageComponent {
  protected store = inject(TaskStore);

  protected theme           = signal<'dark' | 'light'>('dark');
  protected showForm        = signal(false);
  protected showConfirm     = signal(false);
  protected taskToEdit      = signal<Task | null>(null);
  protected pendingDeleteId = signal<string | null>(null);

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

  protected closeForm(): void {
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
    this.closeForm();
  }

  protected requestDelete(id: string): void {
    this.pendingDeleteId.set(id);
    this.showConfirm.set(true);
  }

  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id) this.store.deleteTask(id);
    this.cancelDelete();
  }

  protected cancelDelete(): void {
    this.showConfirm.set(false);
    this.pendingDeleteId.set(null);
  }
}
