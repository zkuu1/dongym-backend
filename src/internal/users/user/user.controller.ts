import { Hono } from "hono";
import type { AppContext } from "../../../context/context.js"
import withPrisma from "../../../libs/prisma.js";
import { safeJson } from "../../../helpers/safeJson..js";
import { UserValidation } from "./user.validation.js";
import { UsersService } from "./user.service.js";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { requireRole } from "../../../middlewares/admin.middleware.js";
import { ONE_DAY, redis } from "../../../helpers/redis.js";

export const UserController = new Hono<AppContext>

UserController.get('/user', authMiddleware, requireRole('admin'), withPrisma, async(c) => {
    const cacheKey = "users:all"
    const cachedData =  await redis.get(cacheKey)

     if (cachedData) {
    c.header("x-cache", "HIT")
     return c.json(cachedData, 200);
  }

    const prisma = c.get('prisma')
    const response = await UsersService.getAllUsers(prisma)

    c.header("x-cache", "MISS")
    await redis.set(cacheKey, response, {ex: ONE_DAY})
    return c.json(response, 201)
})

UserController.get('/user/:id', authMiddleware, withPrisma, async(c) => {
    const user = c.get('user')
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    
    if (Number.isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid user id' });
    }

    // Admins can see anyone, users can only see themselves
    if (!user || (user.role !== 'admin' && user.id !== id)) {
      throw new HTTPException(403, { message: 'Forbidden: You can only access your own profile' });
    }

    const response = await UsersService.getUserById(prisma, id)
    return c.json(response, 200) // Changed from 301 to 200 for correct status
})

UserController.post('/user', authMiddleware, requireRole('admin'), withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const raw = await safeJson(c)
    const validated = UserValidation.CREATE.parse(raw)
    const response = await UsersService.createUser(prisma, validated)
    
    await redis.del("users:all")
    return c.json (response, 201)
})

UserController.post('/user/register', withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const raw = await safeJson(c)
    const validated = UserValidation.REGISTER.parse(raw)
    const response = await UsersService.registerUser(prisma, validated)

    await redis.del("users:all")
    return c.json(response, 201)
})

UserController.post('/user/login', withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const raw = await safeJson(c)
    const validated = UserValidation.LOGIN.parse(raw)
    const response = await UsersService.loginUser(prisma, validated)
    return c.json(response, 201)
})

UserController.post('/user/logout/:id', withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    const response = await UsersService.logoutUser(prisma, id)

    await redis.del("users:all")
    return c.json(response, 201)
})


UserController.patch('/user/:id', authMiddleware, withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))

    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid user id' });
     }

    const contentType = c.req.header('Content-Type') || '';
    let body: any;
    if (contentType.includes('application/json')) {
      body = await c.req.json();
    } else {
      body = await c.req.parseBody();
    }

    const file = body.image as File | undefined

    const validated = UserValidation.UPDATE.parse({
        name: body.name,
        email: body.email,
        password: body.password || undefined,
        address: body.address,
        role: body.role
    })

    const response = await UsersService.updateUser(prisma, validated, id, file)

    await redis.del("users:all")
    return c.json(response, 201)
})

UserController.delete('/user/:id', authMiddleware, withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))

    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid user id' });
     }

    const response = await UsersService.deleteUser(prisma, id)

    await redis.del("users:all")
    return c.json(response, 201)
    
})