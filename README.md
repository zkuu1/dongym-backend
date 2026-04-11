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

## 🏁 Getting Started Reference

Refer to the [README.md](./README.md) for detailed instructions on how to set up the environment, migrate the database, and run the development server.
