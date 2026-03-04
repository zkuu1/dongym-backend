import { Hono } from "hono";
import type { AppContext } from "./../../context/context.js"
import withPrisma from "./../../libs/prisma.js";
import { safeJson } from "./../../helpers/safeJson..js";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/admin.middleware.js";
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
    throw new HTTPException(400, { message: 'Invalid product id' });
  }
    const response = await ProductsService.getProductById(prisma, id)
    return c.json(response, 201)
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

    const response = await ProductsService.updateProduct(prisma, validate, id, file)
    return c.json(response, 201)
})

ProductController.delete('/product', authMiddleware, requireRole('admin'),  withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number (c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid product id' });
    } 

    const response = await ProductsService.deleteProduct(prisma, id)
    return c.json(response, 201)
})
