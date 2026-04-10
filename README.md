# REST API Example with Hono & Prisma

This example shows how to implement a **REST API with TypeScript** using [Hono](https://hono.dev/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client). It connects to a Postgres database via the [`@prisma/adapter-pg`](https://www.prisma.io/docs/orm/overview/databases/postgresql/pg-driver-adapter) driver adapter and a normal `postgresql://` connection string (no Accelerate/Data Proxy required).

## Project structure

For a detailed breakdown of the project architecture and directory organization, please refer to [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

Quick overview:
- `src/index.ts` – Application entry point and server definition.
- `src/libs/prisma.ts` – Prisma Client initialization.
- `prisma/schema.prisma` – Database schema models.
- `prisma/seed.ts` – Database seeding script.

## Getting started

### 1. Download the example and install dependencies

```bash
npx try-prisma@latest --template orm/hono --name hono
cd hono
bun install
```

> Alternatively clone this repo and run `bun install` inside `prisma-examples/orm/hono`.

### 2. Configure `DATABASE_URL`

Create a Postgres database (Prisma Postgres, Supabase, Railway, Docker, etc.) and copy the direct connection string:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

Create a `.env` file in the project root and add the URL:

```bash
touch .env

# .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

### 3. Migrate & seed the database

```bash
bunx prisma migrate dev --name init
bunx prisma db seed
```

This creates the tables defined in [`prisma/schema.prisma`](./prisma/schema.prisma) and runs [`prisma/seed.ts`](./prisma/seed.ts) to insert demo data.

### 4. Start the REST API server

```bash
bun run dev
```

The server listens on `http://localhost:3000`. Example requests:

- `POST /signup` – create a user (and optional posts).
- `POST /post` – create a post for an existing user.
- `PUT /publish/:id` – toggle the `published` flag.
- `GET /users` – list all users with their posts.
- `GET /feed?searchString=hello&take=5` – filter/paginate published posts.

Each route pulls the Prisma Client from the Hono context via `withPrisma`, so a single client instance is reused per request.

## Switch to another database

If you want to try this example with another database, refer to the [Databases](https://www.prisma.io/docs/orm/overview/databases) section in the Prisma docs.

## Next steps

- Check out the [Prisma docs](https://www.prisma.io/docs)
- Share feedback on the [Prisma Discord](https://pris.ly/discord/)
- Create issues or ask questions on [GitHub](https://github.com/prisma/prisma/)
