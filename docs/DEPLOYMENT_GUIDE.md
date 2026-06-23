# Deployment Guide

## Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+
- npm or pnpm
- MySQL 8+
- Git
- Docker (optional)

## Backend Setup

1. Open `backend/.env.example` and copy it to `backend/.env`.
2. Update database credentials and JWT settings.
3. Run:

```bash
cd backend
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
```

4. Start the Laravel API server:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## Frontend Setup

1. Install dependencies:

```bash
cd ../frontend
npm install
```

2. Create `.env.local` with backend base URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

3. Run development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Docker Optional

Create containers for PHP, MySQL, and Node if needed. Use the `docker-compose.yml` pattern from the `backend/` and `frontend/` services.

## Admin Login

Default admin credentials seeded:

- Email: `admin@streetwear.local`
- Password: `Password123!`

## Notes

- This project uses JWT authentication for admin APIs.
- Checkout is COD only; orders are created directly without payment gateways.
- WhatsApp order notifications are sent via configured `WHATSAPP_API_URL`.
