import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
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

      <div class="navbar__desktop">
        <app-search-bar (search)="search.emit($event)" />
        <button appBtn variant="primary" size="sm" (click)="newTask.emit()">
          <app-icon name="plus" size="sm" /> New Task
        </button>
        <a routerLink="/design-system" appBtn variant="ghost" size="sm">
          <app-icon name="layout-panel-left" size="sm" /> Design System
        </a>
        <button appBtn variant="ghost" size="sm" (click)="themeToggle.emit()" aria-label="Toggle theme">
          <app-icon [name]="theme() === 'dark' ? 'sun' : 'moon'" size="sm" />
        </button>
      </div>

      <div class="navbar__mobile-actions">
        <button appBtn variant="primary" size="sm" (click)="newTask.emit()">
          <app-icon name="plus" size="sm" /> New Task
        </button>
        <button
          class="navbar__hamburger"
          appBtn variant="ghost" size="sm"
          (click)="menuOpen.set(!menuOpen())"
          aria-label="Open menu"
        >
          <app-icon [name]="menuOpen() ? 'x' : 'menu'" size="sm" />
        </button>
      </div>
    </nav>

    @if (menuOpen()) {
      <div class="mobile-menu">
        <app-search-bar (search)="search.emit($event); menuOpen.set(false)" />
        <a routerLink="/design-system" appBtn variant="secondary" (click)="menuOpen.set(false)">
          <app-icon name="layout-panel-left" size="sm" /> Design System
        </a>
        <button appBtn variant="ghost" (click)="themeToggle.emit(); menuOpen.set(false)">
          <app-icon [name]="theme() === 'dark' ? 'sun' : 'moon'" size="sm" />
          {{ theme() === 'dark' ? 'Light mode' : 'Dark mode' }}
        </button>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    .navbar__desktop {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .navbar__mobile-actions {
      display: none;
      align-items: center;
      gap: 6px;
    }

    .navbar__hamburger { display: flex; }

    .mobile-menu {
      display: none;
      flex-direction: column;
      gap: 10px;
      padding: 16px 20px;
      background: oklch(100% 0 0 / 6%);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid var(--glass-border);
      animation: liquid-entrance 0.2s linear(0, 0.6, 1, 1.02, 1) both;
    }

    @media (max-width: 767px) {
      .navbar__desktop { display: none; }
      .navbar__mobile-actions { display: flex; }
      .mobile-menu { display: flex; }
    }
  `],
})
export class AppNavbarComponent {
  theme = input<'dark' | 'light'>('dark');

  search      = output<string>();
  newTask     = output<void>();
  themeToggle = output<void>();

  protected menuOpen = signal(false);
}
