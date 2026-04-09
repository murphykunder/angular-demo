import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/main/main.component').then(m => m.MainComponent)
        // redirectTo: 'cart',
        // pathMatch: 'full'
        // loadComponent: () => import('./features/todos/todos.component').then(m => m.TodosComponent)
    },
    {
        path: 'cart',
        loadChildren: () => import('./features/cart/cart-module').then(m => m.CartModule)
    },
    {
        path: 'todos',
        loadComponent: () => import('./features/todos/todos.component').then(m => m.TodosComponent)
    }
];
