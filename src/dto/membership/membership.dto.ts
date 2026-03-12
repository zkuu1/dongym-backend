import type { memberships } from "../../generated/prisma/client.js";
import { type PaginationMeta, buildPaginationMeta } from "../pagination.dto.js";

export type CreateMembershipRequest = {
    idUser : number
    name : string
    description?: string
    noMember?: string
    expiredAt: Date | string
}

export type MembershipData = {
    id: number
    idUser: number
    name: string
    description?: string | null
    noMember: string | null
    expiredAt: Date | null
    createdAt?: string
}

export type ApiResponse<T, M = unknown> ={
    message: string
    success: boolean
    data: T
    meta?: M
}

// func
export function toMembershipData (
    membership: memberships
) : MembershipData {
    return {
        idUser: membership.id_user,
        id: membership.id_membership,
        name: membership.name,
        description: membership.description,
        noMember: membership.no_member,
        expiredAt: membership.expired_at
    }
}

export function toMembershipResponse (
    memberships: memberships,
    message: string
) : ApiResponse<MembershipData> {
    return {
        success: true,
        message,
        data: toMembershipData(memberships)
    }
}

export function toMembershipListResponse<T, U> (
    items: T[],
    message: string,
    mapper: (item: T) => U,
    page: number,
    limit: number,
    total: number
) : ApiResponse<U[], PaginationMeta> {
    return {
        success: true,
        message,
        data: items.map(mapper),
        meta: buildPaginationMeta(page, limit, total)
    }
}