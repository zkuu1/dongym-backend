import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { formatZodIssues } from '../helpers/errorResponse.js';

export const errorHandler = (err: unknown, c: any) => {
  if (err instanceof ZodError) {
    return c.json(
      {
        message: 'Validation error',
        errors: formatZodIssues(err.issues),
      },
      400,
    );
  }

  if (err instanceof HTTPException) {
    return c.json(
      {
        message: err.message,
      },
      err.status,
    );
  }

  console.error(err);

  return c.json(
    {
      message: 'Internal Server Error',
    },
    500,
  );
};
