export interface FilterState {
  search: string;
  category: string;
  priceRange: { min: number; max: number };
  rating: number;
  sortBy: string;
}
