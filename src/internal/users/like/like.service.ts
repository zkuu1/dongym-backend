import type { PrismaClient } from "../../../generated/prisma/client.js"
import { LikeRepository } from "./like.repository.js"
import {
  type CreateLikeRequest,
  toLikeResponse,
  toLikeData,
  toLikesListResponse,
  toLikeCountResponse,
  type LikeData
} from "../../../dto/like/like.dto.js"
import type { ApiResponse } from "../../../dto/users/user.dto.js"
import type { PaginationMeta } from "../../../dto/pagination.dto.js"
import { ProductRepository } from "../../products/product.repository.js"
import { HTTPException } from "hono/http-exception"

export class LikeService {

  static async toggleLike(
    prisma: PrismaClient,
    request: CreateLikeRequest,
  
  ) {

    const product = await prisma.products.findUnique({
      where: {id_product: request.idProduct}
    })

    if(!product) {
      throw new HTTPException(400, {
        message: 'Product not found'
      })
    }

    const existing = await LikeRepository.findLike(
      prisma,
      request.idUser,
      request.idProduct
    )

    if (!existing) {
      const created = await LikeRepository.createLike(
        prisma,
        request.idUser,
        request.idProduct
      )

      return toLikeResponse(created, "Product liked successfully")
    }

    const updated = await LikeRepository.updateStatus(
      prisma,
      existing.id_like,
      !existing.status
    )

    return toLikeResponse(
      updated,
      updated.status
        ? "Product liked successfully"
        : "Product unliked successfully"
    )
  }

 static async countProductLikes(
  prisma: PrismaClient,
  idProduct: number
) {

  const totalLikes = await LikeRepository.countProductLikes(
    prisma,
    idProduct
  )

  return toLikeCountResponse(
    totalLikes,
    idProduct,
    'Get Product Like successfully'
  )
}

  static async getUserLikes(
    prisma: PrismaClient,
    idUser: number
  ): Promise <ApiResponse<LikeData[], PaginationMeta>> {
  

    const totalLikes = await LikeRepository.getUserLikes(prisma, idUser)
    const page = 1
    const limit = totalLikes.length
    const total = totalLikes.length

    return toLikesListResponse(
    totalLikes,
    "User likes fetched successfully",
    toLikeData,
    page,
    limit,
    total
)
  }

  static async isLiked(
    prisma: PrismaClient,
    idUser: number,
    idProduct: number
  ) {

    const like = await LikeRepository.findLike(
      prisma,
      idUser,
      idProduct
    )

    return like?.status ?? false
  }

}