import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CdkDropList, CdkDrag, CdkDragDrop, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { Task, TaskStateName } from '../../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskStatusTagComponent } from '../../molecules/task-status-tag/task-status-tag.component';
import { PaginatorComponent } from '../../molecules/paginator/paginator.component';
import { EmptyStateComponent } from '../../molecules/empty-state/empty-state.component';

const EMPTY_CONFIG: Record<TaskStateName, { icon: string }> = {
  new:      { icon: 'clock' },
  active:   { icon: 'arrow-right' },
  resolved: { icon: 'circle-check' },
  closed:   { icon: 'circle-x' },
};

export interface TaskDropEvent {
  task: Task;
  targetState: TaskStateName;
}

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkDropList, CdkDrag, CdkDragPlaceholder,
    TaskCardComponent, TaskStatusTagComponent, PaginatorComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="column">
      <header class="column__header">
        <app-task-status-tag [state]="state()" />
        <span class="column__badge">{{ totalCount() }}</span>
      </header>

      <div
        class="column__body"
        cdkDropList
        [id]="'drop-' + state()"
        [cdkDropListData]="tasks()"
        [cdkDropListConnectedTo]="connectedTo()"
        (cdkDropListDropped)="onDrop($event)"
      >
        @for (task of tasks(); track task.id) {
          <div cdkDrag [cdkDragData]="task" class="card-drag-wrapper">
            <app-task-card
              [task]="task"
              (edit)="edit.emit($event)"
              (delete)="delete.emit($event)"
            />
            <div class="card-drag-placeholder" *cdkDragPlaceholder></div>
          </div>
        } @empty {
          <app-empty-state [icon]="emptyConfig.icon" title="No tasks" />
        }
      </div>

      @if (totalPages() > 1) {
        <footer class="column__footer">
          <app-paginator
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            (pageChange)="pageChange.emit($event)"
          />
        </footer>
      }
    </div>
  `,
  styles: [`
    @media (max-width: 767px) {
      :host { display: none; }
      :host(.active) { display: block; width: 100%; }
    }

    .column {
      display: flex;
      flex-direction: column;
      min-width: 300px;
      max-width: 340px;
      flex: 1;

      @media (max-width: 767px) {
        min-width: auto;
        max-width: none;
        width: 100%;
      }

      background: var(--glass-bg);
      backdrop-filter: blur(16px) saturate(160%);
      -webkit-backdrop-filter: blur(16px) saturate(160%);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      animation: liquid-entrance 0.35s linear(0, 0.6, 1, 1.02, 1) both;
    }

    .column__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--glass-border);
      background: oklch(100% 0 0 / 3%);
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .column__badge {
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      border-radius: 999px;
      background: oklch(100% 0 0 / 10%);
      border: 1px solid var(--glass-border);
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .column__body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      flex: 1;
      overflow-y: auto;
      max-height: calc(100dvh - 220px);
      min-height: 80px;

      @media (max-width: 767px) {
        max-height: none;
        overflow-y: visible;
      }
    }

    .column__footer {
      padding: 10px 12px;
      border-top: 1px solid var(--glass-border);
      display: flex;
      justify-content: center;
      background: oklch(100% 0 0 / 2%);
    }

    .card-drag-wrapper {
      cursor: grab;
      &:active { cursor: grabbing; }
    }

    .card-drag-placeholder {
      height: 80px;
      border-radius: var(--radius-lg);
      border: 2px dashed var(--color-primary);
      background: oklch(100% 0 0 / 4%);
      opacity: 0.6;
    }

    :host ::ng-deep .cdk-drag-preview {
      opacity: 0.85;
      transform: rotate(1.5deg);
      box-shadow: 0 20px 40px oklch(0% 0 0 / 35%);
      border-radius: var(--radius-lg);
    }

    :host ::ng-deep .cdk-drag-animating {
      transition: transform 200ms ease;
    }

    :host ::ng-deep .cdk-drop-list-dragging .card-drag-wrapper:not(.cdk-drag-placeholder) {
      transition: transform 200ms ease;
    }
  `],
})
export class KanbanColumnComponent {
  state       = input.required<TaskStateName>();
  tasks       = input<Task[]>([]);
  totalCount  = input(0);
  currentPage = input(1);
  totalPages  = input(1);
  connectedTo = input<string[]>([]);

  edit       = output<Task>();
  delete     = output<string>();
  newTask    = output<void>();
  pageChange = output<number>();
  taskDrop   = output<TaskDropEvent>();

  get emptyConfig() { return EMPTY_CONFIG[this.state()]; }

  protected onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) return;
    const task: Task = event.item.data;
    this.taskDrop.emit({ task, targetState: this.state() });
  }
}
