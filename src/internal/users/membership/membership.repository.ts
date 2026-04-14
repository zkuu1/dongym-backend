    import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";

export class MembershipRepository {

    constructor(private prisma: PrismaClient) {}

    static findByNameMembership(prisma: PrismaClient, name: string) {
        return prisma.memberships.findFirst({
            where: { name }
        })
    }

    static findByIdMembership(prisma: PrismaClient, id_membership: number) {
        return prisma.memberships.findUnique({
            where: {id_membership}
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

    static createMembership(prisma: PrismaClient, data: Prisma.membershipsCreateInput) {
        return prisma.memberships.create({
            data
        })
    }

    static updateMembershipById(prisma: PrismaClient, id_membership: number, data: Prisma.membershipsUpdateInput) {
        return prisma.memberships.update({
            where: {id_membership},
            data
        })
    }

    static deleteMembershipById(prisma: PrismaClient, id_membership: number) {
        return prisma.memberships.delete({
            where: {id_membership}
        })
    }

    static findActiveByUser(prisma: PrismaClient, id_user: number) {
        return prisma.memberships.findFirst({
            where: {
                id_user,
                expired_at: {
                    gte: new Date()
                }
            }
        })
    }
}