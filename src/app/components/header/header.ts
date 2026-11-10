import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  private cartService = inject(CartService);
  cartItemCount: number = 0;

  ngOnInit() {
    this.cartService.getItems().subscribe(() => {
      this.cartItemCount = this.cartService.getItemCount();
    });
  }
}
