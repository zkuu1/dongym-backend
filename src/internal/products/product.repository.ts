import { Prisma, PrismaClient } from "./../../generated/prisma/client.js"

export class ProductRepository {

    static findByNameProduct(prisma: PrismaClient, name: string) {
        return prisma.products.findFirst({
            where: { name }
        })
    }

    static findByIdProduct(prisma: PrismaClient, id_product: number) {
        return prisma.products.findUnique({
            where: {
                id_product
            }
        })
    }
}