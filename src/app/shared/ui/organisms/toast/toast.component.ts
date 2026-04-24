import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastMessage } from '../../../../core/models/task.model';

const TOAST_ICONS: Record<ToastMessage['type'], string> = {
  success: 'circle-check',
  error:   'circle-alert',
  warning: 'triangle-alert',
  info:    'info',
};

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type">
          <app-icon [name]="icon(toast.type)" size="sm" />
          <span class="toast__msg">{{ toast.message }}</span>
          <button class="toast__close" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss">
            <app-icon name="x" size="xs" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      backdrop-filter: blur(16px) saturate(160%);
      -webkit-backdrop-filter: blur(16px) saturate(160%);
      border: 1px solid transparent;
      min-width: 280px;
      max-width: 380px;
      pointer-events: all;
      animation: toast-in 0.3s linear(0, 0.6, 1, 1.02, 1) both;
      box-shadow: 0 8px 32px oklch(0% 0 0 / 30%);

      &--success {
        background: oklch(72% 0.20 150 / 15%);
        border-color: oklch(72% 0.20 150 / 30%);
        color: oklch(60% 0.18 150);
      }
      &--error {
        background: oklch(60% 0.24 25 / 15%);
        border-color: oklch(60% 0.24 25 / 30%);
        color: oklch(52% 0.22 25);
      }
      &--warning {
        background: oklch(78% 0.19 85 / 15%);
        border-color: oklch(78% 0.19 85 / 30%);
        color: oklch(58% 0.18 75);
      }
      &--info {
        background: oklch(68% 0.17 230 / 15%);
        border-color: oklch(68% 0.17 230 / 30%);
        color: oklch(55% 0.17 230);
      }
    }

    .toast__msg {
      flex: 1;
      font-size: var(--font-size-sm);
      font-weight: 500;
      line-height: 1.4;
    }

    .toast__close {
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      padding: 2px;
      display: flex;
      transition: opacity 150ms ease;
      flex-shrink: 0;

      &:hover { opacity: 1; }
    }

    @keyframes toast-in {
      from { opacity: 0; transform: translateX(100%); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `],
})
export class ToastComponent {
  protected toastService = inject(ToastService);

  protected icon(type: ToastMessage['type']): string {
    return TOAST_ICONS[type];
  }
}
