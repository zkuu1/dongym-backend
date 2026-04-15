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
            
        // Ambil id_user dari struktur relasi connect
        const id_user = data.users?.connect?.id_user;
            
        if (id_user) {
            const existing = await prisma.memberships.findFirst({
                where: { id_user }
            });
            
            if (existing) {
                throw new HTTPException(400, {
                    message: "User ini sudah terdaftar sebagai member. Silakan perbarui membership yang ada jika ingin melakukan perpanjangan."
                });
            }
        }

        try {
            const membership = await MembershipRepository.createMembership(prisma, data)
            return toMembershipResponse(membership, 'Membership created success')
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new HTTPException(400, {
                    message: `Nomor Member ${data.no_member} sudah digunakan oleh user lain.`
                })
            }
            throw error;
        }
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

        try {
            const membership = await MembershipRepository.updateMembershipById(prisma, id, data)
            if (Object.keys(data).length === 0) {
                throw new HTTPException(400, {
                message: 'Minimum one field is required to update memberships'
                });
            }
            
            return toMembershipResponse(membership, 'Membership updated success')
        } catch (error: any) {
             if (error.code === 'P2002') {
                throw new HTTPException(400, {
                    message: `Nomor Member ${data.no_member} sudah digunakan oleh user lain.`
                })
            }
            throw error;
        }
    }

    static async getMembershipByUser(
        prisma: PrismaClient,
        id_user: number
    ): Promise<ApiResponse<MembershipData>> {
        const membership = await MembershipRepository.findActiveByUser(prisma, id_user);
        if (!membership) {
            throw new HTTPException(404, {
                message: 'No active membership found for this user'
            });
        }
        return toMembershipResponse(membership, 'Get Membership success');
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