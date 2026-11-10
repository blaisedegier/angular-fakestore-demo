import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductList } from '../../components/product-list/product-list';
import { FilterState } from '../../models/FilterState';
import { Subject, BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, map, startWith, catchError, shareReplay } from 'rxjs/operators';
import { DxTextBoxModule, DxSelectBoxModule, DxNumberBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductList, DxTextBoxModule, DxSelectBoxModule, DxNumberBoxModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit, OnDestroy {
  // Dependency injections
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Reactive streams for filters
  private searchSubject = new Subject<string>();
  private categoryFilter$ = new BehaviorSubject<string>('All');
  private priceRange$ = new BehaviorSubject<{ min: number; max: number }>({
    min: 0,
    max: Infinity,
  });
  private ratingFilter$ = new BehaviorSubject<number>(0);
  private sortBy$ = new BehaviorSubject<string>('default');

  // Products observable with error handling
  products$: Observable<Product[]> = this.productService.getProducts().pipe(
    catchError((error) => {
      console.error('Error fetching products', error);
      return of([]);
    }),
    shareReplay(1),
  );

  // Search stream
  search$ = this.searchSubject.pipe(
    distinctUntilChanged(),
    startWith(''),
    map((value) => {
      return value;
    }),
  );

  // Extract unique categories
  categories$: Observable<string[]> = this.products$.pipe(
    map((products) => {
      const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).sort();
      return ['All', ...uniqueCategories];
    }),
  );

  categories = signal<string[]>(['All']);
  // Sort options
  sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
    { value: 'rating-asc', label: 'Rating: Low to High' },
    { value: 'rating-desc', label: 'Rating: High to Low' },
  ];

  // region Getters for current filter values (for template binding)
  get currentCategory(): string {
    return this.categoryFilter$.value;
  }
  get currentSort(): string {
    return this.sortBy$.value;
  }
  get currentPriceRange(): { min: number; max: number } {
    return this.priceRange$.value;
  }
  get currentRating(): number {
    return this.ratingFilter$.value;
  }
  // endregion

  // region Helper getters for template - return number or use a sentinel value
  get priceMinValue(): number {
    const min = this.currentPriceRange.min;
    return min === 0 ? -1 : min;
  }
  get priceMaxValue(): number {
    const max = this.currentPriceRange.max;
    return max === Infinity ? -1 : max;
  }
  get ratingValue(): number {
    const rating = this.currentRating;
    return rating === 0 ? -1 : rating;
  }
  get isPriceMinEmpty(): boolean {
    return this.priceMinValue === -1;
  }
  get isPriceMaxEmpty(): boolean {
    return this.priceMaxValue === -1;
  }
  get isRatingEmpty(): boolean {
    return this.ratingValue === -1;
  }
  // endregion

  // Expose Infinity for template comparison
  readonly Infinity = Infinity;

  // Combined filtered and sorted products
  filteredProducts$: Observable<Product[]> = combineLatest([
    this.products$,
    this.search$,
    this.categoryFilter$,
    this.priceRange$,
    this.ratingFilter$,
    this.sortBy$,
  ]).pipe(
    map(([products, search, category, priceRange, rating, sortBy]) => {
      let filtered = this.filterProducts(products, {
        search,
        category,
        priceRange,
        rating,
        sortBy,
      });
      return this.sortProducts(filtered, sortBy);
    }),
  );

  ngOnInit() {
    // Subscribe to categories to populate the signal
    this.categories$.subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  ngOnDestroy() {
    // Clean up subscriptions (though async pipe handles most of this)
    this.searchSubject.complete();
  }

  // Filter products based on all criteria
  private filterProducts(products: Product[], filters: FilterState): Product[] {
    return products.filter((product) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange.min) return false;
      if (filters.priceRange.max !== Infinity && product.price > filters.priceRange.max) {
        return false;
      }

      // Rating filter
      if (product.rating.rate < filters.rating) return false;

      return true;
    });
  }

  // Sort products
  private sortProducts(products: Product[], sortBy: string): Product[] {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-asc':
        return sorted.sort((a, b) => a.rating.rate - b.rating.rate);
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
      case 'default':
      default:
        return sorted.sort((a, b) => a.id - b.id);
    }
  }

  // region Methods to update filter streams
  updateSearch(value: string): void {
    this.searchSubject.next(value || '');
  }
  updateCategory(value: string): void {
    this.categoryFilter$.next(value);
  }
  updatePriceMin(value: number | null): void {
    const current = this.priceRange$.value;
    this.priceRange$.next({
      min: value ?? 0,
      max: current.max,
    });
  }
  updatePriceMax(value: number | null): void {
    const current = this.priceRange$.value;
    this.priceRange$.next({
      min: current.min,
      max: value ?? Infinity,
    });
  }
  updateRating(value: number | null): void {
    this.ratingFilter$.next(value ?? 0);
  }
  updateSort(value: string): void {
    this.sortBy$.next(value);
  }
  onAddToCart(product: Product): void {
    this.cartService.addItem(product);
  }
  // endregion
}
