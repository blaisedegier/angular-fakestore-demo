# angular-fakestore-demo

An Angular 21 storefront that browses the public Fake Store API, with filtering, a cart and a validated contact form.

[![CI](https://github.com/blaisedegier/angular-fakestore-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/blaisedegier/angular-fakestore-demo/actions/workflows/ci.yml)

## What it does

- `/` is a landing page linking to the catalogue and the cart.
- `/products` lists the products from [fakestoreapi.com](https://fakestoreapi.com) with a text
  search over title and description, a category filter, a price range, a minimum rating, and
  sorting by price, name or rating in either direction.
- `/cart` shows what has been added, with quantity controls, removal, a running total and a clear
  button. The header shows a badge with the number of items.
- `/contact-us` is a reactive form with built-in and custom validators (a phone number pattern and
  a minimum word count for the message). A valid submission is shown back on the page.

## How it works

Every page is a standalone component loaded lazily from `app.routes.ts`, so the DevExtreme-heavy
products and contact pages are only downloaded when visited.

The products page is built from RxJS streams rather than imperative state. The product list is
fetched once and shared with `shareReplay(1)`; each filter control pushes into its own `Subject` or
`BehaviorSubject`, and `combineLatest` recomputes the filtered, sorted list whenever any of them
changes. The template renders it through the `async` pipe, so there are no manual subscriptions to
tidy up for the list itself. The category options are derived from the loaded products and held in
a signal.

`ProductService` title-cases the API's categories (`men's clothing` becomes `Men's Clothing`).
`CartService` keeps the cart in a `BehaviorSubject` provided at the root, which is what lets the
header badge and the cart page stay in step.

## Running it

Prerequisites: Node.js 20.19+, 22.12+ or 24+ (CI uses 24, the version the lockfile is generated with) and npm.

```bash
npm ci
npm start          # http://localhost:4200
npm run build      # output in dist/Angular/browser
npm test -- --watch=false
```

The UI controls are DevExtreme, which reads its licence key from `NG_APP_DEVEXTREME_LICENSE` via
`@ngx-env/builder`. Copy `.env.example` to `.env` and set the key there; `.env` is gitignored.
Without a key the app still runs, but DevExtreme shows its unlicensed-use banner.

The tests run under Vitest with jsdom. `vitest.config.ts` tells Vite to process DevExtreme itself,
because its packages use directory imports that Node's ES module loader rejects.

A multi-stage `Dockerfile` builds the app with Node 24 and serves `dist/Angular/browser` from nginx
with a fallback to `index.html` for client-side routes.

## Tech

Angular 21 (standalone components, signals, reactive forms), RxJS, DevExtreme, Vitest, nginx.

## Known limitations

- The cart lives in memory and is lost on a page reload.
- Filtering and sorting happen in the browser over the full product list, which suits the small
  Fake Store catalogue but would not scale to a real one.
- Prices are shown with an `R` prefix but are the API's values unconverted.
- The contact form does not send anything; it validates and displays the submission.
- Unit tests check that each page and component renders, plus the landing page and header links;
  they do not exercise the filtering logic.
- DevExtreme is a commercial library and needs a licence key to run without the banner.

## Licence

MIT. See [LICENSE](LICENSE). DevExtreme is licensed separately by DevExpress.
