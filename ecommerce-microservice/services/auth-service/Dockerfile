FROM node:20-alpine
WORKDIR /app

COPY services/auth-service/package*.json ./services/auth-service/
WORKDIR /app/services/auth-service
RUN npm install --production

WORKDIR /app
COPY proto ./proto
COPY services/auth-service ./services/auth-service

WORKDIR /app/services/auth-service
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

EXPOSE 3001 50051
CMD ["node", "server.js"]
