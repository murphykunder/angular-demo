import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cart } from '../models/cart.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { GetAllCartsResponse } from '../models/get-all-carts-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private http = inject(HttpClient);
  
  getAllCarts(): Observable<GetAllCartsResponse> {
    return this.http.get<GetAllCartsResponse>('https://dummyjson.com/carts')
    .pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to fetch carts. Please try again later.'));
      })
    );
  }
}
