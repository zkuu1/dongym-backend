import { verifyToken } from '../helpers/jwt.js';
import { HTTPException } from 'hono/http-exception';

export const authAdminMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('authorization');

  if (!authHeader) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new HTTPException(401, { message: 'Invalid auth format' });
  }

  let decoded;
  try {
    decoded = verifyToken(token.trim());
  } catch (err) {
    throw new HTTPException(401, { message: 'Invalid token' });
  }

  c.set('admin', decoded);

  await next();
};