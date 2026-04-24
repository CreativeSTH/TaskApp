import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppNavbarComponent } from '../../../../shared/ui/organisms/app-navbar/app-navbar.component';
import { SpinnerComponent } from '../../../../shared/ui/atoms/spinner/spinner.component';
import { KanbanTabsComponent } from '../../../../shared/ui/molecules/kanban-tabs/kanban-tabs.component';
import { TaskStateName } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-list-template',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppNavbarComponent, SpinnerComponent, KanbanTabsComponent],
  template: `
    <div class="layout">
      <app-navbar
        [theme]="theme()"
        (search)="search.emit($event)"
        (newTask)="newTask.emit()"
        (themeToggle)="themeToggle.emit()"
      />

      <div class="layout__tabs">
        <app-kanban-tabs
          [selected]="selectedState()"
          [countByState]="countByState()"
          (select)="stateSelect.emit($event)"
        />
      </div>

      <main class="layout__main">
        @if (loading()) {
          <div class="layout__loading">
            <app-spinner size="lg" />
          </div>
        } @else {
          <div class="layout__board">
            <ng-content />
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100dvh; background: var(--bg-page); }

    .layout {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }

    .layout__tabs {
      display: none;
      padding: 12px 16px;
      border-bottom: 1px solid var(--glass-border);
      background: oklch(100% 0 0 / 3%);
      backdrop-filter: blur(12px);
    }

    .layout__main {
      flex: 1;
      padding: 24px;
      overflow: hidden;
    }

    .layout__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }

    .layout__board {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 16px;
      align-items: flex-start;
      justify-content: center;
      min-height: calc(100dvh - 120px);

      scrollbar-width: thin;
      scrollbar-color: var(--glass-border) transparent;

      &::-webkit-scrollbar { height: 6px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb {
        background: var(--glass-border);
        border-radius: 999px;
      }
    }

    @media (max-width: 767px) {
      .layout__tabs { display: block; }

      .layout__main { padding: 16px; }

      .layout__board {
        flex-direction: column;
        overflow-x: visible;
        gap: 0;
        min-height: unset;
      }
    }
  `],
})
export class TaskListTemplateComponent {
  theme         = input<'dark' | 'light'>('dark');
  loading       = input(false);
  selectedState = input<TaskStateName>('new');
  countByState  = input<Record<TaskStateName, number>>({ new: 0, active: 0, resolved: 0, closed: 0 });

  search      = output<string>();
  newTask     = output<void>();
  themeToggle = output<void>();
  stateSelect = output<TaskStateName>();
}
