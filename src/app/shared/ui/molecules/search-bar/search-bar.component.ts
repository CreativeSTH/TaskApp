import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent],
  template: `
    <div class="search">
      <app-icon class="search__icon" name="search" size="sm" />
      <input
        class="search__input"
        type="search"
        placeholder="Search tasks..."
        [value]="query()"
        (input)="onInput($event)"
      />
      @if (query()) {
        <button appBtn variant="ghost" size="sm" class="search__clear" (click)="clear()">
          <app-icon name="x" size="xs" />
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .search {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--glass-border);
      background: oklch(100% 0 0 / 6%);
      backdrop-filter: blur(8px);
      transition: border-color 150ms ease, box-shadow 150ms ease;

      &:focus-within {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-glow);
      }
    }

    .search__icon { color: var(--text-muted); flex-shrink: 0; }

    .search__input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font-family: var(--font-sans);
      font-size: var(--font-size-sm);
      outline: none;
      min-width: 0;

      &::placeholder { color: var(--text-muted); }
      &::-webkit-search-cancel-button { display: none; }
    }

    .search__clear { padding: 2px; }
  `],
})
export class SearchBarComponent {
  search = output<string>();

  protected query = signal('');

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.query.set(val);
    this.search.emit(val);
  }

  protected clear(): void {
    this.query.set('');
    this.search.emit('');
  }
}
