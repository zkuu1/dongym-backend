import { Prisma, PrismaClient } from "../../../generated/prisma/client.js"

export class UserRepository {

    static findByNameUsers(
        prisma: PrismaClient,
        name: string
    ) {
        return prisma.users.findFirst({
            where: {name}
        })
    }

    static findByIdUsers(
        prisma: PrismaClient,
        id: number
    ) {
        return prisma.users.findUnique({
            where: {id}
        })
    }

    static getAllUsers(
        prisma: PrismaClient
    ) {
        return prisma.users.findMany({
            include: {
                memberships: true
            }
        })
    }

    static createUsers(
        prisma: PrismaClient,
        data: Prisma.usersCreateInput
    ) {
        return prisma.users.create({
            data
        })
    }

    

}