import { Hono } from "hono"
import { googleAuth } from "@hono/oauth-providers/google"
import jwt from "jsonwebtoken"
import { PrismaClient } from "../../generated/prisma/client.js"
import type { AppContext } from "../../context/context.js"
import withPrisma from "../../libs/prisma.js"

export const GoogleController = new Hono<AppContext>()

GoogleController.use("/auth/google",
  googleAuth({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    scope: ["openid", "email", "profile"],
  })
)

GoogleController.get('/auth/google/callback', withPrisma, async(c) => {

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
    }

    const token = jwt.sign(
    { id: created.id_user, email: created.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )

    await prisma.users.update({
        where: { id_user: created.id_user },
        data: { token }
    })

    return c.json({
        message: "Login success",
        token,
        user: created
})
})