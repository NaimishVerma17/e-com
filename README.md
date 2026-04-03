# E-commerce API

Express + TypeScript API for catalog, carts, checkout, and discount codes (in-memory data—fine for local/demo; resets when the process restarts).

## Stack

Node, Express 5, TypeScript, Zod. No database.

## Run it

```bash
npm install
```

Copy or create `.env` (see below), then:

```bash
npm run dev          # dev
npm run build && npm start   # production
```

## Env

| Variable | What it does | Default-ish |
|----------|----------------|---------------|
| `PORT` | HTTP port | `3000` if unset in your code—check `server.ts` / dotenv load |
| `NODE_ENV` | `development` / `production` | optional |
| `NTH_ORDER_FOR_DISCOUNT` | Every nth completed order can trigger auto-generated codes | configured in your env / constants |

Use whatever defaults the project already reads in code; `.env.example` is the source of truth if it exists.

## Routes (quick reference)

Base URL: `http://localhost:<PORT>`

- `GET /health` — liveness
- `GET /items`, `GET /items/:itemId` — catalog
- `POST /users/:userId/cart` — body: `{ itemId, quantity }`
- `GET /users/:userId/cart` — current cart
- `POST /users/:userId/checkout` — body: `{ discountCode? }`
- `GET /admin/stats` — aggregates + code list
- `POST /admin/discount-codes` — body: `{ nthOrder, discountPercentage }` (manual code when rules allow)

Details live in the controllers/services; this file is just orientation.

## Layout

`src/` is the usual split: `routes` → `controllers` → `services` → `repositories` → `models` (stores), plus `validators`, `middlewares`, `utils`. Entry: `server.ts`, app wiring in `app.ts`.
