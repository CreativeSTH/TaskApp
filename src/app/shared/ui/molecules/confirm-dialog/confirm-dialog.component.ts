import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent],
  template: `
    <div class="dialog" role="alertdialog" aria-labelledby="dialog-title" aria-describedby="dialog-msg">
      <div class="dialog__icon" aria-hidden="true">
        <app-icon name="trash-2" size="md" />
      </div>
      <h2 id="dialog-title" class="dialog__title">{{ title() }}</h2>
      <p id="dialog-msg" class="dialog__message">{{ message() }}</p>
      <div class="dialog__actions">
        <button appBtn variant="secondary" (click)="cancel.emit()">
          Cancel
        </button>
        <button appBtn variant="danger" (click)="confirm.emit()">
          <app-icon name="trash-2" size="sm" /> Delete
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 32px 28px 28px;
      text-align: center;
    }

    .dialog__icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-lg);
      background: oklch(60% 0.24 25 / 12%);
      border: 1px solid oklch(60% 0.24 25 / 25%);
      color: oklch(50% 0.22 25);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .dialog__title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .dialog__message {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 280px;
    }

    .dialog__actions {
      display: flex;
      gap: 10px;
      margin-top: 8px;
    }
  `],
})
export class ConfirmDialogComponent {
  title   = input('Are you sure?');
  message = input('This action cannot be undone.');

  confirm = output<void>();
  cancel  = output<void>();
}
