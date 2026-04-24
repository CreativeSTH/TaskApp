import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="overlayClick.emit()">
      <div
        class="panel"
        [class.panel--sm]="size() === 'sm'"
        (click)="$event.stopPropagation()"
      >
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: oklch(0% 0 0 / 55%);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fade-in 0.18s ease both;
    }

    .panel {
      width: 100%;
      max-width: 560px;
      max-height: 90dvh;
      overflow-y: auto;
      background: var(--glass-bg);
      backdrop-filter: blur(24px) saturate(200%);
      -webkit-backdrop-filter: blur(24px) saturate(200%);
      border: 1px solid var(--glass-border);
      box-shadow: var(--glass-shadow), 0 32px 80px oklch(0% 0 0 / 40%);
      border-radius: var(--radius-xl);
      animation: liquid-entrance 0.28s linear(0, 0.6, 1, 1.02, 1) both;

      &--sm { max-width: 380px; }
    }
  `],
})
export class ModalShellComponent {
  size = input<'sm' | 'md'>('md');
  overlayClick = output<void>();
}
