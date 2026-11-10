import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
  });

  it('links to the products and cart pages', () => {
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('a'),
    ).map((a) => a.getAttribute('href'));
    expect(links).toEqual(['/products', '/cart']);
  });
});
