import { Hono } from "hono"
import type { AppContext } from "../../../context/context.js"
import withPrisma from "../../../libs/prisma.js"
import { FavouriteService } from "./favourite.service.js"
import { ONE_DAY, redis } from "../../../helpers/redis.js"
import { HTTPException } from "hono/http-exception"
import { authMiddleware } from "../../../middlewares/auth.middleware.js"

export const FavouriteController = new Hono<AppContext>()

FavouriteController.get('/favourites/product/:id', withPrisma, async (c) => {

  const prisma = c.get('prisma')
  const productId = Number(c.req.param('id'))

  if (Number.isNaN(productId)) {
    throw new HTTPException(400, { message: 'Invalid product id' })
  }

  const cacheKey = `favourites:product:${productId}`
  const cachedData = await redis.get(cacheKey)

  if (cachedData) {
    c.header("x-cache", "HIT")
    return c.json(cachedData, 200)
  }

  const response = await FavouriteService.countProductFavourites(prisma, productId  )

  c.header("x-cache", "MISS")
  await redis.set(cacheKey, response, { ex: ONE_DAY })

  return c.json(response, 200)
})


FavouriteController.post('/favourites/:productId', withPrisma, authMiddleware, async (c) => {

  const prisma = c.get('prisma')
  const user = c.get('user')

  const productId = Number(c.req.param('productId'))

  if (Number.isNaN(productId)) {
    throw new HTTPException(400, { message: 'Invalid product id' })
  }

  const response = await FavouriteService.toggleFavourite(prisma, {
    idUser: user!.id,
    idProduct: productId
  })

  await redis.del(`favourites:product:${productId}`)

  return c.json(response, 200)
})


FavouriteController.get('/favourites/me', withPrisma, authMiddleware, async (c) => {

  const prisma = c.get('prisma')
  const user = c.get('user')

  const response = await FavouriteService.getUserFavourites(prisma, user!.id)

  return c.json(response, 200)
})


FavouriteController.get('/favourites/check/:productId', withPrisma, authMiddleware, async (c) => {

  const prisma = c.get('prisma')
  const user = c.get('user')

  const productId = Number(c.req.param('productId'))

  if (Number.isNaN(productId)) {
    throw new HTTPException(400, { message: 'Invalid product id' })
  }

  const Favourited = await FavouriteService.isFavourited(prisma, user!.id, productId)

  return c.json({
    success: true,
    message: "Check Favourite status success",
    data: {
      productId,
      Favourited
    }
  }, 200)
})