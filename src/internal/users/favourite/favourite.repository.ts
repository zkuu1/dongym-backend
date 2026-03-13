import { PrismaClient } from "../../../generated/prisma/client.js"

export class FavouriteRepository {

  static findfavourite(prisma: PrismaClient, id_user: number, id_product: number) {
    return prisma.favourites.findFirst({
      where: {
        id_user: id_user,
        id_product: id_product
      }
    })
  }

  static async countProductFavourites(
    prisma: PrismaClient, id_product: number
  ) {
    return prisma.favourites.count({
      where: {
        id_product,
        status: true
      }
    })
  } 

  static createFavourite(prisma: PrismaClient, id_user: number, id_product: number) {
    return prisma.favourites.create({
      data: {
        id_user: id_user,
        id_product: id_product,
        status: true
      }
    })
  }

  static updateStatus(prisma: PrismaClient, id_favourite: number, status: boolean) {
    return prisma.favourites.update({
      where: { id_favourite },
      data: { status }
    })
  }

  static getProductFavourites(prisma: PrismaClient, id_product: number) {
    return prisma.favourites.count({
      where: {
        id_product: id_product,
        status: true
      }
    })
  }

  static getUserFavourites(prisma: PrismaClient, id_user: number) {
    return prisma.favourites.findMany({
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