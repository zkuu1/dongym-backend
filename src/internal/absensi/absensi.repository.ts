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

    static async getLeaderboard(prisma: PrismaClient, limit: number = 20) {
        const leaderboard = await prisma.absensi.groupBy({
            by: ['id_user'],
            _count: {
                id_user: true
            },
            orderBy: {
                _count: {
                    id_user: 'desc'
                }
            },
            take: limit
        });

        // Fetch user details for each leaderboard entry
        const results = await Promise.all(leaderboard.map(async (entry) => {
            const user = await prisma.users.findUnique({
                where: { id_user: entry.id_user },
                select: {
                    name: true,
                    image: true,
                    memberships: {
                        where: {
                            expired_at: {
                                gte: new Date()
                            }
                        },
                        take: 1
                    }
                }
            });
            return {
                id_user: entry.id_user,
                name: user?.name || "Unknown",
                image: user?.image || null,
                count: entry._count.id_user,
                isMember: user?.memberships && user.memberships.length > 0
            };
        }));

        return results;
    }

    static async getUserRank(prisma: PrismaClient, id_user: number) {
        const counts = await prisma.absensi.groupBy({
            by: ['id_user'],
            _count: {
                id_user: true
            },
            orderBy: {
                _count: {
                    id_user: 'desc'
                }
            }
        });

        const rank = counts.findIndex(entry => entry.id_user === id_user);
        
        // If user has no attendance, they won't be in the list
        if (rank === -1) return null;

        return {
            rank: rank + 1,
            count: counts[rank]._count.id_user
        };
    }
}
