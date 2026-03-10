import { Hono } from "hono";
import type { AppContext } from "./../../context/context.js"
import withPrisma from "./../../libs/prisma.js";
import { safeJson } from "./../../helpers/safeJson..js";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/admin.middleware.js";
import { CategoryValidation } from "./category.validation.js";
import { ONE_DAY, redis } from "../../helpers/redis.js";
import { CategoryService } from "./category.service.js";

export const CategoryController = new Hono<AppContext>();

CategoryController.get('/category', withPrisma, async (c) => {
    const cacheKey= "categories:all"
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
    c.header("x-cache", "HIT")
     return c.json(cachedData, 200);
    }

    const prisma = c.get('prisma')
    const response = await CategoryService.getAllCategories(prisma)

    c.header("x-cache", "MISS")
    await redis.set(cacheKey, response, {ex: ONE_DAY})
    return c.json(response, 200)
})

CategoryController.get('/category/:id', withPrisma, async (c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid category id' });
  }
    const response = await CategoryService.getCategoryById(prisma, id)
    return c.json(response, 200)
})

CategoryController.post('/category', withPrisma, authMiddleware, requireRole('admin'), async (c) => {
    const prisma = c.get('prisma')
    const raw = await safeJson(c)
    const validated = CategoryValidation.CREATE.parse(raw)
    const response = await CategoryService.createCategory(prisma, validated)

    await redis.del("categories:all")
    return c.json(response, 201)
})

CategoryController.patch('/category/:id', withPrisma, authMiddleware, requireRole('admin'), async (c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))

    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid category id' });
  }

    const raw = await safeJson(c)
    const validated = CategoryValidation.UPDATE.parse(raw)
    const response = await CategoryService.updateCategory(prisma, validated, id)

    await redis.del("categories:all")
    return c.json(response, 201)

})

CategoryController.delete('/category:/id', withPrisma, authMiddleware, requireRole('admin') , async (c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))

    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid category id' });
     }

     const response = await CategoryService.deleteCategory(prisma, id)
     return c.json(response, 200)
})