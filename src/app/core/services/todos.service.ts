import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Todo } from '../models/todo.interface';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../constants/api-endpoint.constant';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private http = inject(HttpClient);
  private url = API_ENDPOINTS.TODOS;

  getTodos(): Observable<Todo[]> { 
    return this.http.get<Todo[]>(this.url)
    .pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to fetch todos. Please try again later.'));
      })
    );
  }
  
}
