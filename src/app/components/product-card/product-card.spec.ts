import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', {
      id: 1,
      title: 'Backpack',
      price: 109.95,
      description: 'A test product',
      category: "Men's Clothing",
      image: 'https://example.com/backpack.png',
      rating: { rate: 3.9, count: 120 },
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
