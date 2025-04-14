# 1단계: 의존성 설치
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --silent

# 2단계: NestJS 빌드
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3단계: 실행 이미지
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache bash

COPY --from=builder /app/wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["./wait-for-it.sh", "mysql:3306", "--", "node", "dist/main.js"]