# Kiến trúc hệ thống

## Sơ đồ luồng

## Thành phần

### API Gateway
- Nhận request REST từ client
- Middleware `authenticate`: lấy Bearer token, gọi gRPC `VerifyToken` sang Auth Service để xác thực (không tự giải mã JWT tại chỗ — Auth Service là nơi duy nhất biết token nào đã bị logout/blacklist)
- Với request Customer, đính `role` đã xác thực vào gRPC metadata rồi gọi xuống Customer Service
- Middleware `rateLimiter`: express-rate-limit, 100 request/phút mỗi IP

### Auth Service
- REST (cổng 3001): dùng để test độc lập, không qua Gateway
- gRPC (cổng 50051): Gateway gọi qua đây — Register, Login, Logout, VerifyToken
- Blacklist token logout lưu tạm trong RAM (Set), đủ dùng cho quy mô bài tập

### Customer Service
- REST (cổng 3002) và gRPC (cổng 50052) chạy song song, dùng chung models/Customer.js
- gRPC nhận `role` qua metadata (không verify JWT — tin tưởng Gateway đã xác thực), áp RBAC ngay trong resolver

## Database-per-Service
Mỗi service có database riêng, không service nào truy cập trực tiếp database của service khác:
- Auth Service: PostgreSQL riêng (auth_db)
- Customer Service: MongoDB riêng (customer_db)

`uid` là khóa dùng chung về mặt nghiệp vụ (cùng một người dùng), nhưng không có khóa ngoại thật giữa 2 database — đúng nguyên tắc Database-per-Service.
