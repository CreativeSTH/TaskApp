import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { SkeletonComponent } from '../../shared/ui/atoms/skeleton/skeleton.component';
import { ButtonComponent } from '../../shared/ui/atoms/button/button.component';
import { BadgeComponent } from '../../shared/ui/atoms/badge/badge.component';
import { IconComponent } from '../../shared/ui/atoms/icon/icon.component';
import { SpinnerComponent } from '../../shared/ui/atoms/spinner/spinner.component';
import { InputComponent } from '../../shared/ui/atoms/input/input.component';
import { TextareaComponent } from '../../shared/ui/atoms/textarea/textarea.component';
import { CheckboxComponent } from '../../shared/ui/atoms/checkbox/checkbox.component';

import { FormFieldComponent } from '../../shared/ui/molecules/form-field/form-field.component';
import { SearchBarComponent } from '../../shared/ui/molecules/search-bar/search-bar.component';
import { TaskStatusTagComponent } from '../../shared/ui/molecules/task-status-tag/task-status-tag.component';
import { NoteFieldRowComponent } from '../../shared/ui/molecules/note-field-row/note-field-row.component';
import { PaginatorComponent } from '../../shared/ui/molecules/paginator/paginator.component';
import { EmptyStateComponent } from '../../shared/ui/molecules/empty-state/empty-state.component';

import { TaskCardComponent } from '../../shared/ui/organisms/task-card/task-card.component';
import { TaskFormComponent } from '../../shared/ui/organisms/task-form/task-form.component';

import { ToastService } from '../../core/services/toast.service';
import { StateDefinition, Task, TaskStateName } from '../../core/models/task.model';

@Component({
  selector: 'app-design-system',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, ReactiveFormsModule,
    SkeletonComponent,
    ButtonComponent, BadgeComponent, IconComponent,
    SpinnerComponent, InputComponent, TextareaComponent, CheckboxComponent,
    FormFieldComponent, SearchBarComponent, TaskStatusTagComponent,
    NoteFieldRowComponent, PaginatorComponent, EmptyStateComponent,
    TaskCardComponent, TaskFormComponent,
  ],
  templateUrl: './design-system.component.html',
  styleUrl: './design-system.component.scss',
})
export class DesignSystemComponent {
  private toastService = inject(ToastService);

  protected currentPage = signal(2);
  protected noteCtrl    = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  protected states: TaskStateName[] = ['new', 'active', 'resolved', 'closed'];

  protected mockStates: StateDefinition[] = [
    { id: 'f68b', name: 'new' },
    { id: 'e92b', name: 'active' },
    { id: 'd03e', name: 'resolved' },
    { id: '58ae', name: 'closed' },
  ];

  protected mockTask: Task = {
    id: '1',
    title: 'Implement SignalStore for task management',
    description: 'Create the NgRx SignalStore with state, computed values and rxMethod for async operations.',
    dueDate: '2025-02-20',
    completed: false,
    stateHistory: [
      { state: 'new',    date: '2025-01-01' },
      { state: 'active', date: '2025-01-05' },
    ],
    notes: ['Use forkJoin for parallel HTTP calls', 'Include pagination as computed signal'],
  };

  protected mockCompletedTask: Task = {
    id: '2',
    title: 'Setup Angular 21 with zoneless config',
    description: 'Initialize project, remove zone.js and configure provideZonelessChangeDetection.',
    dueDate: '2025-01-15',
    completed: true,
    stateHistory: [{ state: 'resolved', date: '2025-01-15' }],
    notes: [],
  };

  protected previewIcons = [
    'check', 'circle-check', 'x', 'circle-x', 'trash-2', 'pencil',
    'plus', 'minus', 'search', 'calendar', 'clock', 'chevron-left',
    'chevron-right', 'chevron-down', 'sun', 'moon', 'circle-alert',
    'info', 'triangle-alert', 'list-checks', 'sliders-horizontal', 'move-right',
  ];

  protected onPageChange(p: number): void { this.currentPage.set(p); }

  protected showToast(type: 'success' | 'error' | 'info' | 'warning'): void {
    const msgs = {
      success: 'Task created successfully!',
      error:   'Connection error — please try again.',
      info:    'Changes are being saved...',
      warning: 'Due date is approaching.',
    };
    this.toastService.show(msgs[type], type);
  }
}
