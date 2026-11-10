import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/Product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Modern way to inject dependencies
  private http = inject(HttpClient);

  // URL for the fake API
  private apiUrl = 'https://fakestoreapi.com/products';

  getProducts(): Observable<Product[]> {
    // This returns an "Observable" (a stream of data)
    // The <Product[]> tells TypeScript what shape the data will be
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map((products) =>
        products.map((product) => ({
          ...product,
          category: this.toTitleCase(product.category),
        })),
      ),
    );
  }

  // Helper method to convert text to Title Case
  private toTitleCase(text: string): string {
    if (!text) return text;

    return text
      .toLowerCase()
      .split(/\s+/)
      .map((word) => {
        if (!word) return word;

        // Handle words with apostrophes (e.g., "men's")
        if (word.includes("'")) {
          const parts = word.split("'");
          return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + "'" + parts[1];
        }

        // Handle words with hyphens (e.g., "non-fiction")
        if (word.includes('-')) {
          return word
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('-');
        }

        // Capitalize first letter of regular words
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
}
