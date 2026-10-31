# Ecommerce Microservices — Project Context

## Tổng quan
Hệ thống microservices RESTful API cho MVP thương mại điện tử, theo yêu cầu giảng viên:
- Client gọi API Gateway bằng REST
- API Gateway gọi các service bằng gRPC
- Mỗi service có database riêng (Database-per-Service)

## Kiến trúc hiện tại

### API Gateway (services/api-gateway/, cổng 8080)
- Routing REST -> gRPC
- Authentication: verify JWT qua gRPC VerifyToken sang Auth Service
- Authorization: đính role đã xác thực vào gRPC metadata khi gọi Customer Service
- Rate limiting: express-rate-limit, 100 request/phút/IP

### Auth Service (services/auth-service/, REST cổng 3001, gRPC cổng 50051)
- Database: PostgreSQL (container auth-db, cổng 5433)
- Bảng User(uid, username, password, role) — password mã hóa bcrypt
- API: register, login, logout, verify
- role mặc định "member", có thể "admin"

### Customer Service (services/customer-service/, REST cổng 3002, gRPC cổng 50052)
- Database: MongoDB (container customer-db, cổng 27019)
- Customer(uid, fullname, age, address)
- RBAC: đọc (list/get) cần role member hoặc admin; tạo/sửa/xóa chỉ admin
- role được truyền qua gRPC metadata, service này không tự verify JWT

### Product Service (services/product-service/, REST cổng 3003) — chưa có gRPC, chưa nối Gateway
- Database: MongoDB (container product-db, cổng 27018)
- Product(pid, pname, price, quantity), có endpoint reserve/release tồn kho nguyên tử

### Order Service, Shipment Service — chưa triển khai (thư mục trống)

## Quy ước kỹ thuật
- Prisma luôn ghim bản 7 (`prisma@7`, `@prisma/client@7`) — KHÔNG nâng lên bản 8.x (release candidate, breaking changes)
- Mỗi service: `.env` riêng, `.gitignore` ở gốc repo đã ẩn `.env` và `node_modules`
- gRPC trên Windows cần `GRPC_DNS_RESOLVER=native` trong `.env` để tránh lỗi "No address added"
- Proto dùng chung nằm ở `proto/` (ngoài `services/`), mỗi service/gateway trỏ tới bằng đường dẫn tương đối

## Việc cần làm tiếp
- Viết docs/ (requirements, architecture, api, test, reports)
- Dockerize toàn bộ hệ thống (docker-compose.yml ở gốc)
- Cân nhắc làm tiếp Order/Shipment Service nếu mở rộng ngoài spec giảng viên
