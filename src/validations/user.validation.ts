import z from "zod"

export class userValidation {
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
        .min(3, 'Name must be at least 3 characters long')
        .max(20, 'Name maximum 50 characters'),
        ),
        
        password: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(15, 'Name maximum 50 characters'),
        ),

        address: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name maximum 50 characters'),
        ),

        image: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name maximum 50 characters'),
        ),

        role: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(20, 'Name maximum 50 characters'),
        ),
    })
}