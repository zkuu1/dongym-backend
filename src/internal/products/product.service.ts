import { Prisma, PrismaClient } from "./../../generated/prisma/client.js";
import {
    type ProductsData,
    type ApiResponse,
    type CreateProductsRequest,
    toProductsData,
    toProductsResponse,
    toProductsListResponse,
} from "./../../dto/products/product.dto.js"

import { HTTPException } from "hono/http-exception";
import type { PaginationMeta } from "./../../dto/pagination.dto.js";
import { ProductRepository } from "./product.repository.js";


export class ProductsService {

    static async getAllProducts(
        prisma: PrismaClient
    ) : Promise<ApiResponse<ProductsData[], PaginationMeta>> {

        const products = await ProductRepository.getAllProducts(prisma)
        const page = 1
        const limit = products.length
        const total = products.length

        return toProductsListResponse(products, 
            'Get All Products success', 
            toProductsData,
            page,
            limit,
            total
        )
    }

    static async getProductById(
        prisma: PrismaClient,
        id: number
    ):Promise<ApiResponse<ProductsData>> {

        const product = await ProductRepository.findByIdProduct(prisma, id)
        if (!product) {
            throw new HTTPException(401, {
                message: 'Product not found'
            })
        }

        return toProductsResponse(product, 'Get Product success')

    }

    static async createProduct(
        prisma: PrismaClient,
        data: CreateProductsRequest
    ) : Promise<ApiResponse<ProductsData>> {

       const duplicate = await ProductRepository.countByNameProduct(
        prisma,
        data.name
       ) 
       if (duplicate !== 0)  {
        throw new HTTPException(400, {
            message: 'Product with the same name already exist'
        })
       }

       // Transform to Prisma productsCreateInput with categories relation
       const prismaData: Prisma.productsCreateInput = {
            name: data.name,
            description: data.description,
            image: data.image,
            price: parseFloat(data.price),
            stock: Number(data.stock),
            categories: {
                connect: {
                    id_category: Number(data.idCategory)
                }
            }
       }

       const product = await ProductRepository.createProduct(prisma, prismaData)

       return toProductsResponse(
        product,
        'Product created success'
       )
    }

    static async updateProduct(
        prisma: PrismaClient,
        data: Prisma.productsUpdateInput,
        id: number
    ): Promise<ApiResponse<ProductsData>> {

         if (Object.keys(data).length === 0) {
         throw new HTTPException(400, {
        message: 'Minimum one field is required to update product',
        })}

        const product = await ProductRepository.findByIdProduct(prisma, id)
        if(!product) {
            throw new HTTPException(401, {
                message: 'Product not found'
            })
        }

        const updated = await ProductRepository.updateProductById(prisma, id, data)

        return toProductsResponse(updated, 'Product updated success')
    }

    static async deleteProduct(
        prisma: PrismaClient,
        id: number
    ): Promise<ApiResponse<ProductsData>> {

        const product = await ProductRepository.findByIdProduct(prisma, id)
        if (!product) {
            throw new HTTPException(401, {
                message: 'Product not found'
            })
        }

        await ProductRepository.deleteProductById(prisma, id)
        return toProductsResponse(product, 'Product deleted success')
    }
}
