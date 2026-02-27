# builder stage
FROM node:20.19-alpine AS builder

WORKDIR /usr/src/app

# install bun
RUN npm install -g bun

# copy deps
COPY package.json bun.lockb tsconfig.json ./

RUN bun install

# copy prisma
COPY prisma.config.ts ./

COPY prisma ./prisma

COPY .env .env

RUN bunx prisma generate

# copy source
COPY src ./src

# build typescript
RUN bun run build


# production stage
FROM oven/bun:1-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app /usr/src/app

EXPOSE 3000

CMD ["bun", "run", "start"]
