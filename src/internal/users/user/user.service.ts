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
import { uploadImageHandler } from "../../../handlers/uploadHandler.js";
import cloudinary from "../../../libs/cloudinary.js";

export class UsersService {

    static async registerUser(
    prisma: PrismaClient,
    data: Prisma.usersCreateInput
): Promise<ApiResponse<UsersData>> {

    const duplicate = await UserRepository.countByEmailUser(
        prisma,
        data.email
    );

    if (duplicate > 0) {
        throw new HTTPException(400, {
            message: 'Email already exists'
        });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
        const user = await UserRepository.createUser(prisma, {
            ...data,
            password: hashedPassword,
        });

        return toUsersResponse(user, 'User register successfully');

    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new HTTPException(400, {
                message: 'Email already exists'
            });
        }

        throw error;
    }
}

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
        role: user.role
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

    const updatedUser = await UserRepository.updateUserById(
        prisma,
        { token: null },
        id
    );

    return toUsersResponse(updatedUser, "Logout success");
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
        data: Prisma.usersCreateInput,
        file?: File
    ): Promise<ApiResponse<UsersData>> {
        const duplicate = await UserRepository.countByEmailUser(
            prisma,
            data.email
        );

        if (duplicate > 0) {
            throw new HTTPException(400, {
                message: 'User with the same email already exist'
            })
        }

        let imageUrl = data.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`;
        let publicId = null;

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                throw new HTTPException(400, {
                    message: 'Invalid file type. Only JPG, PNG, WEBP allowed'
                });
            }

            const uploaded = await uploadImageHandler(file);
            imageUrl = uploaded.url;
            publicId = uploaded.public_id;
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await UserRepository.createUser(prisma, {
            ...data,
            password: hashedPassword,
            image: imageUrl,
            public_id: publicId
        });

        return toUsersResponse(user, 'User created successfully')
    }

    static async updateUser(
        prisma: PrismaClient,
        data: Prisma.usersUpdateInput,
        id: number,
        file?: File
    ): Promise <ApiResponse<UsersData>> {
      const user = await UserRepository.findByIdUser(prisma, id);
      if (!user) {
        throw new HTTPException(404, { message: 'User not found' });
      }

      // Check if any actual data has changed
      const isNameChanged = data.name !== undefined && data.name !== user.name;
      const isEmailChanged = data.email !== undefined && data.email !== user.email;
      const isPasswordChanged = data.password !== undefined; 
      const isAddressChanged = data.address !== undefined && (data.address ?? '') !== (user.address ?? '');
      const isRoleChanged = data.role !== undefined && data.role !== user.role;
      const isImageChanged = !!file;

      if (!isNameChanged && !isEmailChanged && !isPasswordChanged && !isAddressChanged && !isRoleChanged && !isImageChanged) {
        throw new HTTPException(400, { message: 'Minimal satu data yang ubah untuk update user' });
      }

      if (Object.keys(data).length === 0 && !file) {
         throw new HTTPException(400, { message: 'Minimum one field is required to update user' });
      }

      let imageUrl = user.image;
      let publicId = user.public_id;

      if (file) {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
          if (!allowedTypes.includes(file.type)) {
              throw new HTTPException(400, {
                  message: 'Invalid file type. Only JPG, PNG, WEBP allowed'
              });
          }

          const uploaded = await uploadImageHandler(file);
          
          if (user.public_id) {
              await cloudinary.uploader.destroy(user.public_id);
          }

          imageUrl = uploaded.url;
          publicId = uploaded.public_id;
      }

      const prismaData: Prisma.usersUpdateInput = {
          ...data,
          role: typeof data.role === 'string' ? data.role.toLowerCase() : data.role,
          image: imageUrl,
          public_id: publicId
      };

      if (data.password) {
          prismaData.password = await bcrypt.hash(data.password as string, 10);
      }

      const updated = await UserRepository.updateUserById(
        prisma, prismaData, id
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