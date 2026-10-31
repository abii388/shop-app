<!-- # Shop App

Mini e-commerce app built with Django, React and PostgreSQL.

## Setup
_Instructions will be added as the project is built._ -->

# Shop App

A mini e-commerce application for a small electronics shop.

- **Backend:** Django + Django REST Framework
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Frontend:** React (Vite)

---

## Features

| Feature | Status |
|---------|--------|
| Login with email and password (hashed passwords, JWT) | Done |
| Stay logged in after page refresh | Done (backend `/me/` endpoint ready) |
| Product list with search | Done (API) |
| Product detail | Done (API) |
| Cart: add, view with total, remove | Done (API) |
| Admin: add, edit, delete products | Done (API, admin only) |


---

## Project structure

```
shop-app/
├── backend/
│   ├── config/          # Django settings and main URLs
│   ├── users/           # Custom User model, login and me views, seed_users command
│   ├── products/        # Product model, product APIs, IsAdmin permission, seed_products command
│   ├── cart/            # CartItem model and cart APIs
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/            # React app (Vite)
│   └── .env.example
└── README.md
```

---

## Requirements

- Python 3.10 or newer
- Node.js v24.20.0
- PostgreSQL

---

## Backend setup

**1. Create the database**

```bash
psql -U postgres -c "CREATE DATABASE shop_db;"
```

**2. Create a virtual environment and install packages**

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**3. Create the `.env` file**

```bash
cp .env.example .env            # Windows: copy .env.example .env
```

Open `.env` and fill in your values:

```
SECRET_KEY=any-long-random-string
DEBUG=True
DB_NAME=shop_db
DB_USER=postgres
DB_PASSWORD=your-postgres-password
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**4. Create the tables and add test data**

```bash
python manage.py migrate
python manage.py seed_users
python manage.py seed_products
```

- `seed_users` creates the admin and customer accounts.
- `seed_products` adds 8 sample products.
- Both commands are safe to run again. They do not create duplicates.

**5. Start the server**

```bash
python manage.py runserver
```

The API runs at http://localhost:8000

---

## Frontend setup

```bash
cd frontend
cp .env.example .env            # Windows: copy .env.example .env
npm install
npm run dev
```

The app runs at http://localhost:5173

`frontend/.env` should contain:

```
VITE_API_URL=http://localhost:8000/api
```

---

## Test logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shop.com | admin123 |
| Customer | user@shop.com | user123 |

---

## How it works

### Login and security
- The user sends email and password to `/api/auth/login/`.
- Passwords are stored as hashes (PBKDF2), never as plain text.
- If the email or password is wrong, the API returns `Invalid email or password.`
- On success, the API returns a JWT access token. The frontend sends it in the header of every request:
  `Authorization: Bearer <token>`
- The frontend saves the token in `localStorage` and calls `/api/auth/me/` when the page loads, so the user stays logged in after a refresh.
- Every API except login requires a valid token.

### Admin and customer roles
- The `User` model has an `is_admin` field. It is `True` for the admin and `False` for customers.
- Creating, editing and deleting products uses a custom `IsAdmin` permission.
- If a customer calls these APIs directly, the server returns **403 Forbidden**. Hiding buttons in the frontend is only for display. The real protection is on the server.

### Cart
- Each cart item belongs to one user, and every cart query is filtered by the logged-in user. Nobody can see or remove another user's items.
- Adding a product that is already in the cart increases its quantity instead of creating a duplicate row.
- The total price is calculated on the server.

---

## API endpoints

| Method | URL | Who can use it | What it does |
|--------|-----|----------------|--------------|
| POST | `/api/auth/login/` | Public | Log in and get a token |
| GET | `/api/auth/me/` | Logged in | Get the current user |
| GET | `/api/products/` | Logged in | List all products |
| GET | `/api/products/?search=phone` | Logged in | Search products by name |
| GET | `/api/products/<id>/` | Logged in | Get one product |
| POST | `/api/products/create/` | Admin only | Add a product |
| PUT | `/api/products/<id>/update/` | Admin only | Edit a product |
| DELETE | `/api/products/<id>/delete/` | Admin only | Delete a product |
| GET | `/api/cart/` | Logged in | View cart with total and item count |
| POST | `/api/cart/add/` | Logged in | Add a product to the cart |
| DELETE | `/api/cart/remove/<item_id>/` | Logged in | Remove an item from the cart |

### Status codes used

| Code | Meaning |
|------|---------|
| 200 / 201 / 204 | Success |
| 400 | Bad input (missing or invalid fields) |
| 401 | Not logged in, or wrong email or password |
| 403 | Logged in but not allowed (customer using an admin API) |
| 404 | Product or cart item not found |

---

## Quick API test with curl

**Log in:**

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@shop.com","password":"user123"}'
```

Copy the `access` value from the response and use it as the token below.

**List products and search:**

```bash
curl http://localhost:8000/api/products/ -H "Authorization: Bearer <token>"
curl "http://localhost:8000/api/products/?search=charger" -H "Authorization: Bearer <token>"
```

**Add to cart and view the cart:**

```bash
curl -X POST http://localhost:8000/api/cart/add/ \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"product_id":1}'
curl http://localhost:8000/api/cart/ -H "Authorization: Bearer <token>"
```

**Customer tries an admin action (should return 403):**

```bash
curl -X POST http://localhost:8000/api/products/create/ \
  -H "Authorization: Bearer <customer-token>" -H "Content-Type: application/json" \
  -d '{"name":"Test","price":"100","description":"x"}'
```

---

## Checklist before submitting

- [ ] Both test logins work
- [ ] A wrong password shows a clear error
- [ ] Admin can add, edit and delete products
- [ ] A customer gets 403 on the admin APIs
- [ ] No `.env`, `venv/` or `node_modules/` committed
- [ ] The README steps work on a fresh clone