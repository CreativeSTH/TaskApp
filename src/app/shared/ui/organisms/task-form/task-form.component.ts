import {
  ChangeDetectionStrategy, Component, effect, inject, input, output,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Task, TaskFormValue, StateDefinition, TaskStateName } from '../../../../core/models/task.model';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { InputComponent } from '../../atoms/input/input.component';
import { CheckboxComponent } from '../../atoms/checkbox/checkbox.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { NoteFieldRowComponent } from '../../molecules/note-field-row/note-field-row.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TitleCasePipe,
    ButtonComponent, IconComponent, InputComponent, CheckboxComponent,
    FormFieldComponent, NoteFieldRowComponent,
  ],
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="submit()">
      <div class="form__header">
        <h2 class="form__title">
          <app-icon [name]="taskToEdit() ? 'pencil' : 'plus'" size="md" />
          {{ taskToEdit() ? 'Edit Task' : 'New Task' }}
        </h2>
        <button type="button" appBtn variant="ghost" size="sm" (click)="cancel.emit()">
          <app-icon name="x" size="sm" />
        </button>
      </div>

      <div class="form__body">
        <app-form-field label="Title" [required]="true"
          [errorMessage]="titleError()">
          <app-input formControlName="title" placeholder="Task title..."
            [hasError]="!!titleError()" />
        </app-form-field>

        <app-form-field label="Description">
          <textarea class="textarea-field" formControlName="description"
            placeholder="Describe the task..." rows="3"></textarea>
        </app-form-field>

        <div class="form__row">
          <app-form-field label="Due Date" [required]="true"
            [errorMessage]="dueDateError()">
            <app-input formControlName="dueDate" type="date"
              [hasError]="!!dueDateError()" />
          </app-form-field>

          <app-form-field label="State" [required]="true">
            <select class="select-field" formControlName="newState">
              @for (s of availableStates(); track s.id) {
                <option [value]="s.name">{{ s.name | titlecase }}</option>
              }
            </select>
          </app-form-field>
        </div>

        <app-form-field>
          <app-checkbox formControlName="completed" label="Mark as completed" />
        </app-form-field>

        <div class="form__notes">
          <div class="form__notes-header">
            <span class="form__notes-label">Notes</span>
            <button type="button" appBtn variant="ghost" size="sm" (click)="addNote()">
              <app-icon name="plus" size="sm" /> Add note
            </button>
          </div>
          <div class="form__notes-list">
            @for (ctrl of noteControls; track $index) {
              <app-note-field-row
                [control]="ctrl"
                [removable]="$index > 0"
                (remove)="removeNote($index)"
              />
            }
          </div>
        </div>
      </div>

      <div class="form__footer">
        <button type="button" appBtn variant="secondary" (click)="cancel.emit()">
          Cancel
        </button>
        <button type="submit" appBtn variant="primary" [disabled]="form.invalid">
          <app-icon [name]="taskToEdit() ? 'check' : 'plus'" size="sm" />
          {{ taskToEdit() ? 'Save Changes' : 'Create Task' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .form {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .form__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px 16px;
      border-bottom: 1px solid var(--glass-border);
    }

    .form__title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
    }

    .form__body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form__row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form__notes-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .form__notes-label {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-secondary);
    }

    .form__notes-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form__footer {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid var(--glass-border);
    }

    .textarea-field {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--glass-border);
      background: oklch(100% 0 0 / 6%);
      color: var(--text-primary);
      font-family: var(--font-sans);
      font-size: 0.9rem;
      backdrop-filter: blur(8px);
      outline: none;
      resize: vertical;
      min-height: 80px;
      transition: border-color 150ms ease, box-shadow 150ms ease;

      &::placeholder { color: var(--text-muted); }
      &:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-glow);
      }
    }

    .select-field {
      width: 100%;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--glass-border);
      background: oklch(100% 0 0 / 6%);
      color: var(--text-primary);
      font-family: var(--font-sans);
      font-size: 0.9rem;
      backdrop-filter: blur(8px);
      outline: none;
      cursor: pointer;
      transition: border-color 150ms ease, box-shadow 150ms ease;

      option {
        background: var(--bg-page);
        color: var(--text-primary);
      }

      &:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-glow);
      }
    }
  `],
})
export class TaskFormComponent {
  taskToEdit      = input<Task | null>(null);
  availableStates = input.required<StateDefinition[]>();

  formSubmit = output<TaskFormValue>();
  cancel     = output<void>();

  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    title:       ['', Validators.required],
    description: [''],
    dueDate:     ['', Validators.required],
    completed:   [false],
    newState:    ['new' as TaskStateName, Validators.required],
    notes:       this.fb.array([
      this.fb.control('', Validators.required),
    ]),
  });

  constructor() {
    effect(() => {
      const task = this.taskToEdit();
      if (task) {
        this.form.patchValue({
          title:       task.title,
          description: task.description,
          dueDate:     task.dueDate,
          completed:   task.completed,
          newState:    task.stateHistory.at(-1)?.state ?? 'new',
        });
        this.notesFormArray.clear();
        const notes = task.notes.length ? task.notes : [''];
        notes.forEach((note, i) =>
          this.notesFormArray.push(
            this.fb.control(note, i === 0 ? Validators.required : [])
          )
        );
      } else {
        this.form.reset();
        this.notesFormArray.clear();
        this.notesFormArray.push(this.fb.control('', Validators.required));
      }
    });
  }

  get notesFormArray() { return this.form.controls.notes; }
  get noteControls()   { return this.notesFormArray.controls as FormControl<string>[]; }

  protected titleError(): string {
    const c = this.form.controls.title;
    return c.invalid && c.touched ? 'Title is required.' : '';
  }

  protected dueDateError(): string {
    const c = this.form.controls.dueDate;
    return c.invalid && c.touched ? 'Due date is required.' : '';
  }

  protected addNote(): void {
    this.notesFormArray.push(this.fb.control(''));
  }

  protected removeNote(index: number): void {
    this.notesFormArray.removeAt(index);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.formSubmit.emit({
      ...raw,
      notes: raw.notes.filter(n => n.trim()),
    });
  }
}
