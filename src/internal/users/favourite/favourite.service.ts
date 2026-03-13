import type { PrismaClient } from "../../../generated/prisma/client.js"
import { FavouriteRepository } from "./favourite.repository.js"
import {
  type CreateFavouriteRequest,
  toFavouriteResponse,
  toFavouriteData,
  toFavouritesListResponse,
  toFavouriteCountResponse,
  type FavouriteData
} from "../../../dto/favourite/favourite.dto.js"
import type { ApiResponse } from "../../../dto/users/user.dto.js"
import type { PaginationMeta } from "../../../dto/pagination.dto.js"
import { ProductRepository } from "../../products/product.repository.js"
import { HTTPException } from "hono/http-exception"

export class FavouriteService {

  static async toggleFavourite(
    prisma: PrismaClient,
    request: CreateFavouriteRequest,
  
  ) {

    const product = await prisma.products.findUnique({
      where: {id_product: request.idProduct}
    })

    if(!product) {
      throw new HTTPException(400, {
        message: 'Product not found'
      })
    }

    const existing = await FavouriteRepository.findfavourite(
      prisma,
      request.idUser,
      request.idProduct
    )

    if (!existing) {
      const created = await FavouriteRepository.createFavourite(
        prisma,
        request.idUser,
        request.idProduct
      )

      return toFavouriteResponse(created, "Product favourited successfully")
    }

    const updated = await FavouriteRepository.updateStatus(
      prisma,
      existing.id_favourite,
      !existing.status
    )

    return toFavouriteResponse(
      updated,
      updated.status
        ? "Product favourited successfully"
        : "Product unfavourited successfully"
    )
  }

 static async countProductFavourites(
  prisma: PrismaClient,
  idProduct: number
) {

  const totalfavourites = await FavouriteRepository.countProductFavourites(
    prisma,
    idProduct
  )

  return toFavouriteCountResponse(
    totalfavourites,
    idProduct,
    'Get Product favourite successfully'
  )
}

  static async getUserFavourites(
    prisma: PrismaClient,
    idUser: number
  ): Promise <ApiResponse<FavouriteData[], PaginationMeta>> {
  

    const totalfavourites = await FavouriteRepository.getUserFavourites(prisma, idUser)
    const page = 1
    const limit = totalfavourites.length
    const total = totalfavourites.length

    return toFavouritesListResponse(
    totalfavourites,
    "User favourites fetched successfully",
    toFavouriteData,
    page,
    limit,
    total
)
  }

  static async isFavourited(
    prisma: PrismaClient,
    idUser: number,
    idProduct: number
  ) {

    const favourite = await FavouriteRepository.findfavourite(
      prisma,
      idUser,
      idProduct
    )

    return favourite?.status ?? false
  }

}