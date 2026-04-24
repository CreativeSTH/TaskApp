import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Task } from '../../../../core/models/task.model';
import { TaskStatusTagComponent } from '../../molecules/task-status-tag/task-status-tag.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskStatusTagComponent, ButtonComponent, IconComponent],
  template: `
    <article class="card animate-liquid">
      <header class="card__header">
        <app-task-status-tag [state]="currentState()" />
        @if (task().completed) {
          <span class="card__completed">
            <app-icon name="check" size="xs" /> Completed
          </span>
        }
      </header>

      <div class="card__body">
        <h3 class="card__title" [class.card__title--done]="task().completed">
          {{ task().title }}
        </h3>
        <p class="card__desc">{{ task().description }}</p>
        <div class="card__meta">
          <app-icon name="calendar" size="xs" />
          <span>{{ task().dueDate }}</span>
        </div>
      </div>

      @if (task().notes.length > 0) {
        @defer (when showNotes(); prefetch on idle) {
          @if (showNotes()) {
            <div class="card__section">
              <button class="card__section-label" aria-expanded="true" (click)="showNotes.set(false)">
                <app-icon name="file-text" size="xs" aria-hidden="true" />
                Notes
                <app-icon name="chevron-up" size="xs" class="card__chevron-right" aria-hidden="true" />
              </button>
              <ul class="card__notes-list">
                @for (note of task().notes; track $index) {
                  <li>{{ note }}</li>
                }
              </ul>
            </div>
          }
        }
        @if (!showNotes()) {
          <button class="card__trigger" aria-expanded="false" (click)="showNotes.set(true)">
            <app-icon name="file-text" size="xs" aria-hidden="true" />
            Show {{ task().notes.length }} {{ task().notes.length === 1 ? 'note' : 'notes' }}
            <app-icon name="chevron-down" size="xs" aria-hidden="true" />
          </button>
        }
      }

      @if (task().stateHistory.length > 1) {
        @if (showHistory()) {
          <div class="card__section">
            <button class="card__section-label" aria-expanded="true" (click)="showHistory.set(false)">
              <app-icon name="clock" size="xs" aria-hidden="true" />
              History
              <app-icon name="chevron-up" size="xs" class="card__chevron-right" aria-hidden="true" />
            </button>
            <ol class="card__timeline">
              @for (entry of task().stateHistory; track $index) {
                <li class="card__timeline-item" [class.card__timeline-item--last]="$last">
                  <span class="card__timeline-dot"></span>
                  <div class="card__timeline-content">
                    <app-task-status-tag [state]="entry.state" />
                    <span class="card__timeline-date">{{ entry.date }}</span>
                  </div>
                </li>
              }
            </ol>
          </div>
        } @else {
          <button class="card__trigger" aria-expanded="false" (click)="showHistory.set(true)">
            <app-icon name="clock" size="xs" aria-hidden="true" />
            {{ task().stateHistory.length }} state changes
            <app-icon name="chevron-down" size="xs" aria-hidden="true" />
          </button>
        }
      }

      <footer class="card__footer">
        <button appBtn variant="ghost" size="sm" (click)="edit.emit(task())">
          <app-icon name="pencil" size="sm" /> Edit
        </button>
        <button appBtn variant="danger" size="sm" (click)="delete.emit(task().id)">
          <app-icon name="trash-2" size="sm" /> Delete
        </button>
      </footer>
    </article>
  `,
  styles: [`
    .card {
      background: var(--glass-bg);
      backdrop-filter: blur(16px) saturate(180%) brightness(1.05);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border: 1px solid var(--glass-border);
      box-shadow: var(--glass-shadow);
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: transform 200ms ease, box-shadow 200ms ease;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        opacity: 0.035;
        mix-blend-mode: overlay;
        pointer-events: none;
        z-index: 0;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 48px oklch(0% 0 0 / 28%);
      }
    }

    .card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px 0;
    }

    .card__completed {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: var(--font-size-xs);
      color: var(--color-success);
      font-weight: 500;
    }

    .card__body {
      padding: 12px 20px 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .card__title {
      font-size: var(--font-size-md);
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.3;

      &--done {
        text-decoration: line-through;
        color: var(--text-secondary);
      }
    }

    .card__desc {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card__meta {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .card__section {
      padding: 12px 20px;
      border-top: 1px solid var(--glass-border);
      animation: fade-in 0.2s ease both;
    }

    .card__section-label {
      display: flex;
      align-items: center;
      gap: 5px;
      width: 100%;
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 10px;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-family: var(--font-sans);
      transition: color 150ms ease;

      &:hover { color: var(--text-secondary); }

      .card__chevron-right { margin-left: auto; }
    }

    .card__notes-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;

      li {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        padding-left: 12px;
        border-left: 2px solid var(--color-primary);
        line-height: 1.4;
        opacity: 0.85;
      }
    }

    .card__trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px;
      background: none;
      border: none;
      border-top: 1px solid var(--glass-border);
      color: var(--text-secondary);
      font-size: var(--font-size-xs);
      cursor: pointer;
      transition: color 150ms ease, background 150ms ease;
      font-family: var(--font-sans);

      &:hover {
        color: var(--color-primary);
        background: oklch(100% 0 0 / 4%);
      }
    }

    .card__timeline {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .card__timeline-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      position: relative;
      padding-bottom: 12px;

      &::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 16px;
        bottom: 0;
        width: 1px;
        background: var(--glass-border);
      }

      &--last {
        padding-bottom: 0;
        &::before { display: none; }
      }
    }

    .card__timeline-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--color-primary);
      border: 2px solid var(--glass-border);
      flex-shrink: 0;
      margin-top: 4px;
    }

    .card__timeline-content {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .card__timeline-date {
      font-size: 0.68rem;
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
    }

    .card__footer {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid var(--glass-border);
      justify-content: flex-end;
    }
  `],
})
export class TaskCardComponent {
  task = input.required<Task>();

  edit   = output<Task>();
  delete = output<string>();

  protected currentState = computed(
    () => this.task().stateHistory.at(-1)?.state ?? 'new'
  );

  protected showNotes   = signal(false);
  protected showHistory = signal(false);
}
