import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import {
    type UsersData,
    type ApiResponse,
    toUsersData,
    toUsersListResponse
} from "../../../dto/users/user.dto.js"

import { HTTPException } from "hono/http-exception";
import bcrypt from 'bcrypt'
import { generateAdminToken } from "../../../helpers/jwt.js";

import { UserRepository } from "./user.repository.js";

export class UsersService {

    static async createUsers(
        prisma: PrismaClient,
        data: Prisma.usersCreateInput
    ): Promise<ApiResponse<UsersData>> {

        const duplicate = await UserRepository.findByEmailUser(
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
        
        return toUsersData(user, 'User created successfully')
    }
}