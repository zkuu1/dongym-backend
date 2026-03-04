import { Hono } from "hono";
import { cors } from 'hono/cors'


const app = new Hono();

export const corsMiddleware =
app.use(
  '*',
  cors({
    origin: '*', 
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);