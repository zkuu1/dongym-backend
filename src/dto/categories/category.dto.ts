
import type {categories} from "../../generated/prisma/client.js"
import { type PaginationMeta, buildPaginationMeta } from "../pagination.dto.js"

export type CreateCategoryRequest = {
    name: string
    description: string
}

export type CategoryData = {
    id: number
    name: string
    description?: string | null
    createdAt?: string
}

export type ApiResponse<T, M = unknown> = {
    message: string
    success: boolean
    data: T
    meta?: M
}

//  func
export function toCategoryData(
    categories: categories 
) : CategoryData {
    return {
        id: categories.id_category,
        name: categories.name,
        description: categories.description
    }
}

export function toCategoryResponse(
    categories: categories,
    message: string
) : ApiResponse<CategoryData> {
    return {
        success: true,
        message,
        data: toCategoryData(categories)
    }
}

export function toCategoriesListResponse<T, U>(
    items: T[],
    message: string,
    mapper: (item: T) => U,
    page: number,
    limit: number,
    total: number,
) : ApiResponse<U[], PaginationMeta> {
    return {
        success: true,
        message,
        data: items.map(mapper),
        meta: buildPaginationMeta(page, limit, total)
    }
}