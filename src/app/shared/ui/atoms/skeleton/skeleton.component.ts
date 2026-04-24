import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SkeletonShape = 'line' | 'circle' | 'rect';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="skeleton" [class]="'skeleton--' + shape()"
    [style.width]="width()" [style.height]="height()"></span>`,
  styles: [`
    .skeleton {
      display: block;
      border-radius: var(--radius-sm);
      background: linear-gradient(
        90deg,
        oklch(100% 0 0 / 6%) 0%,
        oklch(100% 0 0 / 12%) 40%,
        oklch(100% 0 0 / 6%) 80%
      );
      background-size: 200% 100%;
      animation: shimmer 1.6s ease-in-out infinite;

      &--line   { border-radius: 999px; height: 12px; width: 100%; }
      &--circle { border-radius: 50%; }
      &--rect   { border-radius: var(--radius-md); }
    }

    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class SkeletonComponent {
  shape  = input<SkeletonShape>('line');
  width  = input<string>('100%');
  height = input<string>('12px');
}
