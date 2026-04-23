import {
  ChangeDetectionStrategy, Component, forwardRef, input, signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true,
  }],
  template: `
    <input
      class="field"
      [class.field--error]="hasError()"
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="isDisabled() || disabled()"
      [value]="value()"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
  styles: [`
    :host { display: block; width: 100%; }

    .field {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--glass-border);
      background: oklch(100% 0 0 / 6%);
      color: var(--text-primary);
      font-family: var(--font-sans);
      font-size: 0.9rem;
      backdrop-filter: blur(8px);
      transition: border-color 150ms ease, box-shadow 150ms ease;
      outline: none;

      &::placeholder { color: var(--text-muted); }

      &:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-glow);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &--error {
        border-color: var(--color-danger);
        box-shadow: 0 0 0 3px oklch(60% 0.24 25 / 20%);
      }
    }
  `],
})
export class InputComponent implements ControlValueAccessor {
  type        = input<string>('text');
  placeholder = input<string>('');
  hasError    = input(false);
  disabled    = input(false);

  protected value      = signal('');
  protected isDisabled = signal(false);

  private onChange  = (_: string) => {};
  protected onTouched = () => {};

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  writeValue(val: string): void       { this.value.set(val ?? ''); }
  registerOnChange(fn: typeof this.onChange): void   { this.onChange = fn; }
  registerOnTouched(fn: typeof this.onTouched): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void  { this.isDisabled.set(d); }
}
