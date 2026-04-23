import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeColor = 'success' | 'warning' | 'info' | 'neutral' | 'danger';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge--' + color()">{{ label() }}</span>`,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      border: 1px solid transparent;
      backdrop-filter: blur(8px);
    }

    .badge--success {
      background: oklch(72% 0.20 150 / 15%);
      color: oklch(55% 0.18 150);
      border-color: oklch(72% 0.20 150 / 30%);
    }
    .badge--warning {
      background: oklch(78% 0.19 85 / 15%);
      color: oklch(58% 0.18 75);
      border-color: oklch(78% 0.19 85 / 30%);
    }
    .badge--info {
      background: oklch(68% 0.17 230 / 15%);
      color: oklch(55% 0.17 230);
      border-color: oklch(68% 0.17 230 / 30%);
    }
    .badge--danger {
      background: oklch(60% 0.24 25 / 15%);
      color: oklch(50% 0.22 25);
      border-color: oklch(60% 0.24 25 / 30%);
    }
    .badge--neutral {
      background: oklch(60% 0.02 260 / 15%);
      color: var(--text-secondary);
      border-color: oklch(60% 0.02 260 / 25%);
    }
  `],
})
export class BadgeComponent {
  label = input.required<string>();
  color = input<BadgeColor>('neutral');
}
