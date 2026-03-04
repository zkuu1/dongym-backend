import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES = (process.env.JWT_EXPIRES || "1d") as SignOptions["expiresIn"];

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in env");
}

export interface UserJwtPayload {
  id: number;
  name: string;
  role: string;
}

export function generateUserToken(payload: UserJwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
}

export function verifyToken(token: string): UserJwtPayload {
  return jwt.verify(token, JWT_SECRET) as UserJwtPayload;
}