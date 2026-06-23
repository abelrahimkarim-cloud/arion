# API Documentation

## Authentication

### POST /api/admin/login

Request body:

```json
{
  "email": "admin@streetwear.local",
  "password": "Password123!"
}
```

Response:

```json
{
  "access_token": "...",
  "token_type": "Bearer"
}
```

## Public Storefront

### GET /api/categories

- Returns categories

### GET /api/products

- Filters: `category`, `price_min`, `price_max`, `size`, `color`, `sort`, `page`

### GET /api/products/{slug}

- Product detail with variants and gallery

### POST /api/orders

- Create COD order
- Request body:

```json
{
  "name": "Jane Doe",
  "phone": "+1234567890",
  "city": "Paris",
  "address": "123 rue de Lyon",
  "variant_id": 4,
  "quantity": 2,
  "notes": "Please deliver after 5pm"
}
```

## Admin API

Headers:
`Authorization: Bearer {token}`

### GET /api/admin/dashboard

- returns totals and latest orders

### GET /api/admin/orders

- query: `status`, `search`, `page`

### PATCH /api/admin/orders/{id}

- update order status

### GET /api/admin/products

- list products

### POST /api/admin/products

- create product

### PUT /api/admin/products/{id}

- update product

### DELETE /api/admin/products/{id}

- delete product

### GET /api/admin/categories

- list categories

### POST /api/admin/categories

- create category

### PUT /api/admin/categories/{id}

- update category

### DELETE /api/admin/categories/{id}

- delete category

### GET /api/admin/customers

- list customers

### GET /api/admin/settings

- read store settings

### POST /api/admin/settings

- update settings
