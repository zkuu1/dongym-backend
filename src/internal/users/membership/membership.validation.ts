import z from "zod"

export class MembershipValidation {

    static readonly CREATE = z.object({
        idUser: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Id User must be at least 3 characters long')
        .max(50, 'Id User maximum 50 characters'),
       ),

       name: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name maximum 50 characters'),
       ),

       description: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Description must be at least 3 characters long')
        .max(50, 'Description maximum 50 characters'),
       ),

       noMember: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'No Member must be at least 3 characters long')
        .max(50, 'No Member maximum 50 characters'),
       ),

       expiredAt: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Expired must be at least 3 characters long')
        .max(50, 'Expired maximum 50 characters'),
       )
    }).strict

    static readonly UPDATE = z.object({
        idUser: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Id User must be at least 3 characters long')
        .max(50, 'Id User maximum 50 characters'),
       ).optional,

       name: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name maximum 50 characters'),
       ).optional,

       description: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Description must be at least 3 characters long')
        .max(50, 'Description maximum 50 characters'),
       ).optional,

       noMember: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'No Member must be at least 3 characters long')
        .max(50, 'No Member maximum 50 characters'),
       ).optional,

       expiredAt: z.preprocess(
        (v) => (v == null ? '' : v),
        z.string()
        .min(3, 'Expired must be at least 3 characters long')
        .max(50, 'Expired maximum 50 characters'),
       ).optional,
    })
}