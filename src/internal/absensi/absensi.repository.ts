import { Prisma, PrismaClient } from "../../generated/prisma/client.js";

export class AbsensiRepository {

    static findByIdAbsensi(prisma: PrismaClient, id_absensi: number) {
        return prisma.absensi.findUnique({
            where: { id_absensi },
            include: {
                users: {
                    select: {
                        id_user: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })
    }

    static findByUserAndDate(prisma: PrismaClient, id_user: number, date: Date) {
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        return prisma.absensi.findFirst({
            where: {
                id_user,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        })
    }

    static getAllAbsensi(prisma: PrismaClient) {
        return prisma.absensi.findMany({
            include: {
                users: {
                    select: {
                        id_user: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        })
    }

    static getAbsensiByUser(prisma: PrismaClient, id_user: number) {
        return prisma.absensi.findMany({
            where: { id_user },
            include: {
                users: {
                    select: {
                        id_user: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        })
    }

    static createAbsensi(prisma: PrismaClient, data: Prisma.absensiCreateInput) {
        return prisma.absensi.create({ 
            data,
            include: {
                users: {
                    select: {
                        id_user: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })
    }

    static updateAbsensiById(
        prisma: PrismaClient,
        id_absensi: number,
        data: Prisma.absensiUpdateInput
    ) {
        return prisma.absensi.update({
            where: { id_absensi },
            data,
            include: {
                users: {
                    select: {
                        id_user: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })
    }

    static deleteAbsensiById(prisma: PrismaClient, id_absensi: number) {
        return prisma.absensi.delete({
            where: { id_absensi }
        })
    }

    static countAbsensiByUser(prisma: PrismaClient, id_user: number) {
        return prisma.absensi.count({
            where: { id_user }
        })
    }
}
