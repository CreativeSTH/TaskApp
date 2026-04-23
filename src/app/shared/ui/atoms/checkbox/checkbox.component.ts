import {
  ChangeDetectionStrategy, Component, forwardRef, input, signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  }],
  template: `
    <label class="wrapper" [class.wrapper--disabled]="isDisabled() || disabled()">
      <span class="box" [class.box--checked]="checked()">
        @if (checked()) {
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <polyline points="1 4 4 7.5 10 1" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
      </span>
      @if (label()) {
        <span class="label-text">{{ label() }}</span>
      }
      <input
        type="checkbox"
        class="sr-only"
        [checked]="checked()"
        [disabled]="isDisabled()"
        (change)="toggle()"
        (blur)="onTouched()"
      />
    </label>
  `,
  styles: [`
    .wrapper {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;

      &--disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .box {
      width: 18px;
      height: 18px;
      border-radius: var(--radius-xs);
      border: 1.5px solid var(--glass-border);
      background: oklch(100% 0 0 / 6%);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
      flex-shrink: 0;
      color: oklch(98% 0 0);

      &--checked {
        background: var(--color-primary);
        border-color: var(--color-primary);
        box-shadow: 0 0 8px var(--color-primary-glow);
      }
    }

    .label-text {
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `],
})
export class CheckboxComponent implements ControlValueAccessor {
  label    = input<string>('');
  disabled = input(false);

  protected checked    = signal(false);
  protected isDisabled = signal(false);

  private onChange  = (_: boolean) => {};
  protected onTouched = () => {};

  protected toggle(): void {
    if (this.isDisabled() || this.disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
  }

  writeValue(val: boolean): void      { this.checked.set(!!val); }
  registerOnChange(fn: typeof this.onChange): void   { this.onChange = fn; }
  registerOnTouched(fn: typeof this.onTouched): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void  { this.isDisabled.set(d); }
}
