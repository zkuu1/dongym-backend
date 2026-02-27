import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import {
    type UsersData,
    type ApiResponse,
    toUsersData,
    toUsersResponse,
    toUsersListResponse,
    type loginUsersRequest
} from "../../../dto/users/user.dto.js"

import { HTTPException } from "hono/http-exception";
import bcrypt from 'bcrypt'
import { generateUserToken } from "../../../helpers/jwt.js";

import { UserRepository } from "./user.repository.js";
import type { PaginationMeta } from "../../../dto/pagination.dto.js";

export class UsersService {

    static async loginUser(
    prisma: PrismaClient,
    data: { email: string; password: string }
    ): Promise<ApiResponse<UsersData>> {

    const user = await UserRepository.findByEmailUser(
        prisma,
        data.email
    );

    if (!user) {
        throw new HTTPException(401, {
        message: "Invalid email or password",
        });
    }

    const isValid = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isValid) {
        throw new HTTPException(401, {
        message: "Invalid email or password",
        });
    }

    const token = generateUserToken({
        id: user.id_user,
        name: user.name,
    });

    await UserRepository.updateUserById(
        prisma,
        { token },
        user.id_user
    );

    return toUsersResponse(user, "Login success", token);
    }

    static async logoutUser(
    prisma: PrismaClient,
    id: number
    ): Promise<ApiResponse<UsersData>> {

    const user = await UserRepository.findByIdUser(prisma, id);

    if (!user) {
        throw new HTTPException(404, {
        message: "User not found",
        });
    }

    await UserRepository.updateUserById(
        prisma,
        { token: null },  
        id
    );

    return toUsersResponse(user, "Logout success");
    }

    static async getAllUsers(
        prisma: PrismaClient,
    ): Promise<ApiResponse<UsersData[], PaginationMeta>> {
        
        const users = await UserRepository.getAllUsers(prisma)
        const page = 1
        const limit = users.length
        const total = users.length

        return toUsersListResponse(users, 'Get all users success', toUsersData,page, limit, total)
    }

    static async getUserById(
        prisma: PrismaClient,
        id: number
    ): Promise<ApiResponse<UsersData>> {
        const user = await UserRepository.findByIdUser(prisma, id)
        if (!user) {
            throw new HTTPException(401, {
                message: 'User not found'
            })
        }
        
        return toUsersResponse(user, 'Get user success')
    }

    static async createUser(
        prisma: PrismaClient,
        data: Prisma.usersCreateInput
    ): Promise<ApiResponse<UsersData>> {

        const duplicate = await UserRepository.countByEmailUser(
            prisma,
            data.email
        );

        if (duplicate > 1) {
            throw new HTTPException(400, {
                message: 'User with the same email already exist'
            })
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await UserRepository.createUser(prisma, {
            ...data,
            password: hashedPassword,
        });

        return toUsersResponse(user, 'User created successfully')
    }

    static async updateUser(
        prisma: PrismaClient,
        data: Prisma.usersUpdateInput,
        id: number
    ): Promise <ApiResponse<UsersData>> {
        
        if (Object.keys(data).length === 0) {
         throw new HTTPException(400, {
        message: 'Minimum one field is required to update admin',
      })}

      const user = await UserRepository.findByIdUser(prisma, id);
      if (!user) {
        throw new HTTPException(401, {
            message: 'User not found'
        })
      }

      const updated = await UserRepository.updateUserById(
        prisma, data, id
      )

      return toUsersResponse(updated, 'User updated success')
    }

    static async deleteUser(
        prisma: PrismaClient,
        id: number
    ): Promise<ApiResponse<UsersData>> {

        const user = await UserRepository.findByIdUser(prisma, id);
        if (!user) {
            throw new HTTPException(401, {
                message: 'User not found'
            })
        }

        await UserRepository.deleteUserById(prisma, id)
        return toUsersResponse(user, 'Admin deleted success')
    }
}