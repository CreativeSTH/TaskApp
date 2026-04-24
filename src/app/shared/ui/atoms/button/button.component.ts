import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'button[appBtn], a[appBtn]',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <app-spinner [size]="size() === 'lg' ? 'md' : 'sm'" />
    } @else {
      <ng-content />
    }
  `,
  host: {
    '[class]': '"btn btn--" + variant() + " btn--" + size()',
    '[attr.disabled]': '(disabled() || loading()) ? true : null',
    '[attr.aria-busy]': 'loading()',
    '[attr.aria-disabled]': 'disabled() || loading()',
  },
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: none;
      border-radius: var(--radius-sm);
      font-family: var(--font-sans);
      font-weight: 500;
      cursor: pointer;
      transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
      white-space: nowrap;
      text-decoration: none;
      outline: none;
      position: relative;
      overflow: hidden;

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      &:active:not([disabled]) {
        transform: scale(0.97);
      }

      &[disabled] {
        opacity: 0.45;
        cursor: not-allowed;
        pointer-events: none;
      }
    }

    :host(.btn--sm) { padding: 6px 12px;  font-size: 0.8rem;  }
    :host(.btn--md) { padding: 9px 18px;  font-size: 0.9rem;  }
    :host(.btn--lg) { padding: 12px 24px; font-size: 1rem;    }

    :host(.btn--primary) {
      background: var(--color-primary);
      color: oklch(98% 0 0);
      box-shadow: 0 2px 12px var(--color-primary-glow);

      &:hover:not([disabled]) {
        box-shadow: 0 4px 20px var(--color-primary-glow);
        filter: brightness(1.1);
      }
    }

    :host(.btn--secondary) {
      background: oklch(100% 0 0 / 10%);
      color: var(--text-primary);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(8px);

      &:hover:not([disabled]) {
        background: oklch(100% 0 0 / 16%);
      }
    }

    :host(.btn--ghost) {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid transparent;

      &:hover:not([disabled]) {
        background: oklch(100% 0 0 / 8%);
        color: var(--text-primary);
      }
    }

    :host(.btn--danger) {
      background: oklch(60% 0.24 25 / 15%);
      color: oklch(50% 0.22 25);
      border: 1px solid oklch(60% 0.24 25 / 30%);

      &:hover:not([disabled]) {
        background: oklch(60% 0.24 25 / 25%);
      }
    }
  `],
})
export class ButtonComponent {
  variant  = input<ButtonVariant>('primary');
  size     = input<ButtonSize>('md');
  disabled = input(false);
  loading  = input(false);
}
