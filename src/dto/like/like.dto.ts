import type { likes, products} from "../../generated/prisma/client.js"
import { type PaginationMeta, buildPaginationMeta } from "../pagination.dto.js"

export type CreateLikeRequest = {
  idUser: number
  idProduct: number
}

export type LikeData = {
  id: number
  idUser: number
  idProduct: number
  status: boolean
  createdAt?: string
  products?: {
    name: string
    image: string | null
    price: number
  }
}

export type LikeCountData = {
  productId: number
  totalLikes: number
}


export type ApiResponse<T, M = unknown> = {
  message: string
  success: boolean
  data: T
  meta?: M
}


// func

export function toLikeData(
  like: likes & { products?: products }
): LikeData {
  return {
    id: like.id_like,
    idUser: like.id_user,
    idProduct: like.id_product,
    status: like.status,
    createdAt: like.createdAt?.toISOString(),
    products: like.products ? {
      name: like.products.name,
      image: like.products.image,
      price: like.products.price
    } : undefined
  }
}



export function toLikeResponse(
  like: likes,
  message: string
): ApiResponse<LikeData> {
  return {
    success: true,
    message,
    data: toLikeData(like)
  }
}

export function toLikesListResponse<T, U>(
  items: T[],
  message: string,
  mapper: (item: T) => U,
  page: number,
  limit: number,
  total: number
): ApiResponse<U[], PaginationMeta> {
  return {
    success: true,
    message,
    data: items.map(mapper),
    meta: buildPaginationMeta(page, limit, total)
  }
}

export function toLikeCountResponse(
  productId: number,
  totalLikes: number,
  message: string
): ApiResponse<LikeCountData> {
  return {
    success: true,
    message,
    data: {
      productId,
      totalLikes
    }
  }
}
