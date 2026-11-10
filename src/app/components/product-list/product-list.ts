import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductList {
  @Input() products: Product[] = [];
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(product: Product): void {
    this.addToCart.emit(product);
  }
}
