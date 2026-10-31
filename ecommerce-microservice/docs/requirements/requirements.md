# Yêu cầu nghiệp vụ

## Nguồn
Yêu cầu từ giảng viên môn học (nhắn trực tiếp), áp dụng cho API Gateway + Auth Service + Customer Service.

## API Gateway
- Authentication: xác thực JWT của mọi request cần đăng nhập
- Authorization: kiểm tra role (RBAC) trước khi cho phép gọi xuống service
- Rate Limiting: giới hạn số request để chống lạm dụng
- Request Routing: định tuyến REST request từ client tới đúng service qua gRPC

## Auth Service
- Database: PostgreSQL
- Bảng User(uid, username, password, role)
- Password phải được mã hóa (không lưu plain text)
- API: register, login, logout
- Cấp JWT token khi login thành công

## Customer Service
- Database: MongoDB
- Dữ liệu khách hàng: (uid, fullname, age, address)
- CRUD đầy đủ, có RBAC:
  - read all customer, read customer: cần role = member (hoặc admin)
  - create, update, delete: cần role = admin

## Giao tiếp
- Client -> API Gateway: REST API
- API Gateway -> microservice: gRPC

## Phạm vi không nằm trong yêu cầu này
- Product Service, Order Service, Shipment Service (thuộc kế hoạch 5 bounded context mở rộng ban đầu, không nằm trong spec giảng viên gửi)
