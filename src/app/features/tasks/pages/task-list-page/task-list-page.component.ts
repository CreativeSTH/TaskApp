import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  template: `<p>Task List — coming soon</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListPageComponent {}
