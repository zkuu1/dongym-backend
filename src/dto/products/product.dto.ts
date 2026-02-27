import type {products} from "../../generated/prisma/client.js"
import { type PaginationMeta, buildPaginationMeta } from "../pagination.dto.js"

// request
// req
export type CreateProductsRequest = {
    idCategory: number
    name: string
    description: string
    image: string
    price: string
    stock: string
}

// ======== data response =======
export type ProductsData = {
    id: number
    idCategory: number
    name: string
    description?: string | null
    image?: string | null
    price?: number 
    stock?: number 
    createdAt?: string
}

// ========== Api Respon =============
export type ApiResponse<T, M = unknown> = {
    message: string
    success: boolean
    data: T
    meta?: M
}


// ========== function ==============
export function toProductsData(
    product: products
): ProductsData {
    return {
        id: product.id_product,
        idCategory: product.id_category,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock

    }
}

// ============= wrapper ==================
export function toProductsResponse(
    product: products,
    message: string
) : ApiResponse<ProductsData> {
    return {
        success: true,
        message,
        data: toProductsData(product)
    }
}

export function toProductsListResponse<T, U> (
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