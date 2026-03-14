import { Prisma } from "../../../generated/prisma/client.js"
import type { PrismaClient } from "../../../generated/prisma/client.js"
import { CommentRepository } from "./comment.repository.js"
import {
  toCommentResponse,
  toCommentData,
  toCommentsListResponse,
  type CommentData
} from "../../../dto/comment/comment.dto.js"
import type { ApiResponse } from "../../../dto/users/user.dto.js"
import type { PaginationMeta } from "../../../dto/pagination.dto.js"
import { ProductRepository } from "../../products/product.repository.js"
import { HTTPException } from "hono/http-exception"

export class CommentService {

  static async getCommentUser(
    prisma: PrismaClient,
    idUser: number
  ): Promise<ApiResponse<CommentData[], PaginationMeta>> {

    const { comments, total } =
      await CommentRepository.getCommentsByUser(prisma, idUser)

    const page = 1
    const limit = comments.length

    return toCommentsListResponse(
      comments,
      "User comments fetched successfully",
      toCommentData,
      page,
      limit,
      total
    )
  }


  static async getCommentproduct(
    prisma: PrismaClient,
    idProduct: number
  ): Promise<ApiResponse<CommentData[], PaginationMeta>> {

    const { comments, total } =
      await CommentRepository.getCommentsByProduct(prisma, idProduct)

    const page = 1
    const limit = comments.length

    return toCommentsListResponse(
      comments,
      "Product comments fetched successfully",
      toCommentData,
      page,
      limit,
      total
    )
  }


  static async getAllUserComments(
    prisma: PrismaClient
  ): Promise<ApiResponse<CommentData[], PaginationMeta>> {

    const comments = await CommentRepository.getAllComments(prisma)

    const page = 1
    const limit = comments.length
    const total = comments.length

    return toCommentsListResponse(
      comments,
      "All comments fetched successfully",
      toCommentData,
      page,
      limit,
      total
    )
  }


  static async createComment(
    prisma: PrismaClient,
    idProduct: number,
    idUser: number,
    data: Prisma.commentsCreateInput
  ): Promise<ApiResponse<CommentData>> {

    const product = await ProductRepository.findByIdProduct(prisma, idProduct)

    if (!product) {
      throw new HTTPException(404, { message: "Product not found" })
    }

    const comment = await CommentRepository.createComment(prisma, data)

    return toCommentResponse(
      comment,
      "Comment created successfully"
    )
  }


  static async updateComment(
    prisma: PrismaClient,
    idComment: number,
    idUser: number,
    content: string
  ): Promise<ApiResponse<CommentData>> {

    const existing = await prisma.comments.findUnique({
      where: { id_comment: idComment }
    })

    if (!existing) {
      throw new HTTPException(404, { message: "Comment not found" })
    }

    if (existing.id_user !== idUser) {
      throw new HTTPException(403, { message: "Forbidden" })
    }

    const updated = await CommentRepository.updateComment(
      prisma,
      idComment,
      idUser,
      content
    )

    if (updated.count === 0) {
      throw new HTTPException(400, { message: "Failed to update comment" })
    }

    const comment = await prisma.comments.findUnique({
      where: { id_comment: idComment }
    })

    if (!comment) {
      throw new HTTPException(404, { message: "Comment not found" })
    }

    return toCommentResponse(
      comment,
      "Comment updated successfully"
    )
  }


  static async deleteComment(
    prisma: PrismaClient,
    idComment: number,
    idUser: number
  ): Promise<ApiResponse<null>> {

    const existing = await prisma.comments.findUnique({
      where: { id_comment: idComment }
    })

    if (!existing) {
      throw new HTTPException(404, { message: "Comment not found" })
    }

    if (existing.id_user !== idUser) {
      throw new HTTPException(403, { message: "Forbidden" })
    }

    const deleted = await CommentRepository.deleteComment(
      prisma,
      idComment,
      idUser
    )

    if (deleted.count === 0) {
      throw new HTTPException(400, { message: "Failed to delete comment" })
    }

    return {
      success: true,
      message: "Comment deleted successfully",
      data: null
    }
  }

}