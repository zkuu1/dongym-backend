# 🏗️ Project Structure Documentation

This document provides a comprehensive overview of the **DonGym Backend** project structure, architecture, and organization.

---

## 📂 Directory Overview

```text
dongym-backend/
├── 📁 prisma/             # Database schema and migrations
├── 📁 src/                # Root source directory
│   ├── 📁 context/        # Hono context type definitions
│   ├── 📁 dto/            # Data Transfer Objects (Zod schemas)
│   ├── 📁 handlers/       # Global handlers (Error, Upload, etc.)
│   ├── 📁 helpers/        # Utility functions (JWT, Redis, Responses)
│   ├── 📁 internal/       # Core business logic and controllers
│   ├── 📁 libs/           # External library configurations (Prisma, Cloudinary)
│   ├── 📁 middlewares/    # Custom Hono middlewares (CORS, Auth)
│   ├── 📁 routes/          # API Route definitions
│   └── 📄 index.ts        # Application entry point
├── 📁 docs/               # (Currenty Empty) Project documentation
├── 📄 .env                # Environment variables
├── 📄 docker-compose.yaml # Docker orchestration
├── 📄 package.json        # Dependencies and scripts
└── 📄 tsconfig.json       # TypeScript configuration
```

---

## 🛠️ Main Components

### 1. `src/index.ts`
The entry point of the application. It initializes the Hono app, registers middlewares (logger, CORS), defines routes, and starts the server (default port: 3000).

### 2. `src/internal/` (Business Logic)
This is where the core logic of the application resides. It is partitioned by feature modules:
- **users**: Core user management, memberships, likes, favorites, and comments.
- **products**: Product management logic.
- **categories**: Product category logic.

Each module typically contains its own **Controllers** that handle requests and interact with the database.

### 3. `src/routes/`
Organizes the API endpoints.
- `route.ts`: Aggregates different controllers and maps them to URL prefixes (e.g., `/api`).
- `oauth/`: Contains specific routes for OAuth providers like Google.

### 4. `src/dto/` (Data Validation)
Uses **Zod** to define schemas for request bodies, parameters, and query strings. This ensures data integrity and provides TypeScript type safety across the application.

### 5. `src/helpers/` & `src/libs/`
- **libs**: Contains initializations for shared resources like the `PrismaClient` and `Cloudinary`.
- **helpers**: Contains pure utility functions for tasks like JWT generation/verification, standardized error responses, and Redis client access.

### 6. `src/middlewares/`
Custom Hono middlewares used for cross-cutting concerns:
- `cors.middleware.ts`: Configures Cross-Origin Resource Sharing.

### 7. `prisma/`
The database layer.
- `schema.prisma`: The source of truth for the database schema.
- `seed.ts`: Script to populate the database with initial/dummy data.
- `migrations/`: History of schema changes.

---

## 🚀 Tech Stack

- **Framework**: [Hono](https://hono.dev/) (Lightweight, Cloud-native web framework)
- **Runtime**: [Bun](https://bun.sh/) / [Node.js](https://nodejs.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (via Prisma Adapter)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT & OAuth (Google)
- **Storage**: Cloudinary (Image management)
- **Caching**: Upstash Redis

---

##  Getting Started Reference

---

## 🔌 API Documentation

All endpoints are prefixed with `/api`. Standard responses follow this structure:

```json
{
  "success": true,
  "message": "Success message here",
  "data": { ... },
  "meta": { ... } // Optional: pagination metadata
}
```

###  Authentication & Users

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/user/register` | Public | Register a new user account |
| **POST** | `/user/login` | Public | Authenticate user and receive token |
| **POST** | `/user/logout/:id` | Public | Invalidate user session |
| **GET** | `/user` | Admin | List all registered users |
| **GET** | `/user/:id` | Self/Admin | Get detailed user profile |
| **PATCH** | `/user/:id` | Auth | Update user profile (Multipart/JSON) |
| **DELETE** | `/user/:id` | Admin | Remove a user account |

<details>
<summary>View Example Login Response</summary>

```json
{
  "success": true,
  "message": "Login success",
  "data": {
    "id": 1,
    "name": "Admin Gym",
    "email": "admin@dongym.com",
    "address": "Gym Street No. 1",
    "image": "https://res.cloudinary.com/...",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```
</details>

###  Products

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/product` | Public | List all available products |
| **GET** | `/product/:id` | Public | Get product details |
| **POST** | `/product` | Admin | Create a new product (Multipart) |
| **PATCH** | `/product/:id` | Admin | Update product details (Multipart) |
| **DELETE** | `/product/:id` | Admin | Delete a product |

<details>
<summary>View Example Product List Response</summary>

```json
{
  "success": true,
  "message": "Get All Products success",
  "data": [
    {
      "id": 1,
      "name": "Whey Protein 1kg",
      "description": "High quality protein for muscle growth",
      "price": 450000,
      "stock": 50,
      "image": "https://res.cloudinary.com/...",
      "categories": { "name": "Supplements" }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 1,
    "total": 1
  }
}
```
</details>

###  Categories

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/category` | Public | List all product categories |
| **GET** | `/category/:id` | Public | Get category details |
| **POST** | `/category` | Admin | Create a new category |
| **PATCH** | `/category/:id` | Admin | Update a category |
| **DELETE** | `/category/:id` | Admin | Delete a category |

<details>
<summary>View Example Category Response</summary>

```json
{
  "success": true,
  "message": "Category created success",
  "data": {
    "id": 1,
    "name": "Supplements",
    "description": "Sport supplements and vitamins"
  }
}
```
</details>

###  Membership

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/membership` | Public | List all membership plans |
| **GET** | `/membership/:id` | Public | Get membership details |
| **POST** | `/membership` | Admin | Assign membership to a user |
| **PATCH** | `/membership/:id` | Admin | Update membership details |
| **DELETE** | `/membership/:id` | Admin | Revoke membership |

<details>
<summary>View Example Membership Response</summary>

```json
{
  "success": true,
  "message": "Get membership success",
  "data": {
    "idMembership": 1,
    "idUsers": 5,
    "name": "Gold Membership",
    "description": "Full gym access + Locker",
    "numberMember": "MEM-2024-001",
    "expiredAt": "2025-04-12T10:52:16Z"
  }
}
```
</details>

###  Likes &  Favourites

| Feature | Get Count | Toggle (POST) | My List (GET) | Check (GET) |
| :--- | :--- | :--- | :--- | :--- |
| **Likes** | `/likes/product/:id` | `/likes/:productId` | `/likes/me` | `/likes/check/:productId` |
| **Favourites**| `/favourites/product/:id` | `/favourites/:productId` | `/favourites/me` | `/favourites/check/:productId` |

<details>
<summary>View Example Liked Status Response</summary>

```json
{
  "success": true,
  "message": "Check like status success",
  "data": {
    "productId": 1,
    "liked": true
  }
}
```
</details>

###  Comments

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/comments` | Public | List all comments |
| **GET** | `/comments/me` | Auth | List current user's comments |
| **GET** | `/comments/user/:id` | Public | List comments by a specific user |
| **GET** | `/comments/product/:id`| Public | List comments for a product |
| **POST** | `/comments/:productId`| Auth | Post a comment on a product |
| **PATCH** | `/comments/:id` | Auth | Update a comment (Owner only) |
| **DELETE** | `/comments/:id` | Owner/Admin| Delete a comment |

<details>
<summary>View Example Comment Response</summary>

```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 10,
    "id_user": 5,
    "id_product": 1,
    "comment": "Recommended product!",
    "createdAt": "2024-04-12T10:52:16Z",
    "user_name": "John Doe"
  }
}
```
</details>

---

##  Tech Stack
