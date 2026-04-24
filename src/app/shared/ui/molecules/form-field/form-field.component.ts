import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field-wrap">
      @if (label()) {
        <label class="label">
          {{ label() }}
          @if (required()) { <span class="required" aria-hidden="true">*</span> }
        </label>
      }
      <ng-content />
      @if (errorMessage()) {
        <span class="error" role="alert">{{ errorMessage() }}</span>
      }
    </div>
  `,
  styles: [`
    .field-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .label {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-secondary);
    }

    .required { color: var(--color-danger); margin-left: 2px; }

    .error {
      font-size: var(--font-size-xs);
      color: oklch(50% 0.22 25);
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `],
})
export class FormFieldComponent {
  label        = input<string>('');
  errorMessage = input<string>('');
  required     = input(false);
}
