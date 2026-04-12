import z from "zod"

export class AbsensiValidation {

    static readonly CREATE = z.object({
        idUser: z.coerce.number().min(1, 'Id User must be a valid positive number'),

        noMember: z.string()
            .max(50, 'No Member maximum 50 characters')
            .optional(),

        date: z.coerce.date({
            message: 'Date must be a valid date'
        }),

        status: z.enum(['member', 'non member'], {
            error: 'Status must be one of: member, non member'
        }).default('non member'),
    })

    static readonly UPDATE = z.object({
        idUser: z.coerce.number().min(1, 'Id User must be a valid positive number').optional(),

        noMember: z.string()
            .max(50, 'No Member maximum 50 characters')
            .optional(),

        date: z.coerce.date({
            message: 'Date must be a valid date'
        }).optional(),

        status: z.enum(['member', 'non member'], {
            error: 'Status must be one of: member, non member'
        }).optional(),
    })
}
