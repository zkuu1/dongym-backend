import { Hono } from "hono"
import type { AppContext } from "../../../context/context.js"
import withPrisma from "../../../libs/prisma.js"
import { CommentService } from "./comment.service.js"
import { ONE_DAY, redis } from "../../../helpers/redis.js"
import { HTTPException } from "hono/http-exception"
import { authMiddleware } from "../../../middlewares/auth.middleware.js"
import { safeJson } from "../../../helpers/safeJson..js"
import { CommentValidation } from "./comment.validation.js"
import { requireRole } from "../../../middlewares/admin.middleware.js"

export const CommentController = new Hono<AppContext>()

CommentController.get('/comments', withPrisma, async (c) => {

  const cacheKey = "comments:all"
  const cachedData = await redis.get(cacheKey)

  if (cachedData) {
    c.header("x-cache", "HIT")
    return c.json(cachedData, 200)
  }

  const prisma = c.get('prisma')

  const response = await CommentService.getAllUserComments(prisma)

  c.header("x-cache", "MISS")

  await redis.set(cacheKey, response, { ex: ONE_DAY })

  return c.json(response, 200)
})

CommentController.get('/comments/me', withPrisma, authMiddleware, async (c) => {

  const prisma = c.get('prisma')
  const user = c.get("user")

    if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
    }

  const response = await CommentService.getCommentUser(
    prisma,
    user.id
  )

  return c.json(response, 200)

})


CommentController.get('/comments/user/:id', withPrisma, async (c) => {

  const prisma = c.get('prisma')
  const id = Number(c.req.param('id'))

  if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: "Invalid user id" })
  }

  const response = await CommentService.getCommentUser(prisma, id)

  return c.json(response, 200)
})

CommentController.get('/comments/product/:id', withPrisma, async (c) => {

  const prisma = c.get('prisma')
  const id = Number(c.req.param('id'))

  if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: "Invalid product id" })
  }

  const response = await CommentService.getCommentproduct(prisma, id)

  return c.json(response, 200)
})

CommentController.post('/comments/:productId', withPrisma, authMiddleware, async (c) => {

  const prisma = c.get('prisma')
  const user = c.get("user")

if (!user) {
  throw new HTTPException(401, { message: "Unauthorized" })
}

  const productId = Number(c.req.param('productId'))

  if (Number.isNaN(productId)) {
    throw new HTTPException(400, { message: "Invalid product id" })
  }

  const raw = await safeJson(c)

  const validated = CommentValidation.CREATE.parse(raw)

  const prismaData = {
    comment_text: validated.comment,
    users: {
      connect: { id_user: user.id }
    },
    products: {
      connect: { id_product: productId }
    }
  }

  const response = await CommentService.createComment(
    prisma,
    productId,
    user.id,
    prismaData
  )

  await redis.del("comments:all")

  return c.json(response, 201)
})

CommentController.patch('/comments/:id', withPrisma, authMiddleware, async (c) => {

  const prisma = c.get('prisma')
  const user = c.get("user")

    if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
    }

  const id = Number(c.req.param('id'))

  if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: "Invalid comment id" })
  }

  const raw = await safeJson(c)

  const validated = CommentValidation.UPDATE.parse(raw)

  const response = await CommentService.updateComment(
    prisma,
    id,
    user.id,
    validated.comment!
  )

  await redis.del("comments:all")

  return c.json(response, 200)
})


CommentController.delete(
  '/comments/:id',
  withPrisma,
  authMiddleware,
  async (c) => {

   const prisma = c.get('prisma')
   const user = c.get("user")

    if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
    }

    const id = Number(c.req.param('id'))

    if (Number.isNaN(id)) {
      throw new HTTPException(400, { message: "Invalid comment id" })
    }

    const response = await CommentService.deleteComment(
      prisma,
      id,
      user.id
    )

    await redis.del("comments:all")

    return c.json(response, 200)
  }
)