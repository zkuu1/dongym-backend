import { Hono } from "hono";
import type { AppContext } from "../../../context/context.js"
import withPrisma from "../../../libs/prisma.js";
import { safeJson } from "../../../helpers/safeJson..js";
import { UserValidation } from "./user.validation.js";
import { UserRepository } from "./user.repository.js";

export const UserController = new Hono<AppContext>

UserController.get('/user', withPrisma, async(c) => {
    const prisma = c.get('prisma')
    const response = await UserRepository.getAllUsers(prisma)
    return c.json(response, 201)
})