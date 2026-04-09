import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'cart',
        pathMatch: 'full'
        // loadComponent: () => import('./features/todos/todos.component').then(m => m.TodosComponent)
    },
    {
        path: 'cart',
        loadChildren: () => import('./features/cart/cart-module').then(m => m.CartModule)
    }
];
