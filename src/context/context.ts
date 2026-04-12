import type { Prisma, PrismaClient } from "../generated/prisma/client.js";

export type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
  };
};

export type UserPayload = {
  role: string
  id: number;
};

export type AdminPayload = {
  id: number;
  name_admin: string;
  email: string;
};

export type AppContext = {
  Variables: {
    prisma: PrismaClient;
    admin: AdminPayload;
    user?: UserPayload;
    'user-google'?: any;
    token?: any;
  };
};


