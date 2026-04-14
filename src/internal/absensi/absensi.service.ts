import { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import {
    type AbsensiData,
    type ApiResponse,
    toAbsensiData,
    toAbsensiResponse,
    toAbsensiListResponse
} from "../../dto/absensi/absensi.dto.js";
import { HTTPException } from "hono/http-exception";
import { AbsensiRepository } from "./absensi.repository.js";
import type { PaginationMeta } from "../../dto/pagination.dto.js";

export class AbsensiService {

    static async getAllAbsensi(
        prisma: PrismaClient
    ): Promise<ApiResponse<AbsensiData[], PaginationMeta>> {
        const data = await AbsensiRepository.getAllAbsensi(prisma)
        const total = data.length

        return toAbsensiListResponse(data, 'Get All Absensi success', toAbsensiData, 1, total, total)
    }

    static async getAbsensiById(
        prisma: PrismaClient,
        id: number
    ): Promise<ApiResponse<AbsensiData>> {
        const absensi = await AbsensiRepository.findByIdAbsensi(prisma, id)
        if (!absensi) {
            throw new HTTPException(404, { message: 'Absensi not found' })
        }
        return toAbsensiResponse(absensi, 'Get Absensi success')
    }

    static async getAbsensiByUser(
        prisma: PrismaClient,
        id_user: number
    ): Promise<ApiResponse<AbsensiData[], PaginationMeta>> {
        const data = await AbsensiRepository.getAbsensiByUser(prisma, id_user)
        const total = data.length

        return toAbsensiListResponse(data, 'Get Absensi by user success', toAbsensiData, 1, total, total)
    }

    static async createAbsensi(
        prisma: PrismaClient,
        data: Prisma.absensiCreateInput
    ): Promise<ApiResponse<AbsensiData>> {
        // extract id_user from connect to check duplicate
        const idUser = (data.users as { connect: { id_user: number } }).connect.id_user
        const date = data.date as Date

        const existing = await AbsensiRepository.findByUserAndDate(prisma, idUser, date)
        if (existing) {
            throw new HTTPException(409, {
                message: 'Sudah Absensi Hari Ini'
            })
        }

        // Auto-check membership status
        const membership = await prisma.memberships.findFirst({
            where: {
                id_user: idUser,
                expired_at: {
                    gte: new Date()
                }
            }
        })

        const prismaData: Prisma.absensiCreateInput = {
            ...data,
            status: membership ? 'member' : 'non member',
            no_member: membership ? (membership.no_member ?? null) : (data.no_member ?? null)
        }

        const absensi = await AbsensiRepository.createAbsensi(prisma, prismaData)
        return toAbsensiResponse(absensi, 'Absensi created success')
    }

    static async updateAbsensiById(
        prisma: PrismaClient,
        id: number,
        data: Prisma.absensiUpdateInput
    ): Promise<ApiResponse<AbsensiData>> {
        const checked = await AbsensiRepository.findByIdAbsensi(prisma, id)
        if (!checked) {
            throw new HTTPException(404, { message: 'Absensi not found' })
        }

        const absensi = await AbsensiRepository.updateAbsensiById(prisma, id, data)
        return toAbsensiResponse(absensi, 'Absensi updated success')
    }

    static async deleteAbsensiById(
        prisma: PrismaClient,
        id: number
    ): Promise<ApiResponse<AbsensiData>> {
        const checked = await AbsensiRepository.findByIdAbsensi(prisma, id)
        if (!checked) {
            throw new HTTPException(404, { message: 'Absensi not found' })
        }

        const deleted = await AbsensiRepository.deleteAbsensiById(prisma, id)
        return toAbsensiResponse(deleted, 'Absensi deleted success')
    }

    static async getLeaderboard(
        prisma: PrismaClient,
        limit: number = 20
    ): Promise<any> {
        const data = await AbsensiRepository.getLeaderboard(prisma, limit)
        return {
            success: true,
            message: 'Get Leaderboard success',
            data
        }
    }

    static async getUserRank(
        prisma: PrismaClient,
        id_user: number
    ): Promise<any> {
        const rankData = await AbsensiRepository.getUserRank(prisma, id_user)
        return {
            success: true,
            message: rankData ? 'Get User Rank success' : 'User has no attendance records',
            data: rankData
        }
    }
}
