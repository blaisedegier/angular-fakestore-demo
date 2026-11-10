import { Product } from './Product';

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
}
