import { Hono } from "hono";
import type { AppContext } from "../../../context/context.js";
import withPrisma from "../../../libs/prisma.js";
import { MembershipService } from "./membership.service.js";
import { ONE_DAY, redis } from "../../../helpers/redis.js";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { requireRole } from "../../../middlewares/admin.middleware.js";
import { MembershipValidation } from "./membership.validation.js";
import { safeJson } from "../../../helpers/safeJson..js";
import { Prisma } from "../../../generated/prisma/client.js";


export const MembershipController =  new Hono<AppContext>()

MembershipController.get('/membership', withPrisma, async(c) => {
    const cacheKey = "memberships:all"
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
    c.header("x-cache", "HIT")
     return c.json(cachedData, 200)
    }

    const prisma = c.get('prisma')
    const response = await MembershipService.getAllMemberships(prisma)
    c.header("x-cache", "MISS")

    await redis.set(cacheKey, response, {ex: ONE_DAY})
    return c.json(response, 200)

})

MembershipController.get('/membership/:id', withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const id = Number(c.req.param('id'))

    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid membership id' });
    }
    const response = await MembershipService.getMembershipById(prisma,id)
    return c.json(response, 200)
})

MembershipController.post('/membership', withPrisma, authMiddleware, requireRole('admin'), async(c) => {
    const prisma = c.get('prisma')
    const raw = await safeJson(c)
    const validated = MembershipValidation.CREATE.parse(raw)

    const prismaData: Prisma.membershipsCreateInput = {
        users: {
            connect: {
                id_user: validated.idUser
            }
        },
        name: validated.name,
        description: validated.description ?? null,
        no_member: validated.noMember ?? null,
        expired_at: validated.expiredAt
    }

    const response = await MembershipService.createMembership(prisma, prismaData)
    await redis.del("memberships:all", "users:all")
    return c.json(response, 201)
})

MembershipController.patch('/membership/:id', withPrisma, authMiddleware, requireRole('admin'), async(c) => {
    const prisma = c.get('prisma')
    const raw = await safeJson(c)
    const validated = MembershipValidation.UPDATE.parse(raw)


    const id = Number(c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid membership id' });
    }

    const prismaData: Prisma.membershipsUpdateInput = {
        users: validated.idUser ? {
            connect: {
                id_user: validated.idUser
            }
        } : undefined,
        name: validated.name,
        description: validated.description ?? undefined,
        no_member: validated.noMember ?? undefined,
        expired_at: validated.expiredAt
    }

    const response = await MembershipService.updateMembershipById(prisma, id, prismaData)
    await redis.del("memberships:all", "users:all")
    return c.json(response, 201)
})

MembershipController.delete('/membership/:id', withPrisma, authMiddleware, requireRole('admin'), async(c) => {
    const prisma = c.get('prisma')
    const id = Number(c.req.param('id'))
    if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid membership id' });
    }

    const response = await MembershipService.deleteMembershipById(prisma, id)
    await redis.del("memberships:all", "users:all")
    return c.json(response, 200)
})
