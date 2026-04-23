import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/tasks/pages/task-list-page/task-list-page.component').then(
        m => m.TaskListPageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
