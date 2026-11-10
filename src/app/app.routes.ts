import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () => {
      return import('./pages/products/products').then((m) => m.Products);
    },
  },
  {
    path: 'cart',
    loadComponent: () => {
      return import('./pages/cart/cart').then((m) => m.Cart);
    },
  },
  {
    path: 'contact-us',
    loadComponent: () => {
      return import('./pages/contact/contact').then((m) => m.Contact);
    },
  },
];
