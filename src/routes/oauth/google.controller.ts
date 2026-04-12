import { Hono } from "hono"
import { googleAuth } from "@hono/oauth-providers/google"
import jwt from "jsonwebtoken"
import { PrismaClient } from "../../generated/prisma/client.js"
import type { AppContext } from "../../context/context.js"
import withPrisma from "../../libs/prisma.js"
import { redis } from "../../helpers/redis.js"
import { generateUserToken } from "../../helpers/jwt.js"

export const GoogleController = new Hono<AppContext>()

const googleMiddleware = googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    scope: ["openid", "email", "profile"],
})

GoogleController.get("/auth/google", googleMiddleware)

GoogleController.get('/auth/google/callback', googleMiddleware, withPrisma, async(c) => {

    const prisma = c.get('prisma')
    const user = c.get('user-google')

    if (!user) {
    console.log("GOOGLE USER:", user)
    return c.json({ message: "Google authentication failed" }, 401)
    }
    
    const email = user?.email ?? ""
    const name = user?.name ?? email ?? "User"
    const image = user?.picture ?? ""

    let created = await prisma.users.findUnique({
        where: {email}
    })

    if (!created) {
        created = await prisma.users.create({
            data: {
                name,
                email,
                image,
                password: "",
                role: "user"
           }
        })

        await redis.del("users:all")
    }

    const token = generateUserToken({
        id: created.id_user,
        name: created.name,
        role: created.role
    })

    await prisma.users.update({
        where: { id_user: created.id_user },
        data: { token }
    })

    return c.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}/auth/google-login?token=${token}`)
})