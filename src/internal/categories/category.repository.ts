import { Prisma, PrismaClient } from "../../generated/prisma/client.js";

export class CategoryRepository {

    static findByNameCategory(prisma: PrismaClient, name: string) {
        return prisma.categories.findFirst({
            where: {name}
        })
    }
    static findByIdCategory(prisma: PrismaClient, id_category: number) {
        return prisma.categories.findUnique({
            where: {id_category}
        })
    }

    static countByNameCategory(prisma: PrismaClient, name: string) {
        return prisma.categories.count({
            where: {name}
        })
    }

    static getAllCategories(prisma: PrismaClient) {
        return prisma.categories.findMany()
    }

    static createCategory(prisma: PrismaClient, data: Prisma.categoriesCreateInput) {
        return prisma.categories.create({
            data
        })
    }

    static updateCategoryById(prisma: PrismaClient, id_category: number, 
        data: Prisma.categoriesUpdateInput) {
        return prisma.categories.update({
            where: {id_category},
            data
        })
    }

    static deleteCategoryById(prisma: PrismaClient, id_category: number) {
        return prisma.categories.delete({
            where: {id_category}
        })
    }
}