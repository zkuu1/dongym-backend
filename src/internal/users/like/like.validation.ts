import { z } from "zod"

export class LikeValidation {

  static readonly CREATE = z.object({
  idUser: z.coerce.number().int().positive(),
  idProduct: z.coerce.number().int().positive()
})

  static readonly UPDATE = z.object({
    idUser: z.coerce.number().int().positive().optional(),
    idProduct: z.coerce.number().int().positive().optional(),
    status: z.boolean().optional()
  }).strict()

}