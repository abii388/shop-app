# Shop App

A mini e-commerce application for a small electronics shop. Customers log in, browse and search products, view product details and manage a cart. An admin can add, edit and delete products.

## Tech stack

| Part | Technology |
|------|------------|
| Backend | Django, Django REST Framework |
| Database | PostgreSQL |
| Authentication | JWT (djangorestframework-simplejwt) |
| Frontend | React (Vite), Redux Toolkit, React Router, Axios |

---

## Features

- Login with email and password (passwords are hashed, JWT token)
- Login is kept after page refresh
- Home page listing all products (name, price, short description)
- Search products by name
- Product detail page with an "Add to Cart" button
- Cart page with total price and remove item
- Cart item count in the navbar
- Admin: add, edit and delete products (delete asks for confirmation)
- Customers cannot see or use admin features (hidden in the UI, blocked by the server with 403)

---

## Requirements

Install these first:

- Python 3.10 or newer
- Node.js 18 or newer
- PostgreSQL


---

## How to run the project

You need **two terminals**: one for the backend and one for the frontend.

### 1. Get the code

```bash
git clone <your-repo-url>
cd shop-app
```

### 2. Create the database

```bash
psql -U postgres -c "CREATE DATABASE shop_db;"
```

Use your own PostgreSQL user if it is not `postgres`.

### 3. Backend setup (Terminal 1)

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

```bash
# Mac / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

Install the packages:

```bash
pip install -r requirements.txt
```

Create the environment file:

```bash
# Mac / Linux
cp .env.example .env

# Windows
copy .env.example .env
```

Open `backend/.env` and set your values:

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

Create the tables and add the test users and sample products:

```bash
python manage.py migrate
python manage.py seed_users
python manage.py seed_products
```

Start the backend:

```bash
python manage.py runserver
```

The API runs at **http://localhost:8000**

### 4. Frontend setup (Terminal 2)

```bash
cd frontend
npm install
```

Create the environment file:

```bash
# Mac / Linux
cp .env.example .env

# Windows
copy .env.example .env
```

`frontend/.env` should contain:

```
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Test logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shop.com | admin123 |
| Customer | user@shop.com | user123 |

---

## Quick test guide

**As a customer (`user@shop.com`)**

1. Open `http://localhost:5173` while logged out. You are sent to the login page.
2. Log in with a wrong password. A clear error message is shown.
3. Log in correctly. You see all the products.
4. Press F5. You stay logged in.
5. Search for `phone` or `charger`. Only matching products are shown.
6. Click a product. The detail page opens. Click "Add to Cart".
7. Open the cart. You see the items, the total price and a Remove button. The navbar shows the cart count.
8. You see no Add, Edit or Delete buttons. Opening `http://localhost:5173/admin/products/new` redirects you to the home page.

**As the admin (`admin@shop.com`)**

1. Log in. You see "+ Add Product" on the home page, and Edit and Delete on every product.
2. Add a product, then edit it, then delete it. Delete asks for confirmation first.

---

## Project structure

```
shop-app/
├── backend/
│   ├── config/            Django settings and main URLs
│   ├── users/             User model, login and me endpoints, seed_users command
│   ├── products/          Product model, product APIs, IsAdmin permission, seed_products command
│   ├── cart/              CartItem model and cart APIs
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/           Axios client (adds the token to every request)
│   │   ├── store/         Redux store, authSlice, cartSlice
│   │   ├── components/    Navbar, Layout, ProtectedRoute, AdminRoute,
│   │   │                  ProductCard, ProductForm, SearchBar
│   │   ├── pages/         Login, Home, ProductDetail, Cart, AddProduct, EditProduct
│   │   ├── App.jsx        Routes
│   │   └── main.jsx       App entry (Redux Provider and Router)
│   └── .env.example
└── README.md
```

---

## How it works

**Login and security**

- The user sends email and password to `/api/auth/login/`.
- Passwords are stored as hashes, never as plain text.
- A wrong email or password returns `Invalid email or password.`
- On success the server returns a JWT token. The frontend saves it in `localStorage` and sends it with every request.
- Redux state is lost on refresh, so on page load the app calls `/api/auth/me/` with the saved token to restore the user. That is how login survives a refresh.
- Every API except login needs a valid token.

**Admin and customer roles**

- The `User` model has an `is_admin` field.
- Create, update and delete product APIs use a custom `IsAdmin` permission. A customer calling them directly gets **403 Forbidden**.
- In the frontend, admin buttons are hidden from customers and `AdminRoute` redirects customers away from admin pages. This is for convenience. The real protection is on the server.

**Cart**

- Every cart item belongs to one user, and all cart queries are filtered by the logged-in user.
- Adding a product that is already in the cart increases its quantity.
- The total price is calculated on the server.

---

## API endpoints

| Method | URL | Access | What it does |
|--------|-----|--------|--------------|
| POST | `/api/auth/login/` | Public | Log in and get a token |
| GET | `/api/auth/me/` | Logged in | Get the current user |
| GET | `/api/products/` | Logged in | List products |
| GET | `/api/products/?search=phone` | Logged in | Search products by name |
| GET | `/api/products/<id>/` | Logged in | Get one product |
| POST | `/api/products/create/` | Admin only | Add a product |
| PUT | `/api/products/<id>/update/` | Admin only | Edit a product |
| DELETE | `/api/products/<id>/delete/` | Admin only | Delete a product |
| GET | `/api/cart/` | Logged in | View cart (items, total, count) |
| POST | `/api/cart/add/` | Logged in | Add a product to the cart |
| DELETE | `/api/cart/remove/<item_id>/` | Logged in | Remove an item from the cart |

Status codes: `400` bad input, `401` not logged in or wrong password, `403` not allowed (customer using an admin API), `404` not found.



