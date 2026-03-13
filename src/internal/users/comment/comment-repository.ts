import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";

export class CommentRepository{

    static async getAllComments(prisma: PrismaClient) {
        return prisma.comments.findMany()
    }

    static async getCommentByUser(prisma: PrismaClient, id_user: number) {
        return prisma.comments.findFirst({
            where: {id_user},
            include: {
                users: true
            }
        })
    }
}