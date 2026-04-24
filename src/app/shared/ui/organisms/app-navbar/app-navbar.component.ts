import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { SearchBarComponent } from '../../molecules/search-bar/search-bar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent, IconComponent, SearchBarComponent],
  template: `
    <nav class="navbar">
      <div class="navbar__brand">
        <app-icon name="list-checks" size="md" />
        <span class="navbar__logo">TaskFlow</span>
      </div>

      <div class="navbar__center">
        <app-search-bar (search)="search.emit($event)" />
      </div>

      <div class="navbar__actions">
        <button appBtn variant="primary" size="sm" (click)="newTask.emit()">
          <app-icon name="plus" size="sm" />
          New Task
        </button>
        <a routerLink="/design-system" appBtn variant="ghost" size="sm" class="ds-link">
          <app-icon name="layout-panel-left" size="sm" />
          Design System
        </a>
        <button appBtn variant="ghost" size="sm" (click)="themeToggle.emit()" aria-label="Toggle theme">
          <app-icon [name]="theme() === 'dark' ? 'sun' : 'moon'" size="sm" />
        </button>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }

    .navbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 24px;
      background: oklch(100% 0 0 / 6%);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar__brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-primary);
      flex-shrink: 0;
    }

    .navbar__logo {
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .navbar__center {
      flex: 1;
      max-width: 400px;
    }

    .navbar__actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
  `],
})
export class AppNavbarComponent {
  theme = input<'dark' | 'light'>('dark');

  search      = output<string>();
  newTask     = output<void>();
  themeToggle = output<void>();
}
