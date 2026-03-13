import { z } from "zod"

export class LikeValidation {

  static readonly CREATE = z.object({
  idUser: z.coerce.number().int().positive(),
  idProduct: z.coerce.number().int().positive(),
  comment: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(1, 'Comment must be at least 3 characters long')
        .max(500, 'Comment maximum 500 characters'),
        ),
})

  static readonly UPDATE = z.object({
    idUser: z.coerce.number().int().positive().optional(),
    idProduct: z.coerce.number().int().positive().optional(),
    status: z.boolean().optional()
  }).strict()

}