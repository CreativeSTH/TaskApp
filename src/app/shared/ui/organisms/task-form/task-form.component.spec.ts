import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { LUCIDE_ICONS, LucideIconProvider, icons } from 'lucide-angular';
import { TaskFormComponent } from './task-form.component';
import { StateDefinition, Task } from '../../../../core/models/task.model';

const mockStates: StateDefinition[] = [
  { id: 'f68b', name: 'new' },
  { id: 'e92b', name: 'active' },
  { id: 'd03e', name: 'resolved' },
  { id: '58ae', name: 'closed' },
];

const mockTask: Task = {
  id: '1',
  title: 'Existing task',
  description: 'Some description',
  dueDate: '2025-06-01',
  completed: false,
  stateHistory: [
    { state: 'new', date: '2025-01-01' },
    { state: 'active', date: '2025-01-05' },
  ],
  notes: ['Note one', 'Note two'],
};

describe('TaskFormComponent', () => {
  let fixture: ComponentFixture<TaskFormComponent>;
  let component: TaskFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LUCIDE_ICONS, useValue: new LucideIconProvider(icons) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('availableStates', mockStates);
    fixture.detectChanges();
  });

  it('form is invalid when title is empty', () => {
    component.form.controls.title.setValue('');
    expect(component.form.invalid).toBe(true);
  });

  it('form is valid with title, dueDate and first note filled', () => {
    component.form.controls.title.setValue('My Task');
    component.form.controls.dueDate.setValue('2025-12-01');
    component.notesFormArray.controls[0].setValue('A note');
    expect(component.form.valid).toBe(true);
  });

  it('FormArray is invalid when first note is empty', () => {
    component.notesFormArray.controls[0].setValue('');
    expect(component.notesFormArray.invalid).toBe(true);
  });

  it('FormArray is valid when first note has content', () => {
    component.notesFormArray.controls[0].setValue('A note');
    expect(component.notesFormArray.valid).toBe(true);
  });

  it('addNote() appends a control to the FormArray', () => {
    const before = component.notesFormArray.length;
    component['addNote']();
    expect(component.notesFormArray.length).toBe(before + 1);
  });

  it('removeNote() removes the control at the given index', () => {
    component['addNote']();
    const before = component.notesFormArray.length;
    component['removeNote'](1);
    expect(component.notesFormArray.length).toBe(before - 1);
  });

  it('edit mode pre-populates newState with stateHistory.at(-1)', async () => {
    fixture.componentRef.setInput('taskToEdit', mockTask);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.controls.newState.value).toBe('active');
  });

  it('edit mode pre-populates title and dueDate', async () => {
    fixture.componentRef.setInput('taskToEdit', mockTask);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.controls.title.value).toBe('Existing task');
    expect(component.form.controls.dueDate.value).toBe('2025-06-01');
  });

  it('edit mode populates FormArray with task notes', async () => {
    fixture.componentRef.setInput('taskToEdit', mockTask);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.notesFormArray.length).toBe(2);
    expect(component.notesFormArray.at(0).value).toBe('Note one');
  });

  it('select renders an option per availableState', () => {
    const options = fixture.nativeElement.querySelectorAll('select option');
    expect(options.length).toBe(mockStates.length);
  });
});
