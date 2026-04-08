import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Todo } from '../models/todo.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private http = inject(HttpClient);

  getTodos(): Observable<Todo[]> { 
    return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
    .pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to fetch todos. Please try again later.'));
      })
    );
  }
  
}
