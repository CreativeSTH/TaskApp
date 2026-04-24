import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { TextareaComponent } from '../../atoms/textarea/textarea.component';

@Component({
  selector: 'app-note-field-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, TextareaComponent],
  template: `
    <div class="note-row">
      <app-textarea
        class="note-row__field"
        placeholder="Add a note..."
        [rows]="2"
        [hasError]="control().invalid && control().touched"
        [formControl]="control()"
      />
      @if (removable()) {
        <button appBtn variant="ghost" size="sm" class="note-row__remove"
          type="button"
          (click)="remove.emit()">
          <app-icon name="trash-2" size="sm" />
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .note-row {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    .note-row__field { flex: 1; }

    .note-row__remove {
      flex-shrink: 0;
      margin-top: 4px;
      color: var(--color-danger);
      opacity: 0.7;
      transition: opacity 150ms ease;

      &:hover { opacity: 1; }
    }
  `],
})
export class NoteFieldRowComponent {
  control  = input.required<FormControl<string>>();
  removable = input(true);

  remove = output<void>();
}
