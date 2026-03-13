import { PrismaClient } from "../../../generated/prisma/client.js"

export class LikeRepository {

  static findLike(prisma: PrismaClient, id_user: number, id_product: number) {
    return prisma.likes.findFirst({
      where: {
        id_user: id_user,
        id_product: id_product
      }
    })
  }

  static async countProductLikes(
    prisma: PrismaClient, id_product: number
  ) {
    return prisma.likes.count({
      where: {
        id_product,
        status: true
      }
    })
  } 

  static createLike(prisma: PrismaClient, id_user: number, id_product: number) {
    return prisma.likes.create({
      data: {
        id_user: id_user,
        id_product: id_product,
        status: true
      }
    })
  }

  static updateStatus(prisma: PrismaClient, id_like: number, status: boolean) {
    return prisma.likes.update({
      where: { id_like },
      data: { status }
    })
  }

  static getProductLikes(prisma: PrismaClient, id_product: number) {
    return prisma.likes.count({
      where: {
        id_product: id_product,
        status: true
      }
    })
  }

  static getUserLikes(prisma: PrismaClient, id_user: number) {
    return prisma.likes.findMany({
      where: {
        id_user: id_user,
        status: true
      },
      include: {
        products: true
      }
    })
  }
}