import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="empty">
      <div class="empty__icon">
        <app-icon [name]="icon()" size="xl" />
      </div>
      <p class="empty__title">{{ title() }}</p>
      @if (description()) {
        <p class="empty__desc">{{ description() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: [`
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 48px 24px;
      text-align: center;
    }

    .empty__icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-lg);
      background: oklch(100% 0 0 / 6%);
      border: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }

    .empty__title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
    }

    .empty__desc {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      max-width: 300px;
      line-height: 1.6;
    }
  `],
})
export class EmptyStateComponent {
  icon        = input<string>('list-checks');
  title       = input.required<string>();
  description = input<string>('');
}
