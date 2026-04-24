import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeComponent, BadgeColor } from '../../atoms/badge/badge.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { TaskStateName } from '../../../../core/models/task.model';

interface StateConfig {
  label: string;
  color: BadgeColor;
  icon: string;
}

const STATE_MAP: Record<TaskStateName, StateConfig> = {
  new:      { label: 'New',      color: 'info',    icon: 'clock' },
  active:   { label: 'Active',   color: 'warning', icon: 'arrow-right' },
  resolved: { label: 'Resolved', color: 'success', icon: 'circle-check' },
  closed:   { label: 'Closed',   color: 'neutral', icon: 'circle-x' },
};

@Component({
  selector: 'app-task-status-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, IconComponent],
  template: `
    <div class="tag">
      <app-icon [name]="config().icon" size="xs" />
      <app-badge [label]="config().label" [color]="config().color" />
    </div>
  `,
  styles: [`
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  `],
})
export class TaskStatusTagComponent {
  state = input.required<TaskStateName>();

  protected config = computed(() => STATE_MAP[this.state()] ?? STATE_MAP['new']);
}
