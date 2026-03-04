import { HTTPException } from 'hono/http-exception'
import type { Context, Next } from 'hono'


export const requireRole = (role: string) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user')

    if (!user || user.role !== role) {
      throw new HTTPException(403, { message: 'Forbidden' })
    }

    await next()
  }
}