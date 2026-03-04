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
import { uploadImageHandler } from "../../handlers/uploadHandler.js";
import cloudinary from "../../libs/cloudinary.js";

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
        data: CreateProductsRequest,
        file?: File
        ): Promise<ApiResponse<ProductsData>> {

        const duplicate = await ProductRepository.countByNameProduct(
            prisma,
            data.name
        );

        if (duplicate > 0) {
            throw new HTTPException(400, {
            message: 'Product with the same name already exist'
            });
        }

        let imageUrl: string | undefined;
        let publicId: string | undefined;

        

        if (file) {
            const uploaded = await uploadImageHandler(file);
            imageUrl = uploaded.url;
            publicId = uploaded.public_id;
        }

        if (file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            throw new HTTPException(400, {
            message: 'Invalid file type. Only JPG, PNG, WEBP allowed'
            });
        }
        }

        try {

            const prismaData: Prisma.productsCreateInput = {
            name: data.name,
            description: data.description,
            image: imageUrl,
            public_id: publicId,
            price: Number(data.price),
            stock: Number(data.stock),
            categories: {
                connect: {
                id_category: Number(data.idCategory)
                }
            }
            };

            const product = await ProductRepository.createProduct(
            prisma,
            prismaData
            );

            return toProductsResponse(
            product,
            'Product created success'
            );

        } catch (error) {

            if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            }
            console.log(publicId)
            throw new HTTPException(500, {
            message: 'Failed to create product'
            });
            
        }
        }

   static async updateProduct(
        prisma: PrismaClient,
        data: Prisma.productsUpdateInput,
        id: number,
        file?: File
        ): Promise<ApiResponse<ProductsData>> {

        if (Object.keys(data).length === 0 && !file) {
            throw new HTTPException(400, {
            message: 'Minimum one field is required to update product'
            });
        }

        const product = await ProductRepository.findByIdProduct(prisma, id);

        if (!product) {
            throw new HTTPException(404, {
            message: 'Product not found'
            });
        }

        let imageUrl = product.image;
        let publicId = product.public_id;

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

            if (!allowedTypes.includes(file.type)) {
                throw new HTTPException(400, {
                message: 'Invalid file type. Only JPG, PNG, WEBP allowed'
                });
            }
            }

        if (file) {

            const uploaded = await uploadImageHandler(file);

            if (product.public_id) {
            await cloudinary.uploader.destroy(product.public_id);
            }

            imageUrl = uploaded.url;
            publicId = uploaded.public_id;
        }

        const prismaData: Prisma.productsUpdateInput = {
            ...data,
            image: imageUrl,
            public_id: publicId
        };

        const updated = await ProductRepository.updateProductById(
            prisma,
            id,
            prismaData
        );

        return toProductsResponse(
            updated,
            'Product updated success'
        );
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
