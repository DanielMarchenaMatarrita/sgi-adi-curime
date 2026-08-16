FROM node:24.18.0-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN DATABASE_URL=postgresql://localhost:5432/placeholder npx prisma generate --config prisma.config.ts

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
