# E-commerce Catalog with Nested Document Structure (MongoDB + Mongoose)

This sample project demonstrates an e-commerce catalog using nested MongoDB documents with Mongoose.
It includes:
- `models/product.js` — Mongoose schema with nested subdocuments (categories, variants, images, attributes).
- `routes/products.js` — CRUD routes for products (Express + Mongoose).
- `app.js` — Minimal Express server wiring the routes.
- `seed.js` — Script to insert sample product documents.
- `package.json` — Dependencies and scripts.
- `.gitignore` — Node modules and `.env`.

## Quick start

1. Install dependencies:
```bash
npm install
```

2. Set `MONGODB_URI` env var (or change in code). Example:
```bash
export MONGODB_URI="mongodb://localhost:27017/ecommerce_catalog"
```

3. Seed database:
```bash
node seed.js
```

4. Run server:
```bash
node app.js
```

API endpoints:
- `GET /api/products` — list products
- `GET /api/products/:id` — get single product
- `POST /api/products` — create product
- `PUT /api/products/:id` — update product
- `DELETE /api/products/:id` — delete product

