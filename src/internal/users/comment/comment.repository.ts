
import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";

export class CommentRepository{

    static async getAllComments(prisma: PrismaClient) {
        return prisma.comments.findMany()
    }

   static async getCommentsByUser(prisma: PrismaClient, id_user: number) {

    const [comments, total] = await Promise.all([
        prisma.comments.findMany({
        where: { id_user },
        include: {
            users: true
        },
        orderBy: {
            createdAt: "desc"
        }
        }),

        prisma.comments.count({
        where: { id_user }
        })
    ])

    return {
        comments,
        total
    }
    }

    static async getCommentsByProduct(prisma:PrismaClient, id_product: number) {
        const [comments, total] = await Promise.all([
            prisma.comments.findMany({
                where: {id_product},

                include: {
                    products: true,
                    users: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),

            prisma.comments.count({
                where: {id_product}
            })
        ])

        return {
            comments,
            total
        }
    }

    static async createComment( prisma: PrismaClient, data: Prisma.commentsCreateInput) {
    return prisma.comments.create({
        data
    })
    }

    static async updateComment(
    prisma: PrismaClient,
    id_comment: number,
    id_user: number,
    comment_text: string
    ) {
    return prisma.comments.updateMany({
        where: {
        id_comment,
        id_user
        },
        data: {
        comment_text
        }
    })
    }

    static async deleteComment(
    prisma: PrismaClient,
    id_comment: number,
    id_user?: number
    ) {
    return prisma.comments.deleteMany({
        where: {
        id_comment,
        ...(id_user && { id_user })
        }
    })
}


}