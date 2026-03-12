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

       expiredAt: z.coerce.date({ required_error: 'Valid expired date required', invalid_type_error: 'Valid expired date required' }),
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

       expiredAt: z.coerce.date({ required_error: 'Valid expired date required', invalid_type_error: 'Valid expired date required' }).optional(),
    })
}
