import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";

export class MembershipRepository {

    static findByNameMembership(prisma: PrismaClient, name: string) {
        return prisma.memberships.findFirst({
            where: { name }
        })
    }

    static countByNameMembership(prisma: PrismaClient, name: string) {
        return prisma.memberships.count({
            where: { name }
        })
    }

    static getAllMemberships(prisma: PrismaClient) {
        return prisma.memberships.findMany({})
    }

    
}