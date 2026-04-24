import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppNavbarComponent } from '../../../../shared/ui/organisms/app-navbar/app-navbar.component';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppNavbarComponent],
  template: `
    <app-navbar
      [theme]="theme()"
      (themeToggle)="toggleTheme()"
      (newTask)="null"
    />
    <div style="padding: 40px 24px; text-align: center; color: var(--text-secondary)">
      Task list — coming in Phase 5
    </div>
  `,
  styles: [`:host { display: block; min-height: 100dvh; background: var(--bg-page); }`],
})
export class TaskListPageComponent {
  protected theme = signal<'dark' | 'light'>('dark');

  constructor() {
    const saved = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
    if (saved) this.theme.set(saved);
  }

  protected toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
  }
}
