import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { v4 } from 'uuid';

import { Cart, CartItem } from './cart.interfaces';

import { ApiService } from '../core/api.service';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService {
  userId = getUserId();

  /** Key - item id, value - ordered amount */
  #cartSource = new BehaviorSubject<Cart | null>(null);

  cart$ = this.#cartSource.asObservable();

  totalInCart$: Observable<number> = this.cart$.pipe(
    map((cart) => {
      if (!cart?.items.length) {
        return 0;
      }

      return cart.items.map((i) => i.count).reduce((acc, val) => acc + val, 0);
    }),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  readonly products$: Observable<Product[]> =
    this.productsService.getProducts();
  products: Product[] = [];

  constructor(
    injector: Injector,
    private readonly productsService: ProductsService
  ) {
    super(injector);
    this.products$.subscribe((p) => {
      this.products = p;
    });
  }

  getCart(): void {
    const url = this.getUrl('cart', '/api/profile/cart');

    this.http
      .get<any>(url, { params: { user: this.userId } })
      .subscribe((res) => this.handleResponse(res.data.cart));
  }

  handleResponse(cart: Cart): void {
    this.#cartSource.next(cart);
  }

  addItem(id: string): void {
    this.updateCount(id, 1);
  }

  removeItem(id: string): void {
    this.updateCount(id, -1);
  }

  empty(): void {
    this.#cartSource.next(null);
  }

  private updateCount(id: string, type: 1 | -1): void {
    const url = this.getUrl('cart', '/api/profile/cart');

    const cart = this.#cartSource.getValue();

    if (!cart) return;

    const maxCount = this.products.find((p) => p.id === id)?.count || 1;
    let item = cart.items.find((i) => i.productId === id);
    let isNew = false;

    if (item) {
      const currentCount = item.count + type;
      item.count = currentCount > maxCount ? maxCount : currentCount;
      item.count = currentCount < 0 ? 0 : currentCount;
    } else {
      isNew = true;
      item = {
        productId: id,
        count: 1,
      };
    }

    this.http
      .put<any>(url, { cart, item, isNew })
      .subscribe((res) => this.handleResponse(res.data.cart));
  }
}

const getUserId = (): string => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = v4();
    localStorage.setItem('userId', userId);
  }
  console.log('Your userId is: ' + userId);
  return userId;
};
