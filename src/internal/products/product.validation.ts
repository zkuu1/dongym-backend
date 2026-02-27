import z from "zod"

export class ProductValidation {
    static readonly CREATE = z.object({
        idCategory: z.preprocess(
        (v) => (v == null ? '' : v),
         z.string()
         .min(3, 'Id Category must be at least 3 characters long')
         .max(50, 'Id Categroy maximum 50 characters'),
        ),

         name: z.preprocess(
        (v) => (v == null ? '' : v),
         z.string()
         .min(3, 'Name Product must be at least 3 characters long')
         .max(50, 'Name Product maximum 50 characters'),
        ),

        description: z.preprocess(
        (v) => (v == null ? '' : v),
         z.string()
         .min(3, 'Description Product must be at least 3 characters long')
         .max(50, 'Description maximum 50 characters'),
        ),

        image: z.preprocess(
        (v) => (v == null ? '' : v),
         z.string()
         .min(3, 'Name Product must be at least 3 characters long')
         .max(50, 'Name Product maximum 50 characters'),
        ),

        price: z.preprocess(
        (v) => (v == null ? '' : v),
         z.string()
         .min(3, 'Name Product must be at least 3 characters long')
         .max(50, 'Name Product maximum 50 characters'),
        ),

        stock: z.preprocess(
        (v) => (v == null ? '' : v),
         z.int()
         .min(3, 'Name Product must be at least 3 characters long')
         .max(50, 'Name Product maximum 50 characters'),
        ),
    })

    static readonly UPDATE = z.object({
        idCategory: z.preprocess(
        (v) => (v == null ? '' : v),
         z.string()
         .min(3, 'Id Category must be at least 3 characters long')
         .max(50, 'Id Categroy maximum 50 characters'),
        ).optional(),

         name: z.preprocess(
        (v) => (v == null ? '' : v),
         z.string()
         .min(3, 'Name Product must be at least 3 characters long')
         .max(50, 'Name Product maximum 50 characters'),
        ).optional(),

        description: z.preprocess(
        (v) => (v == null ? '' : v),
         z.string()
         .min(3, 'Description Product must be at least 3 characters long')
         .max(50, 'Description maximum 50 characters'),
        ),

        image: z.preprocess(
        (v) => (v == null ? '' : v),
         z.string()
         .min(3, 'Name Product must be at least 3 characters long')
         .max(50, 'Name Product maximum 50 characters'),
        ).optional(),

        price: z.preprocess(
        (v) => (v == null ? '' : v),
         z.float32()
         .min(3, 'Name Product must be at least 3 characters long')
         .max(50, 'Name Product maximum 50 characters'),
        ).optional(),

        stock: z.preprocess(
        (v) => (v == null ? '' : v),
         z.int()
         .min(3, 'Name Product must be at least 3 characters long')
         .max(50, 'Name Product maximum 50 characters'),
        ).optional(),
    })
}