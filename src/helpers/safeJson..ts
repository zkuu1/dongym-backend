import { HTTPException } from 'hono/http-exception';


export async function safeJson(c: any) {
  try {
    return await c.req.json();
  } catch {
    throw new HTTPException(400, {
      message: 'Invalid or empty JSON body',
    });
  }
}