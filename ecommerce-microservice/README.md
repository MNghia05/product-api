# Ecommerce Microservices

Hệ thống backend microservices cho MVP thương mại điện tử, theo yêu cầu giảng viên: API Gateway (REST) + Auth Service + Customer Service (gRPC), Database-per-Service, RBAC.

## Cấu trúc dự án

- CLAUDE.md -- ngữ cảnh dự án cho Claude Code
- .claude/agents/ -- 3 SubAgent: ba-agent, dev-agent, test-agent
- docs/ -- requirements, architecture, api, test, reports
- services/api-gateway/ -- REST -> gRPC, auth, RBAC, rate limiting (cổng 8080)
- services/auth-service/ -- PostgreSQL, register/login/logout (REST 3001, gRPC 50051)
- services/customer-service/ -- MongoDB, CRUD + RBAC (REST 3002, gRPC 50052)
- services/product-service/ -- MongoDB, ngoài phạm vi spec giảng viên, chưa nối Gateway
- services/order-service/ -- chưa triển khai
- services/shipment-service/ -- chưa triển khai
- proto/ -- auth.proto, customer.proto, hợp đồng gRPC dùng chung
- docker-compose.yml -- chạy toàn bộ hệ thống (5 container)

## Chạy toàn bộ hệ thống

docker compose up --build

Lần đầu chạy, cần áp migration cho Auth Service (chỉ 1 lần, Docker không tự chạy migration):

cd services/auth-service
npx prisma migrate deploy

## Kiểm tra nhanh

curl http://localhost:8080/health

Xem đầy đủ API và luồng test tại docs/api/ và docs/test/.

## Công nghệ
Node.js, Express, gRPC (@grpc/grpc-js), Prisma 7 + PostgreSQL (Auth), Mongoose + MongoDB (Customer), JWT, bcrypt, Docker Compose.
