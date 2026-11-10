import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/CartItem';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  cartItems: CartItem[] = [];
  total: number = 0;

  ngOnInit() {
    this.cartService.getItems().subscribe((items) => {
      this.cartItems = items;
      this.total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
