import type {products, favourites} from "../../generated/prisma/client.js"
import { type PaginationMeta, buildPaginationMeta } from "../pagination.dto.js"

export type CreateFavouriteRequest = {
  idUser: number
  idProduct: number
}

export type FavouriteData = {
  id: number
  idUser: number
  idProduct: number
  status: boolean
  createdAt?: string
}

export type FavouriteCountData = {
  productId: number
  totalfavourites: number
}


export type ApiResponse<T, M = unknown> = {
  message: string
  success: boolean
  data: T
  meta?: M
}


// func

export function toFavouriteData(
  favourite: favourites & { products?: products }
): FavouriteData {
  return {
    id: favourite.id_favourite,
    idUser: favourite.id_user,
    idProduct: favourite.id_product,
    status: favourite.status,
    createdAt: favourite.createdAt?.toISOString()
  }
}



export function toFavouriteResponse(
  favourite: favourites,
  message: string
): ApiResponse<FavouriteData> {
  return {
    success: true,
    message,
    data: toFavouriteData(favourite)
  }
}

export function toFavouritesListResponse<T, U>(
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

export function toFavouriteCountResponse(
  productId: number,
  totalfavourites: number,
  message: string
): ApiResponse<FavouriteCountData> {
  return {
    success: true,
    message,
    data: {
      productId,
      totalfavourites
    }
  }
}
