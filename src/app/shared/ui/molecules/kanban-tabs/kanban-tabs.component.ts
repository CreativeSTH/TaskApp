import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TaskStateName } from '../../../../core/models/task.model';
import { IconComponent } from '../../atoms/icon/icon.component';

interface TabConfig {
  label: string;
  icon: string;
  activeBg: string;
  activeColor: string;
  activeBorder: string;
}

const TAB_CONFIG: Record<TaskStateName, TabConfig> = {
  new:      { label: 'New',      icon: 'clock',        activeBg: 'oklch(68% 0.17 230 / 18%)', activeColor: 'oklch(55% 0.17 230)',  activeBorder: 'oklch(68% 0.17 230 / 50%)' },
  active:   { label: 'Active',   icon: 'arrow-right',  activeBg: 'oklch(78% 0.19 85 / 18%)',  activeColor: 'oklch(58% 0.18 75)',   activeBorder: 'oklch(78% 0.19 85 / 50%)'  },
  resolved: { label: 'Resolved', icon: 'circle-check', activeBg: 'oklch(72% 0.20 150 / 18%)', activeColor: 'oklch(55% 0.18 150)',  activeBorder: 'oklch(72% 0.20 150 / 50%)' },
  closed:   { label: 'Closed',   icon: 'circle-x',     activeBg: 'oklch(60% 0.02 260 / 18%)', activeColor: 'var(--text-secondary)', activeBorder: 'oklch(60% 0.02 260 / 40%)' },
};

@Component({
  selector: 'app-kanban-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="segment" role="tablist">
      @for (state of states(); track state) {
        <button
          class="segment__tab"
          role="tab"
          [class.segment__tab--active]="selected() === state"
          [attr.aria-selected]="selected() === state"
          [style.--tab-bg]="configs[state].activeBg"
          [style.--tab-color]="configs[state].activeColor"
          [style.--tab-border]="configs[state].activeBorder"
          (click)="select.emit(state)"
        >
          <app-icon [name]="configs[state].icon" size="sm" />
          <span class="segment__label">{{ configs[state].label }}</span>
          <span class="segment__count">{{ countByState()[state] }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    .segment {
      display: flex;
      width: 100%;
      padding: 6px;
      background: oklch(100% 0 0 / 5%);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      gap: 4px;
    }

    .segment__tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 6px;
      border-radius: calc(var(--radius-md) - 2px);
      border: 1px solid transparent;
      background: transparent;
      cursor: pointer;
      transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
      font-family: var(--font-sans);
      color: var(--text-muted);

      &:hover:not(.segment__tab--active) {
        background: oklch(100% 0 0 / 8%);
        color: var(--text-secondary);
      }

      &--active {
        background: var(--tab-bg);
        border-color: var(--tab-border);
        color: var(--tab-color);
        box-shadow: 0 2px 8px oklch(0% 0 0 / 12%);
      }
    }

    .segment__label {
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .segment__count {
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 1;
      opacity: 0.9;
    }
  `],
})
export class KanbanTabsComponent {
  states       = input<TaskStateName[]>(['new', 'active', 'resolved', 'closed']);
  selected     = input.required<TaskStateName>();
  countByState = input<Record<TaskStateName, number>>({ new: 0, active: 0, resolved: 0, closed: 0 });

  select = output<TaskStateName>();

  protected readonly configs = TAB_CONFIG;
}
