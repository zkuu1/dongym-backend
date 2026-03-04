import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import type { ContextWithPrisma } from './context/context.js';
import withPrisma from './libs/prisma.js';
import { UserController } from './internal/users/user/user.controller.js';
import { PublicRoute } from './routes/route.js';
import { errorHandler } from './handlers/errorHandler.js';
import { corsMiddleware } from './middlewares/cors.middleware.js';


const app = new Hono<ContextWithPrisma>();
const route = new PublicRoute

app.route('/', corsMiddleware)
app.route(('/'),route.app)

app.onError(errorHandler)

serve({ fetch: app.fetch, port: 3000 })