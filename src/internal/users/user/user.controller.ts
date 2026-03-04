import { Hono } from "hono";
import type { AppContext } from "../../../context/context.js"
import withPrisma from "../../../libs/prisma.js";
import { safeJson } from "../../../helpers/safeJson..js";
import { UserValidation } from "./user.validation.js";
import { UsersService } from "./user.service.js";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { requireRole } from "../../../middlewares/admin.middleware.js";

export const UserController = new Hono<AppContext>

UserController.get('/user', authMiddleware, requireRole('admin'), withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const response = await UsersService.getAllUsers(prisma)
    return c.json(response, 201)
})

UserController.get('/user/:id', authMiddleware, requireRole('admin'), withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid user id' });
  }

    const response = await UsersService.getUserById(prisma, id)
    return c.json(response, 301)
})

UserController.post('/user', authMiddleware, requireRole('admin'), withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const raw = await safeJson(c)
    const validated = UserValidation.CREATE.parse(raw)
    const response = await UsersService.createUser(prisma, validated)
    return c.json (response, 201)
})

UserController.post('/user/register', withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const raw = await safeJson(c)
    const validated = UserValidation.REGISTER.parse(raw)
    const response = await UsersService.registerUser(prisma, validated)
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
    return c.json(response, 201)
})


UserController.patch('/user/:id', authMiddleware, withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))

    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid user id' });
     }

    const raw = await safeJson(c)
    const validated = UserValidation.UPDATE.parse(raw)
    const response = await UsersService.updateUser(prisma, validated, id)

    return c.json(response, 201)
})

UserController.delete('/user/:id', authMiddleware, withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))

    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid user id' });
     }

    const response = await UsersService.deleteUser(prisma, id)
    return c.json(response, 201)
    
})