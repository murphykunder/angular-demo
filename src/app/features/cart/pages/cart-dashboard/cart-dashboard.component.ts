import { AfterViewInit, Component, inject } from '@angular/core';
import { TableColumn, TableComponent } from '../../../../shared/components/table/table.component';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../../../../core/models/cart.interface';
import { CartService } from '../../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.interface';
import { GetAllCartsResponse } from '../../../../core/models/get-all-carts-response.interface';

@Component({
  selector: 'app-cart-dashboard',
  imports: [
    CommonModule,
    TableComponent,
  ],
  templateUrl: './cart-dashboard.component.html',
  styleUrl: './cart-dashboard.component.scss',
})
export class CartDashboardComponent implements AfterViewInit {

  cartService = inject(CartService);
  private cartSubject = new BehaviorSubject<Cart[]>([]);
  cart$ = this.cartSubject.asObservable();
  cartColumns: TableColumn<Cart>[] = [
    {
      key: 'id',
      label: 'Cart ID',
      sortable: true,
      width: '10%',
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      draggable: true,
      resizable: true,
      width: '20%',
    },
    {
      key: 'discountedTotal',
      label: 'Discounted Total',
      sortable: true,
      draggable: true,
      resizable: true,
      width: '20%',
    },
    {
      key: 'userId',
      label: 'User ID',
      sortable: true,
      draggable: true,
      resizable: true,
      width: '10%',
    },
    {
      key: 'totalProducts',
      label: 'Total Products',
      sortable: true,
      draggable: true,
      resizable: true,
      width: '10%',
    },
    {
      key: 'totalQuantity',
      label: 'Total Quantity',
      sortable: true,
      draggable: true,
      resizable: true,
    }
  ]

  productColumns: TableColumn<Product>[] = [
    {
      key: 'id',
      label: 'Product ID',
    },
    {
      key: 'title',
      label: 'Product Title',
    },
    {
      key: 'price',
      label: 'Product Price',
    },
    {
      key: 'quantity',
      label: 'Quantity', 
    },
    {
      key: 'total',
      label: 'Total',
    }, 
    {
      key: 'discountPercentage',
      label: 'Discount Percentage',
    },
    {
      key: 'discountedTotal',
      label: 'Discounted Total',
    }
  ];


  ngAfterViewInit(): void {
    this.cartService.getAllCarts().subscribe({
      next: (response: GetAllCartsResponse) => {
        this.cartSubject.next(response.carts);
      },
      error: (error) => {
        console.error('Error fetching carts:', error);
      }
    })
  }

}
