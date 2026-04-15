import z from "zod"

export class UserValidation {
    static readonly CREATE = z.object({
        name: z.preprocess(
            (v) => (v == null ? '' : v),
            z.string()
                .min(3, 'Name must be at least 3 characters long')
                .max(50, 'Name maximum 50 characters'),
        ),

        email: z.preprocess(
            (v) => (v == null ? '' : v),
            z.string()
                .min(3, 'Email must be at least 3 characters long')
                .max(20, 'Email maximum 20 characters'),
        ),

        password: z.preprocess(
            (v) => (v == null ? '' : v),
            z.string()
                .min(3, 'Password must be at least 3 characters long')
                .max(15, 'Password maximum 15 characters'),
        ),

        address: z.preprocess(
            (v) => (v == null ? '' : v),
            z.string()
                .min(3, 'Address must be at least 3 characters long')
                .max(50, 'Address maximum 50 characters'),
        ),

        image: z.preprocess(
        (v) => (v == null || v === '' ? undefined : v),
        z.string()
        .max(100, 'Image maximum 100 characters')
        ).optional(),

        role: z.preprocess(
            (v) => (v == null ? '' : v),
            z.string()
                .min(3, 'Role must be at least 3 characters long')
                .max(20, 'Role maximum 50 characters'),
        ),
    })

    static readonly UPDATE = z.object({
        name: z.preprocess(
            (v) => (v == null || v === '' ? undefined : v),
            z.string()
                .min(3, 'Name must be at least 3 characters long')
                .max(50, 'Name maximum 50 characters')
        ).optional(),

        email: z.preprocess(
            (v) => (v == null || v === '' ? undefined : v),
            z.string()
                .min(3, 'Email must be at least 3 characters long')
                .max(50, 'Email maximum 50 characters')
        ).optional(),

        password: z.preprocess(
            (v) => (v == null || v === '' ? undefined : v),
            z.string()
                .min(3, 'Password must be at least 3 characters long')
                .max(50, 'Password maximum 50 characters')
        ).optional(),

        address: z.preprocess(
            (v) => (v == null ? undefined : v),
            z.string()
                .max(50, 'Address maximum 50 characters')
        ).optional(),

        image: z.preprocess(
            (v) => (v == null || v === '' ? undefined : v),
            z.string()
                .max(100, 'Image maximum 100 characters')
        ).optional(),

        role: z.preprocess(
            (v) => (v == null || v === '' ? undefined : v),
            z.string()
                .min(3, 'Role must be at least 3 characters long')
                .max(20, 'Role maximum 20 characters')
        ).optional(),
    })

    static readonly LOGIN = z.object({
        email: z.preprocess(
            (v) => (v == null ? undefined : v),
            z.string()
                .min(3, 'Email must be at least 3 characters long')
                .max(20, 'Email maximum 20 characters')
        ),

        password: z.preprocess(
            (v) => (v == null ? undefined : v),
            z.string()
                .min(3, 'Password must be at least 3 characters long')
                .max(15, 'Password maximum 15 characters')
        )
    })

    static readonly REGISTER = z.object({
        name: z.preprocess(
            (v) => (v == null ? '' : v),
            z.string()
                .min(3, 'Name must be at least 3 characters long')
                .max(50, 'Name maximum 50 characters'),
        ),

        email: z.preprocess(
            (v) => (v == null ? '' : v),
            z.string()
                .min(3, 'Email must be at least 3 characters long')
                .max(50, 'Email maximum 50 characters'),
        ),

        password: z.preprocess(
            (v) => (v == null ? '' : v),
            z.string()
                .min(3, 'Password must be at least 3 characters long')
                .max(15, 'Password maximum 15 characters'),
        ),

        address: z.preprocess(
            (v) => (v == null ? '' : v),
            z.string()
                .min(3, 'Address must be at least 3 characters long')
                .max(50, 'Address maximum 50 characters'),
        ),

    })
}