import { Prisma, PrismaClient } from "../../../generated/prisma/client.js"

export class UserRepository {

    static findByNameUser(prisma: PrismaClient, name: string) {
        return prisma.users.findFirst({
            where: { name }
        })
    }

    static countByEmailUser(prisma: PrismaClient, email: string) {
        return prisma.users.count({
            where: {email}
        })
    }

    static findByEmailUser(prisma: PrismaClient, email: string) {
        return prisma.users.findUnique({
            where: {email}
        })
    }

    static findByIdUser(prisma: PrismaClient, id_user: number) {
        return prisma.users.findUnique({
            where: { id_user }
        })
    }

    static getAllUsers(prisma: PrismaClient) {
        return prisma.users.findMany({
            include: {
                memberships: true
            }
        })
    }

    static createUser(
        prisma: PrismaClient,
        data: Prisma.usersCreateInput
    ) {
        return prisma.users.create({
            data
        })
    }

    static updateUserById(
        prisma: PrismaClient,
        data: Prisma.usersUpdateInput,
        id_user: number
    ) {
        return prisma.users.update({
            where: { id_user },
            data,
            include: {
                memberships: true
            }
        })
    }

    static deleteUserById(
        prisma: PrismaClient,
        id_user: number
    ) {
        return prisma.users.delete({
            where: { id_user }
        })
    }

}