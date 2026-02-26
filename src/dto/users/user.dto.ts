import type {memberships, users} from "../../generated/prisma/client.js"
import {
    type PaginationMeta,
    buildPaginationMeta
} from "../../dto/pagination.dto.js"


// ======== request =========== 
// req
export type CreateUsersRequest = {
    name: string
    email: string
    password: string
    address?: string
    image?: string
    role: string
}

// login
export type loginUsersRequest = {
    email: string
    password: string
}

// logout
export type LogoutUsersRequest = {
    id: string
}

// ========= data response =======
// users data
export type UsersData = {
    id: number
    name: string
    password: string
    address?: string | null
    image?: string | null
    role: string
    token?: string | null
    memberships?: MembershipsData[]
    createdAt?: Date
}

// memberships data
export type MembershipsData = {
    idMembership : number
    idUsers: number
    name: string
    description?: string | null
    numberMember?: string | null
    expiredAt: Date
}



// ========== wrapper =============
export type ApiResponse<T, M = unknown> = {
    message: string
    success: boolean
    data: T
    meta?: M
}

// ========== function ==============
export function toUsersData(
    user: users
) : UsersData {
    return {
        id: user.id_user,
        name: user.name,
        password: user.name,
        address: user.role,
        image: user.image,
        role: user.role,
        token: user.token
    }
}

export function toMembershipsData (
    membership: memberships
) : MembershipsData {
    return {
        idMembership: membership.id_membership,
        idUsers: membership.id_user,
        name: membership.name,
        description: membership.description,
        numberMember: membership.no_member,
        expiredAt: membership.expired_at

    }
        
}

// ============= wrapper ==================
export function toUsersResponse (
    user: users & { 
        memberships?: memberships[]
    },
    message: string
) : ApiResponse<UsersData> {
    return {
        success: true,
        message,
        data: toUsersData(user)
    }
}

export function toUserListResponse<T, U> (
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