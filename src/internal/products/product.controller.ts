import { Hono } from "hono";
import type { AppContext } from "./../../context/context.js"
import withPrisma from "./../../libs/prisma.js";
import { safeJson } from "./../../helpers/safeJson..js";
import { HTTPException } from "hono/http-exception";
import { authAdminMiddleware } from "./../../middlewares/admin.middleware.js";
import { ProductsService } from "./product.service.js";
import { ProductValidation } from "./product.validation.js";

export const ProductController = new Hono<AppContext>

ProductController.get('/product', withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const response = await ProductsService.getAllProducts(prisma)
    return c.json(response, 201)
})

ProductController.get('/product/:id', withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid user id' });
  }
    const response = await ProductsService.getProductById(prisma, id)
    return c.json(response, 201)
})

ProductController.post('/product', authAdminMiddleware, withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const raw = await safeJson(c)
    const validate = ProductValidation.CREATE.parse(raw)
    const response = await ProductsService.createProduct(prisma, validate)
    return c.json(response, 201)
})

ProductController.patch('/product', authAdminMiddleware, withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid user id' });
    } 
    const raw = await safeJson(c)
    const validated = ProductValidation.UPDATE.parse(raw)

    const response = await ProductsService.updateProduct(prisma, validated, id)
    return c.json(response, 201)
})

ProductController.delete('/product', authAdminMiddleware, withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid user id' });
    } 

    const response = await ProductsService.deleteProduct(prisma, id)
    return c.json(response, 201)
})
