# Billing POS API

A NestJS backend for a billing/POS application with shop registration, admin and cashier authentication, product catalog management, cart handling, order checkout, and request logging.

## Features

- Shop and business admin registration
- Cashier registration by authenticated admins
- JWT access and refresh token authentication
- Role-based guards for admin and cashier workflows
- Categories, sub-categories, and products
- Cart item add, update, remove, and clear operations
- Order checkout and order management
- Activity and error logs for API requests
- MongoDB persistence with Mongoose
- Swagger API documentation
- Global validation, exception formatting, and response formatting

## Tech Stack

- NestJS 11
- TypeScript
- MongoDB / Mongoose
- Passport JWT
- bcrypt
- Swagger / OpenAPI
- Jest

## Project Structure

```text
src/
  auth/              Authentication, JWT, login, registration
  business-admins/   Business admin users
  cashiers/          Cashier users
  cart/              Cart operations
  category/          Product categories
  common/            Shared decorators, DTOs, enums, filters, interceptors
  logs/              Activity and error logging
  order/             Checkout and order APIs
  product/           Product APIs
  shops/             Shop APIs
  sub-category/      Product sub-categories
  app.module.ts      Root Nest module
  main.ts            Application bootstrap
```

## Requirements

- Node.js 20 or newer recommended
- npm
- MongoDB database

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=7d
GST_PERCENT=5
```

Important: do not use the default JWT secrets in production.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run start:dev
```

The API runs on:

```text
http://localhost:3000
```

Swagger documentation is available at:

```text
http://localhost:3000/api/docs
```

## Available Scripts

```bash
npm run build       # Build the application
npm run start       # Start with Nest CLI
npm run start:dev   # Start in watch mode
npm run start:prod  # Run compiled dist/main.js
npm run lint        # Run ESLint with fixes
npm run format      # Format source and test files
npm run test        # Run unit tests
npm run test:e2e    # Run e2e tests
npm run test:cov    # Run tests with coverage
```

## API Overview

Base URL:

```text
http://localhost:3000
```

Main endpoints:

```text
GET    /                       Health check

POST   /auth/register          Register a shop and admin account
POST   /auth/register-cashier  Register a cashier, admin only
POST   /auth/login             Login and receive tokens
POST   /auth/refresh           Refresh access token

GET    /shops                  List shops
GET    /shops/:id              Get shop by ID

GET    /business-admins        List business admins
GET    /business-admins/:id    Get business admin by ID

GET    /cashiers               List cashiers
GET    /cashiers/:id           Get cashier by ID

POST   /categories             Create category
GET    /categories             List categories
GET    /categories/:id         Get category by ID
PATCH  /categories/:id         Update category
DELETE /categories/:id         Delete category

POST   /sub-categories         Create sub-category
GET    /sub-categories         List sub-categories
GET    /sub-categories/:id     Get sub-category by ID
PATCH  /sub-categories/:id     Update sub-category
DELETE /sub-categories/:id     Delete sub-category

POST   /products               Create product
GET    /products               List products
GET    /products/:id           Get product by ID
PATCH  /products/:id           Update product
DELETE /products/:id           Delete product

POST   /cart/add-item          Add item to cart
PATCH  /cart/update-quantity   Update cart item quantity
DELETE /cart/remove-item/:id   Remove product from cart
DELETE /cart/clear             Clear cart
GET    /cart                   Get current cart

POST   /orders/checkout        Checkout cart
GET    /orders                 List orders
GET    /orders/:id             Get order by ID
DELETE /orders/:id             Delete order

GET    /logs/activity          List activity logs, admin only
GET    /logs/errors            List error logs, admin only
```

Use Swagger at `/api/docs` for request body schemas, query parameters, and authorization details.

## Authentication

Login returns:

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

Protected routes require:

```text
Authorization: Bearer <accessToken>
```

Admins can create cashiers and view logs. Cashiers can access cashier-scoped billing workflows according to the route guards configured in the application.

## Response and Validation

The application uses a global validation pipe with:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Requests with unknown fields or invalid DTO values are rejected. Responses and exceptions are formatted globally through shared interceptors and filters.

## Deployment

Build the app:

```bash
npm run build
```

Start production:

```bash
npm run start:prod
```

Render deployment settings:

```text
Build Command: npm install && npm run build
Start Command: npm start
```

For deployment platforms, configure these environment variables:

```text
PORT
MONGO_URI
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRY
JWT_REFRESH_EXPIRY
GST_PERCENT
```

Make sure `src/logs` is committed to git. The `.gitignore` should ignore only a root runtime logs folder using `/logs`, not the source module.

## License

This project is currently marked as `UNLICENSED`.
