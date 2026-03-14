import { z } from "zod"

export class CommentValidation {

  static readonly CREATE = z.object({
 
  comment: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(1, 'Comment must be at least 3 characters long')
        .max(500, 'Comment maximum 500 characters'),
        ),
})

  static readonly UPDATE = z.object({
     comment: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(1, 'Comment must be at least 3 characters long')
        .max(500, 'Comment maximum 500 characters'),
        ).optional(),
  }).strict()

}