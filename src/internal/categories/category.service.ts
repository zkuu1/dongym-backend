import { CategoryRepository } from './category.repository.js';
import { Prisma, PrismaClient } from "./../../generated/prisma/client.js";
import {
    type CategoryData,
    type ApiResponse,
    type CreateCategoryRequest,
    toCategoryData,
    toCategoryResponse,
    toCategoriesListResponse,
} from "./../../dto/categories/category.dto.js"

import { HTTPException } from "hono/http-exception";
import type { PaginationMeta } from "./../../dto/pagination.dto.js";


export class CategoryService {

    static async getAllCategories(
        prisma: PrismaClient
    ) : Promise<ApiResponse<CategoryData[], PaginationMeta> > {

        const category = await CategoryRepository.getAllCategories(prisma)
        const page = 1
        const limit = category.length
        const total = category.length

        return toCategoriesListResponse(category,
            'Get All Categories success',
            toCategoryData,
            page,
            limit,
            total
        )

    }

    static async getCategoryById(
        prisma: PrismaClient,
        id: number
    ): Promise<ApiResponse<CategoryData>> {
        
        const category = await CategoryRepository.findByIdCategory(prisma, id)
        if (!category) {
            throw new HTTPException(401, {
                message: 'Category not found'
            } )
        }

        return toCategoryResponse(category, 'Get Category success')
    }

    static async createCategory(
        prisma: PrismaClient,
        data: Prisma.categoriesCreateInput
    ) : Promise<ApiResponse<CategoryData>> {

        const duplicate = await CategoryRepository.countByNameCategory(prisma, data.name) 
        if (duplicate > 0) {
            throw new HTTPException(400, {
                message: 'Name Category already exist'
            })
        } 

        const category = await CategoryRepository.createCategory(prisma, data)
        return toCategoryResponse(category, 'Category created success')
        
    }

    static async updateCategory(
        prisma: PrismaClient,
        data: Prisma.categoriesUpdateInput,
        id: number
    ) : Promise<ApiResponse<CategoryData>> {

        const checked = await CategoryRepository.findByIdCategory(prisma, id)
        if(!checked) {
            throw new HTTPException(404, {
                message: 'Category not found'
            })
        }

        const category = await CategoryRepository.updateCategoryById(prisma,id, data) 
        if (Object.keys(data).length === 0) {
            throw new HTTPException(400, {
            message: 'Minimum one field is required to update category'
            });
        }

        return toCategoryResponse(category, 'Category updated success')
    }

    static async deleteCategory(
        prisma: PrismaClient,
        id: number
    ): Promise<ApiResponse<CategoryData>> {

        const checked = await CategoryRepository.findByIdCategory(prisma, id)
        if(!checked) {
            throw new HTTPException(404, {
                message: 'Category not found'
            })
        }
        const category = await CategoryRepository.deleteCategoryById(prisma,id)
        return toCategoryResponse(category, 'Category deleted success')
    }
}

