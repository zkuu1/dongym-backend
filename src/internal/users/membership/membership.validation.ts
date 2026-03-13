import z from "zod"

export class MembershipValidation {

    static readonly CREATE = z.object({
        idUser: z.coerce.number().min(1, 'Id User must be valid positive number'),

       name: z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name maximum 50 characters'),

       description: z.string()
        .min(3, 'Description must be at least 3 characters long')
        .max(200, 'Description maximum 200 characters')
        .optional(),

       noMember: z.string()
        .min(3, 'No Member must be at least 3 characters long')
        .max(50, 'No Member maximum 50 characters')
        .optional(),

       expiredAt: z.coerce.date().min(1, 'Expired minimun at least 1 character long').max(200, 'Expired maximun 200 characters'),
    })

    static readonly UPDATE = z.object({
        idUser: z.coerce.number().min(1, 'Id User must be valid positive number').optional(),

       name: z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name maximum 50 characters')
        .optional(),

       description: z.string()
        .min(3, 'Description must be at least 3 characters long')
        .max(200, 'Description maximum 200 characters')
        .optional(),

       noMember: z.string()
        .min(3, 'No Member must be at least 3 characters long')
        .max(50, 'No Member maximum 50 characters')
        .optional(),

       expiredAt: z.coerce.date().min(1, 'Expired minimun at least 1 character long').max(200, 'Expired maximun 200 characters').optional(),
    })
}
