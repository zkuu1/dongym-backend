import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import type { Prisma, PrismaClient } from './generated/prisma/client.js';
import type { ContextWithPrisma } from './context/context.js';
const app = new Hono<ContextWithPrisma>();

import withPrisma from './libs/prisma.js';




serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
