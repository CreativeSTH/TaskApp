import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent],
  template: `
    <div class="paginator">
      <button appBtn variant="ghost" size="sm"
        [disabled]="currentPage() <= 1"
        (click)="prev()">
        <app-icon name="chevron-left" size="sm" />
      </button>

      <span class="info">
        <span class="info__current">{{ currentPage() }}</span>
        <span class="info__sep">/</span>
        <span class="info__total">{{ totalPages() }}</span>
      </span>

      <button appBtn variant="ghost" size="sm"
        [disabled]="currentPage() >= totalPages()"
        (click)="next()">
        <app-icon name="chevron-right" size="sm" />
      </button>
    </div>
  `,
  styles: [`
    .paginator {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: var(--font-size-sm);
      min-width: 64px;
      justify-content: center;
    }

    .info__current { font-weight: 600; color: var(--color-primary); }
    .info__sep     { color: var(--text-muted); }
    .info__total   { color: var(--text-secondary); }
  `],
})
export class PaginatorComponent {
  currentPage = input.required<number>();
  totalPages  = input.required<number>();

  pageChange = output<number>();

  protected prev(): void { this.pageChange.emit(this.currentPage() - 1); }
  protected next(): void { this.pageChange.emit(this.currentPage() + 1); }
}
