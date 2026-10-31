FROM node:20-alpine
WORKDIR /app

COPY services/api-gateway/package*.json ./services/api-gateway/
WORKDIR /app/services/api-gateway
RUN npm install --production

WORKDIR /app
COPY proto ./proto
COPY services/api-gateway ./services/api-gateway

WORKDIR /app/services/api-gateway
EXPOSE 8080
CMD ["node", "server.js"]
