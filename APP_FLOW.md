# Billing Application Flow

This file explains how the application works in simple steps.

## 1. Main Idea

The application is built for shops.

A shop can register in the system. After registration, the shop gets an admin account. The admin can then create cashier accounts for the same shop.

Simple real-life example:

```text
Fresh Mart Shop
  - Admin: shop owner or manager
  - Cashier: billing counter staff
```

## 2. Shop Registration

Endpoint:

```http
POST /auth/register
```

This creates two things:

1. A shop record
2. An admin user for that shop

Request example:

```json
{
  "shopName": "Fresh Mart",
  "shopEmail": "owner@freshmart.com",
  "isActive": true,
  "phone": "9999999999",
  "username": "freshmart_admin",
  "password": "password123"
}
```

After this, the shop owner can login using the username and password.

## 3. Login

Endpoint:

```http
POST /auth/login
```

Request example:

```json
{
  "username": "freshmart_admin",
  "password": "password123"
}
```

If login is successful, the API returns:

1. Access token
2. Refresh token
3. Logged-in user details

The access token is used to call protected APIs.

## 4. Token Usage

For protected APIs, send the access token in the request header:

```http
Authorization: Bearer ACCESS_TOKEN_HERE
```

The token contains:

```text
user id
shop id
username
role
```

This helps the backend know which shop and user is making the request.

## 5. Refresh Token

Endpoint:

```http
POST /auth/refresh
```

Request example:

```json
{
  "refreshToken": "REFRESH_TOKEN_HERE"
}
```

The refresh token is not stored in the database.

When refresh is called, the backend checks:

1. Is the refresh token valid?
2. Is it signed with the refresh token secret?
3. Does the user still exist?
4. Is the user active?

If everything is valid, new access and refresh tokens are returned.

## 6. Cashier Registration

Endpoint:

```http
POST /auth/register-cashier
```

Only an admin can create a cashier.

The admin must send the access token in the header.

Request example:

```json
{
  "name": "Cashier One",
  "shopId": "SHOP_MONGO_ID",
  "phone": "8888888888",
  "username": "cashier_01",
  "password": "password123"
}
```

The backend checks that the admin is creating the cashier for the same shop.

This means:

```text
Fresh Mart admin can create Fresh Mart cashier
Fresh Mart admin cannot create cashier for another shop
```

## 7. Roles

There are two roles:

```text
ADMIN
CASHIER
```

Admin can:

```text
manage users
manage categories
manage sub-categories
manage products
view orders
view logs
create cashiers
```

Cashier can:

```text
view categories
view products
manage cart
checkout orders
view orders
```

## 8. Category Flow

Categories are top-level product groups.

Example:

```text
Beverages
Food
Snacks
```

Endpoints:

```http
POST   /categories
GET    /categories
GET    /categories/:id
PATCH  /categories/:id
DELETE /categories/:id
```

Delete is a soft delete. The record is not removed from the database. Instead, `deletedAt` is set.

## 9. Sub-Category Flow

Sub-categories belong to categories.

Example:

```text
Beverages
  - Hot
  - Cold
```

Endpoints:

```http
POST   /sub-categories
GET    /sub-categories
GET    /sub-categories/:id
PATCH  /sub-categories/:id
DELETE /sub-categories/:id
```

## 10. Product Flow

Products belong to sub-categories.

Example:

```text
Beverages > Hot > Coffee
Beverages > Cold > Coke
```

Endpoints:

```http
POST   /products
GET    /products
GET    /products/:id
PATCH  /products/:id
DELETE /products/:id
```

Products can be searched and filtered by category or sub-category.

## 11. Cart Flow

Each cashier has a cart.

The cashier can add products to the cart before billing.

Endpoints:

```http
POST   /cart/add-item
PATCH  /cart/update-quantity
DELETE /cart/remove-item/:productId
DELETE /cart/clear
GET    /cart
```

Example:

```text
Coffee x 2 = 80
Tea x 1 = 15
Subtotal = 95
Tax = calculated using GST_PERCENT
Grand total = subtotal + tax
```

## 12. Checkout and Order Flow

Checkout creates the bill/order.

Endpoint:

```http
POST /orders/checkout
```

Request example:

```json
{
  "paymentMethod": "CASH",
  "discount": 20
}
```

When checkout happens:

1. The backend gets the cashier cart
2. It creates an order
3. It generates an order number
4. It stores the order
5. It clears the cart

Order number example:

```text
ORD-20260530-0001
```

## 13. Logs

The application stores logs automatically.

Activity logs store successful requests.

Error logs store failed requests.

Endpoints:

```http
GET /logs/activity
GET /logs/errors
```

Only admin users can view logs.

## 14. Global Response Format

All successful API responses follow this format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {},
  "path": "/api-path",
  "timestamp": "2026-05-30T00:00:00.000Z"
}
```

Each endpoint can have a custom message using `@Message()`.

## 15. Global Error Format

All error responses follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [],
  "path": "/api-path",
  "timestamp": "2026-05-30T00:00:00.000Z"
}
```

Errors are also saved in the error logs collection.

## 16. Simple Full Flow

```text
1. Shop registers
2. Admin account is created
3. Admin logs in
4. Admin creates categories
5. Admin creates sub-categories
6. Admin creates products
7. Admin creates cashiers
8. Cashier logs in
9. Cashier adds products to cart
10. Cashier checks out
11. Order is created
12. Cart is cleared
13. Logs are saved automatically
```

## 17. Environment Variables

The application uses `.env` values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/billing_application
JWT_ACCESS_SECRET=replace-with-a-strong-access-secret
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_SECRET=replace-with-a-strong-refresh-secret
JWT_REFRESH_EXPIRY=7d
GST_PERCENT=5
```

Use strong secret values before running in production.
