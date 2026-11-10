import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/CartItem';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private get cartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addItem(product: Product): void {
    const currentItems = this.cartItems;
    const existingItem = currentItems.find((item) => item.productId === product.id);

    if (existingItem) {
      // Increment quantity if item already exists
      existingItem.quantity += 1;
      this.cartItemsSubject.next([...currentItems]);
    } else {
      // Add new item
      const newItem: CartItem = {
        productId: product.id,
        product: product,
        quantity: 1,
      };
      this.cartItemsSubject.next([...currentItems, newItem]);
    }
  }

  removeItem(productId: number): void {
    const currentItems = this.cartItems.filter((item) => item.productId !== productId);
    this.cartItemsSubject.next(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.cartItems;
    const item = currentItems.find((item) => item.productId === productId);

    if (item) {
      item.quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
    }
  }

  getItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  getItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}
