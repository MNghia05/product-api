FROM node:20-alpine
WORKDIR /app

COPY services/customer-service/package*.json ./services/customer-service/
WORKDIR /app/services/customer-service
RUN npm install --production

WORKDIR /app
COPY proto ./proto
COPY services/customer-service ./services/customer-service

WORKDIR /app/services/customer-service
EXPOSE 3002 50052
CMD ["node", "server.js"]
