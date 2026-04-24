import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppNavbarComponent } from '../../../../shared/ui/organisms/app-navbar/app-navbar.component';
import { PaginatorComponent } from '../../../../shared/ui/molecules/paginator/paginator.component';
import { SpinnerComponent } from '../../../../shared/ui/atoms/spinner/spinner.component';

@Component({
  selector: 'app-task-list-template',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppNavbarComponent, PaginatorComponent, SpinnerComponent],
  template: `
    <div class="layout">
      <app-navbar
        [theme]="theme()"
        (search)="search.emit($event)"
        (newTask)="newTask.emit()"
        (themeToggle)="themeToggle.emit()"
      />

      <main class="layout__main">
        @if (loading()) {
          <div class="layout__loading">
            <app-spinner size="lg" />
          </div>
        } @else {
          <div class="layout__content">
            <ng-content />
          </div>
        }
      </main>

      @if (!isEmpty() && !loading() && totalPages() > 1) {
        <footer class="layout__footer">
          <app-paginator
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            (pageChange)="pageChange.emit($event)"
          />
        </footer>
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100dvh; background: var(--bg-page); }

    .layout {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }

    .layout__main {
      flex: 1;
      padding: 32px 24px 24px;
      container-type: inline-size;
      container-name: main;
    }

    .layout__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }

    .layout__content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;

      @container main (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @container main (min-width: 960px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .layout__footer {
      padding: 16px 24px 32px;
      display: flex;
      justify-content: center;
      border-top: 1px solid var(--glass-border);
      background: oklch(100% 0 0 / 3%);
      backdrop-filter: blur(12px);
    }
  `],
})
export class TaskListTemplateComponent {
  theme       = input<'dark' | 'light'>('dark');
  loading     = input(false);
  isEmpty     = input(false);
  currentPage = input(1);
  totalPages  = input(1);

  search      = output<string>();
  newTask     = output<void>();
  themeToggle = output<void>();
  pageChange  = output<number>();
}
