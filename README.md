# Revelo — premium used-bike marketplace

A front-end demo of a second-hand bike marketplace: browse, value, buy and sell high-end bikes.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```

## Pages

| Route | What it does |
| --- | --- |
| `/` | Hero search, category tiles, stats, fresh verified listings |
| `/buy`, `/buy/:category` | Listings with brand/model/price/size/groupset/condition filters, sort, search (`?q=`) |
| `/listing/:id` | Gallery, specs tabs, trust panel, make-an-offer, message seller, finance, similar bikes |
| `/value` | Instant valuation with price-trend chart and comparable listings |
| `/sell` | 4-step listing flow (details → photos → recommended price → publish) |
| `/checkout/:id` | Shipping → payment → review → confirmation |
| `/account` | Buying, selling, favourites and settings |
| `/how-it-works`, `/about` | Verification process and company info |

## Notes

- Stack: Vite, React 19, TypeScript, Tailwind CSS v4, React Router, lucide-react.
- Bike imagery is drawn in SVG (`src/components/BikeArt.tsx`), so there are no external image dependencies.
- Data is mocked in `src/data/listings.ts`; favourites, new listings and orders persist to `localStorage`.
- Valuations are a heuristic (`src/lib/valuation.ts`): RRP × age depreciation × groupset × condition.
- No real payments — checkout is a demo.
