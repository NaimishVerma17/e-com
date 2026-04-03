# Design Decisions

Short notes on why things are built this way.

---

## Decision 1: Layered Architecture (Repository-Service-Controller Pattern)

**Options Considered:**
- **Option A**: MVC with DB access in controllers
- **Option B**: Repository → Service → Controller
- **Option C**: Full clean architecture / use cases

**Choice:** Option B — same layering as the reference.

**Why:**
- Keeps models, repos, services, controllers, and routes in familiar roles.
- Services hold business logic and are easy to test with mocked repos.
- Swapping in-memory stores for a real DB later is mostly a repo change.

---

## Decision 2: In-Memory Storage with Class-Based Stores

**Context:** In-memory storage was allowed; no DB required.

**Options Considered:**
- **Option A**: Plain objects/arrays
- **Option B**: Classes with methods around the data
- **Option C**: Something file-based like lowdb

**Choice:** Option B — class-based stores, exported as singletons.

**Why:**
- Data and access patterns stay in one place; easy to seed in constructors.
- Fits TypeScript well. Data resets on restart, which is fine for the brief.

---

## Decision 3: Validation with Zod Instead of Manual Validation

**Context:** Request bodies need validation before use.

**Options Considered:**
- **Option A**: Ad-hoc checks in controllers
- **Option B**: express-validator
- **Option C**: Zod
- **Option D**: Joi

**Choice:** Option C — Zod.

**Why:**
- Schemas double as types in TS. Matches the reference stack and keeps errors predictable.

---

## Decision 4: Error Handling with Custom AppError Class

**Context:** Errors should look the same across routes.

**Options Considered:**
- **Option A**: Raw `Error` + message
- **Option B**: One `AppError` with HTTP status (and optional detail)
- **Option C**: Many small error classes
- **Option D**: App error codes only, no HTTP mapping

**Choice:** Option B

**Why:**
- Global handler can map `AppError` to JSON and status once. Simple to throw from services.

---

## Decision 5: Stock Management at Checkout, Not at Cart Addition

**Context:** When to decrement stock wasn’t spelled out.

**Options Considered:**
- **Option A**: Deduct on add-to-cart
- **Option B**: Reserve on cart, deduct at checkout
- **Option C**: Check on add, deduct only at checkout

**Choice:** Option C — validate when adding; deduct at successful checkout.

**Why:**
- Abandoned carts don’t tie up inventory. Re-check at checkout to avoid overselling without temporary reservations.

---

## Decision 6: Environment-Based Configuration Instead of Hardcoded Values

**Context:** Things like nth-order threshold shouldn’t be baked into code.

**Options Considered:**
- **Option A**: Constants in source
- **Option B**: `dotenv` + env vars
- **Option C**: JSON config files
- **Option D**: Config in DB

**Choice:** Option B with sensible defaults in code.

**Why:**
- Normal way to differ dev/stage/prod without rebuilds.