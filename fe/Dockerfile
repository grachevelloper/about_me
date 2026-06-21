FROM node:20-alpine

RUN corepack enable

WORKDIR /app


COPY package*json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 5173

CMD ["pnpm", "start"]
