import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/todos/todos.component').then(m => m.TodosComponent)
    }
];
