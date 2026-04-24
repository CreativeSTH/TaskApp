import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppNavbarComponent } from '../../../../shared/ui/organisms/app-navbar/app-navbar.component';
import { SkeletonComponent } from '../../../../shared/ui/atoms/skeleton/skeleton.component';
import { KanbanTabsComponent } from '../../../../shared/ui/molecules/kanban-tabs/kanban-tabs.component';
import { TaskStateName } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-list-template',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppNavbarComponent, SkeletonComponent, KanbanTabsComponent],
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
          <div class="layout__board layout__board--skeleton">
            @for (col of skeletonCols; track col) {
              <div class="sk-col">
                <div class="sk-col__header">
                  <app-skeleton shape="rect" width="72px" height="24px" />
                  <app-skeleton shape="rect" width="28px" height="20px" />
                </div>
                @for (card of skeletonCards; track card) {
                  <div class="sk-card">
                    <div class="sk-card__header">
                      <app-skeleton shape="rect" width="64px" height="20px" />
                    </div>
                    <div class="sk-card__body">
                      <app-skeleton shape="line" width="85%" height="14px" />
                      <app-skeleton shape="line" width="60%" height="12px" />
                      <app-skeleton shape="line" width="40%" height="11px" />
                    </div>
                    <div class="sk-card__footer">
                      <app-skeleton shape="rect" width="56px" height="28px" />
                      <app-skeleton shape="rect" width="64px" height="28px" />
                    </div>
                  </div>
                }
              </div>
            }
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

    .layout__board {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 16px;
      align-items: flex-start;
      justify-content: center;
      min-height: calc(100dvh - 120px);

      &--skeleton { pointer-events: none; }

      scrollbar-width: thin;
      scrollbar-color: var(--glass-border) transparent;

      &::-webkit-scrollbar { height: 6px; }
      &::-webkit-scrollbar-track { background: transparent; }
      &::-webkit-scrollbar-thumb {
        background: var(--glass-border);
        border-radius: 999px;
      }
    }

    .sk-col {
      min-width: 280px;
      max-width: 320px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 16px;

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
      }
    }

    .sk-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      overflow: hidden;

      &__header {
        padding: 12px 16px 0;
      }

      &__body {
        padding: 10px 16px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      &__footer {
        padding: 10px 16px;
        border-top: 1px solid var(--glass-border);
        display: flex;
        gap: 8px;
        justify-content: flex-end;
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

  protected readonly skeletonCols  = [1, 2, 3, 4];
  protected readonly skeletonCards = [1, 2, 3];
}
