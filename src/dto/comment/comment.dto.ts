import type {products, comments, users} from "../../generated/prisma/client.js"
import { type PaginationMeta, buildPaginationMeta } from "../pagination.dto.js"

export type CreateCommentRequest = {
  idUser: number
  idProduct: number
}

export type CommentData = {
  id: number
  idUser: number
  idProduct: number
  comment: string
  userName?: string
  userImage?: string
  createdAt?: string
}

export type CommentCountData = {
  productId: number
  totalcomments: number
}


export type ApiResponse<T, M = unknown> = {
  message: string
  success: boolean
  data: T
  meta?: M
}


// func

export function toCommentData(
  comment: comments & { products?: products, users?: users }
): CommentData {
  return {
    id: comment.id_comment,
    idUser: comment.id_user,
    idProduct: comment.id_product,
    comment: comment.comment_text,
    userName: comment.users?.name,
    userImage: comment.users?.image || undefined,
    createdAt: comment.createdAt?.toISOString()
  }
}



export function toCommentResponse(
  comment: comments,
  message: string
): ApiResponse<CommentData> {
  return {
    success: true,
    message,
    data: toCommentData(comment)
  }
}

export function toCommentsListResponse<T, U>(
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

export function toCommentCountResponse(
  productId: number,
  totalcomments: number,
  message: string
): ApiResponse<CommentCountData> {
  return {
    success: true,
    message,
    data: {
      productId,
      totalcomments
    }
  }
}
