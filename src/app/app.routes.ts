import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/tasks/pages/task-list-page/task-list-page.component').then(
        m => m.TaskListPageComponent
      ),
  },
  {
    path: 'design-system',
    loadComponent: () =>
      import('./features/design-system/design-system.component').then(
        m => m.DesignSystemComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
