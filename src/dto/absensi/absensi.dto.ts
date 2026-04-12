import type { absensi } from "../../generated/prisma/client.js";
import { type PaginationMeta, buildPaginationMeta } from "../pagination.dto.js";

export type AbsensiData = {
    id: number
    idUser: number
    noMember: string | null
    date: Date | string
    status: string
    createdAt?: Date | string
    users?: {
        name: string
        email: string
        image: string | null
    }
}

export type ApiResponse<T, M = unknown> = {
    message: string
    success: boolean
    data: T
    meta?: M
}

// func
export function toAbsensiData(absensi: absensi): AbsensiData {
    return {
        id: absensi.id_absensi,
        idUser: absensi.id_user,
        noMember: absensi.no_member,
        date: absensi.date,
        status: absensi.status,
        createdAt: absensi.createdAt,
        users: (absensi as any).users ? {
            name: (absensi as any).users.name,
            email: (absensi as any).users.email,
            image: (absensi as any).users.image
        } : undefined
    }
}

export function toAbsensiResponse(
    absensi: absensi,
    message: string
): ApiResponse<AbsensiData> {
    return {
        success: true,
        message,
        data: toAbsensiData(absensi)
    }
}

export function toAbsensiListResponse<T, U>(
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
