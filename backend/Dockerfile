FROM node:22.15.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# Etapa de producción
FROM node:22.15.1-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
