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

    static countByNameProduct(prisma: PrismaClient, name: string) {
        return prisma.products.count({
            where: {name}
        })
    }

    static getAllProducts(prisma: PrismaClient) {
        return prisma.products.findMany(
            {
                include: {
                    categories: true,
                }
            }
        )
    }

    static createProduct(
        prisma: PrismaClient, 
        data: Prisma.productsCreateInput
    ) {
        return prisma.products.create({
            data
        })
    }

    static updateProductById(
        prisma: PrismaClient, 
        id_product: number,
        data: Prisma.productsUpdateInput

    ) {
        return prisma.products.update({
            where: {id_product},
            data,
            include: {
                categories: true
            }
        })
    }

    static deleteProductById(prisma: PrismaClient, id_product: number) {
        return prisma.products.delete({
            where: {id_product}
        })
    }
}