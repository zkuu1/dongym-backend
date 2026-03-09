import z from "zod"

export class CategoryValidation {

    static readonly CREATE = z.object({
            name: z.preprocess(
           (v) => (v == null ? '' : v),
            z.string()
            .min(3, 'Name Category must be at least 3 characters long')
            .max(50, 'Name Category maximum 50 characters'),
           ),
   
           description: z.preprocess(
           (v) => (v == null ? '' : v),
            z.string()
            .min(3, 'Description Category must be at least 3 characters long')
            .max(50, 'Description Category maximum 50 characters'),
           ),
       })

       static readonly UPDATE = z.object({
            name: z.preprocess(
           (v) => (v == null ? '' : v),
            z.string()
            .min(3, 'Name Category must be at least 3 characters long')
            .max(50, 'Name Category maximum 50 characters'),
           ).optional(),
   
           description: z.preprocess(
           (v) => (v == null ? '' : v),
            z.string()
            .min(3, 'Description Category must be at least 3 characters long')
            .max(50, 'Description Category maximum 50 characters'),
           ).optional(),
       })
}