import { Hono } from "hono";
import type { AppContext } from "./../../context/context.js"
import withPrisma from "./../../libs/prisma.js";
import { safeJson } from "./../../helpers/safeJson..js";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/admin.middleware.js";
import { ProductsService } from "./product.service.js";
import { ProductValidation } from "./product.validation.js";
import { ONE_DAY, redis } from "../../helpers/redis.js";

export const ProductController = new Hono<AppContext>

ProductController.get('/product', withPrisma, async(c) => {

    const cacheKey = "products:all"
    const cachedData = await redis.get(cacheKey)

     if (cachedData) {
    c.header("x-cache", "HIT")
     return c.json(cachedData, 200);
    }

    const prisma = c.get('prisma')
    const response = await ProductsService.getAllProducts(prisma)

    c.header("x-cache", "MISS")
    await redis.set(cacheKey, response, {ex: ONE_DAY})
    return c.json(response, 200)
})

ProductController.get('/product/:id', withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid product id' });
  }
    const response = await ProductsService.getProductById(prisma, id)
    return c.json(response, 200)
})

ProductController.post('/product', authMiddleware, requireRole('admin'), withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const body = await c.req.parseBody();
    const file = body.image as File | undefined;

    const validate = ProductValidation.CREATE.parse({
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      idCategory: body.idCategory
    });

    const response = await ProductsService.createProduct(prisma, validate, file)

    await redis.del("products:all")
    return c.json(response, 201)
})

ProductController.patch('/product/:id', authMiddleware, requireRole('admin'), withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid product id' });
    } 
    const body = await c.req.parseBody();
    const file = body.image as File | undefined;

    const validate = ProductValidation.UPDATE.parse({
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      idCategory: body.idCategory
    });

    const isEmpty =
      !validate.name &&
      !validate.description &&
      !validate.price &&
      !validate.stock &&
      !validate.idCategory &&
      !file

    if (isEmpty) {
      throw new HTTPException(400, {
        message: 'No data provided to update'
      })
    }

    const response = await ProductsService.updateProduct(prisma, validate, id, file)
    await redis.del("products:all")
    return c.json(response, 200)
})

ProductController.delete('/product/:id', authMiddleware, requireRole('admin'),  withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid product id' });
    } 

    const response = await ProductsService.deleteProduct(prisma, id)
    await redis.del("products:all")
    return c.json(response, 201)
})
