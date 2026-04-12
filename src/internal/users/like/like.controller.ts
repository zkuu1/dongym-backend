import { Hono } from "hono"
import type { AppContext } from "../../../context/context.js"
import withPrisma from "../../../libs/prisma.js"
import { LikeService } from "./like.service.js"
import { ONE_DAY, redis } from "../../../helpers/redis.js"
import { HTTPException } from "hono/http-exception"
import { authMiddleware } from "../../../middlewares/auth.middleware.js"

export const LikeController = new Hono<AppContext>()

LikeController.get('/likes/product/:id', withPrisma, async (c) => {

  const prisma = c.get('prisma')
  const productId = Number(c.req.param('id'))

  if (Number.isNaN(productId)) {
    throw new HTTPException(400, { message: 'Invalid product id' })
  }

  const cacheKey = `likes:product:${productId}`
  const cachedData = await redis.get(cacheKey)

  if (cachedData) {
    c.header("x-cache", "HIT")
    return c.json(cachedData, 200)
  }

  const response = await LikeService.countProductLikes(prisma, productId)

  c.header("x-cache", "MISS")
  await redis.set(cacheKey, response, { ex: ONE_DAY })

  return c.json(response, 200)
})


LikeController.post('/likes/:productId', withPrisma, authMiddleware, async (c) => {

  const prisma = c.get('prisma')
  const user = c.get('user')

  const productId = Number(c.req.param('productId'))

  if (Number.isNaN(productId)) {
    throw new HTTPException(400, { message: 'Invalid product id' })
  }

  const response = await LikeService.toggleLike(prisma, {
    idUser: user!.id,
    idProduct: productId
  })

  await redis.del(`likes:product:${productId}`)

  return c.json(response, 200)
})


LikeController.get('/likes/me', withPrisma, authMiddleware, async (c) => {

  const prisma = c.get('prisma')
  const user = c.get('user')

  const response = await LikeService.getUserLikes(prisma, user!.id)

  return c.json(response, 200)
})


LikeController.get('/likes/check/:productId', withPrisma, authMiddleware, async (c) => {

  const prisma = c.get('prisma')
  const user = c.get('user')

  const productId = Number(c.req.param('productId'))

  if (Number.isNaN(productId)) {
    throw new HTTPException(400, { message: 'Invalid product id' })
  }

  const liked = await LikeService.isLiked(prisma, user!.id, productId)

  return c.json({
    success: true,
    message: "Check like status success",
    data: {
      productId,
      liked
    }
  }, 200)
})