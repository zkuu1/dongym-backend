import { Prisma, PrismaClient, type memberships } from "../../../generated/prisma/client.js";
import {
    type MembershipData,
    type ApiResponse,
    toMembershipData,
    toMembershipResponse,
    toMembershipListResponse
} from "../../../dto/membership/membership.dto.js"

import { HTTPException } from "hono/http-exception";
import bcrypt from 'bcrypt'
import { generateUserToken } from "../../../helpers/jwt.js";

import { MembershipRepository } from "./membership.repository.js";
import type { PaginationMeta } from "../../../dto/pagination.dto.js";

export class MembershipService {

    static async getAllMemberships(
        prisma: PrismaClient
    ) : Promise<ApiResponse<MembershipData[], PaginationMeta>> {

        const membership = await MembershipRepository.getAllMemberships(prisma)
        const page = 1
        const limit = membership.length
        const total = membership.length

        return toMembershipListResponse(membership, 'Get All Memberships success', toMembershipData, page, limit,total)
    }

    static async getMembershipById(
        prisma: PrismaClient,
        id: number
    ): Promise<ApiResponse<MembershipData>> {

        const membership = await MembershipRepository.findByIdMembership(prisma, id)
        if(!membership) {
            throw new HTTPException(400, {
                message: 'Id Membership not found'
            })
        }
        return toMembershipResponse(membership, 'Get Membership success')

    }

    static async createMembership(
        prisma: PrismaClient,
        data: Prisma.membershipsCreateInput
    ): Promise<ApiResponse<MembershipData>> {

        const membership = await MembershipRepository.createMembership(prisma, data)
        return toMembershipResponse(membership, 'Membership created success')
    }

    static async updateMembershipById(
        prisma: PrismaClient,
        id: number,
        data: Prisma.membershipsUpdateInput
    ): Promise<ApiResponse<MembershipData>> {

        const checked = await MembershipRepository.findByIdMembership(prisma, id)
        if(!checked) {
            throw new HTTPException(400, {
                message: 'Id Membership not found'
            })
        }

        const membership = await MembershipRepository.updateMembershipById(prisma, id, data)
        if (Object.keys(data).length === 0) {
            throw new HTTPException(400, {
            message: 'Minimum one field is required to update memberships'
            });
        }
        
        return toMembershipResponse(membership, 'Membership updated success')
    }

    static async deleteMembershipById(
        prisma: PrismaClient,
        id: number
    ): Promise<ApiResponse<MembershipData>> {
        
        const checked = await MembershipRepository.findByIdMembership(prisma,id)
        if (!checked) {
            throw new HTTPException(400, {
                message: 'Id Membership not found'
            })
        }

        const deleted = await MembershipRepository.deleteMembershipById(prisma, id)
        return toMembershipResponse(deleted, 'Membeship deleted success')
    }
}