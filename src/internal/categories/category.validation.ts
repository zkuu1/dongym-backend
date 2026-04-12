import z from "zod"

export class CategoryValidation {

    static readonly CREATE = z.object({
        name: z.preprocess(
            (v) => (v == null || v === '' ? undefined : v),
            z.string()
            .min(3, 'Category name must be at least 3 characters long')
            .max(50, 'Category name maximum 50 characters'),
        ),

        description: z.preprocess(
            (v) => (v == null || v === '' ? undefined : v),
            z.string()
            .max(200, 'Description maximum 200 characters'),
        ).optional(),
    })

    static readonly UPDATE = z.object({
        name: z.preprocess(
            (v) => (v == null || v === '' ? undefined : v),
            z.string()
            .min(3, 'Category name must be at least 3 characters long')
            .max(50, 'Category name maximum 50 characters'),
        ).optional(),

        description: z.preprocess(
            (v) => (v == null || v === '' ? undefined : v),
            z.string()
            .max(200, 'Description maximum 200 characters'),
        ).optional(),
    })
}