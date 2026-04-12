import { Hono } from "hono";
import type { AppContext } from "../../context/context.js";
import withPrisma from "../../libs/prisma.js";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/admin.middleware.js";
import { AbsensiService } from "./absensi.service.js";
import { AbsensiValidation } from "./absensi.validation.js";
import { ONE_DAY, redis } from "../../helpers/redis.js";
import { safeJson } from "../../helpers/safeJson..js";
import { Prisma } from "../../generated/prisma/client.js";

export const AbsensiController = new Hono<AppContext>()

// GET all absensi — admin only
AbsensiController.get('/absensi', authMiddleware, requireRole('admin'), withPrisma, async (c) => {
    const cacheKey = "absensi:all"
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
        c.header("x-cache", "HIT")
        return c.json(cachedData, 200)
    }

    const prisma = c.get('prisma')
    const response = await AbsensiService.getAllAbsensi(prisma)

    c.header("x-cache", "MISS")
    await redis.set(cacheKey, response, { ex: ONE_DAY })
    return c.json(response, 200)
})

// GET absensi by user (own) — authenticated user
AbsensiController.get('/absensi/me', authMiddleware, withPrisma, async (c) => {
    const prisma = c.get('prisma')
    const user = c.get('user') as { id: number }

    const response = await AbsensiService.getAbsensiByUser(prisma, user.id)
    return c.json(response, 200)
})

// GET absensi by id — admin only
AbsensiController.get('/absensi/:id', authMiddleware, requireRole('admin'), withPrisma, async (c) => {
    const prisma = c.get('prisma')
    const id = Number(c.req.param('id'))

    if (Number.isNaN(id)) {
        throw new HTTPException(400, { message: 'Invalid absensi id' })
    }

    const response = await AbsensiService.getAbsensiById(prisma, id)
    return c.json(response, 200)
})

// GET absensi by user id — admin only
AbsensiController.get('/absensi/user/:userId', authMiddleware, requireRole('admin'), withPrisma, async (c) => {
    const prisma = c.get('prisma')
    const userId = Number(c.req.param('userId'))

    if (Number.isNaN(userId)) {
        throw new HTTPException(400, { message: 'Invalid user id' })
    }

    const response = await AbsensiService.getAbsensiByUser(prisma, userId)
    return c.json(response, 200)
})

// POST create absensi — admin or self-check-in
AbsensiController.post('/absensi', authMiddleware, withPrisma, async (c) => {
    const prisma = c.get('prisma')
    const user = c.get('user') as { id: number, role: string }
    const raw = await safeJson(c)
    const validated = AbsensiValidation.CREATE.parse(raw)

    // Security check: if not admin, must be self-check-in
    if (user.role.toLowerCase() !== 'admin' && validated.idUser !== user.id) {
        throw new HTTPException(403, { message: 'You can only check-in for yourself' })
    }

    const prismaData: Prisma.absensiCreateInput = {
        users: {
            connect: { id_user: validated.idUser }
        },
        no_member: validated.noMember ?? null,
        date: validated.date,
        status: validated.status
    }

    const response = await AbsensiService.createAbsensi(prisma, prismaData)
    await redis.del("absensi:all")
    return c.json(response, 201)
})

// PATCH update absensi — admin only
AbsensiController.patch('/absensi/:id', authMiddleware, requireRole('admin'), withPrisma, async (c) => {
    const prisma = c.get('prisma')
    const id = Number(c.req.param('id'))

    if (Number.isNaN(id)) {
        throw new HTTPException(400, { message: 'Invalid absensi id' })
    }

    const raw = await safeJson(c)
    const validated = AbsensiValidation.UPDATE.parse(raw)

    const isEmpty = !validated.idUser && !validated.noMember && !validated.date && !validated.status
    if (isEmpty) {
        throw new HTTPException(400, { message: 'No data provided to update' })
    }

    const prismaData: Prisma.absensiUpdateInput = {
        users: validated.idUser
            ? { connect: { id_user: validated.idUser } }
            : undefined,
        no_member: validated.noMember,
        date: validated.date,
        status: validated.status
    }

    const response = await AbsensiService.updateAbsensiById(prisma, id, prismaData)
    await redis.del("absensi:all")
    return c.json(response, 200)
})

// DELETE absensi — admin only
AbsensiController.delete('/absensi/:id', authMiddleware, requireRole('admin'), withPrisma, async (c) => {
    const prisma = c.get('prisma')
    const id = Number(c.req.param('id'))

    if (Number.isNaN(id)) {
        throw new HTTPException(400, { message: 'Invalid absensi id' })
    }

    const response = await AbsensiService.deleteAbsensiById(prisma, id)
    await redis.del("absensi:all")
    return c.json(response, 200)
})
