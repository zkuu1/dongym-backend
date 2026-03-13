import z from "zod"

export class FavouriteValidation {

    static readonly CREATE = z.object({
        idUser : z.coerce.number().positive(),
        idProduct: z.coerce.number().positive(),
    })

    static readonly UPDATE = z.object({
        idUser : z.coerce.number().positive(),
        idProduct: z.coerce.number().positive(),
        status: z.boolean().optional()
    }).strict()
}