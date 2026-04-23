import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="ring" [class]="'size-' + size()"></span>`,
  styles: [`
    :host { display: inline-flex; align-items: center; justify-content: center; }

    .ring {
      border-radius: 50%;
      border: 2px solid oklch(100% 0 0 / 20%);
      border-top-color: var(--color-primary);
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .size-sm  { width: 14px; height: 14px; }
    .size-md  { width: 20px; height: 20px; border-width: 2.5px; }
    .size-lg  { width: 28px; height: 28px; border-width: 3px; }
  `],
})
export class SpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
}
