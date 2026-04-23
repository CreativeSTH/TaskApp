import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_PX: Record<IconSize, number> = {
  xs: 14, sm: 16, md: 20, lg: 24, xl: 32,
};

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <lucide-icon
      [name]="name()"
      [size]="px()"
      [strokeWidth]="1.75"
      [absoluteStrokeWidth]="true"
    />
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      color: inherit;
    }
  `],
})
export class IconComponent {
  name = input.required<string>();
  size = input<IconSize>('md');

  protected px = computed(() => SIZE_PX[this.size()]);
}
