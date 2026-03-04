import { verifyToken, type UserJwtPayload } from '../helpers/jwt.js'
import { HTTPException } from 'hono/http-exception'
import type { Context, Next } from 'hono'

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('authorization')

  if (!authHeader) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  const [type, token] = authHeader.split(' ')

  if (type !== 'Bearer' || !token) {
    throw new HTTPException(401, { message: 'Invalid auth format' })
  }

  try {
    const decoded = verifyToken(token.trim())
    c.set('user', decoded)
  } catch {
    throw new HTTPException(401, { message: 'Invalid or expired token' })
  }

  await next()
}