# Báo cáo kiểm thử — Ecommerce Microservices

Ngày chạy: 2026-10-05
Môi trường: local, Gateway cổng 8080, Auth Service cổng 3001/50051, Customer Service cổng 3002/50052
Công cụ: curl (toàn bộ request đi qua API Gateway, không gọi thẳng service)

## Kết quả

| Test case | Kết quả | Ghi chú |
|---|---|---|
| TC-01 Đăng ký | PASS | register gw_member, gw_admin thành công |
| TC-03 Đăng nhập | PASS | trả về JWT hợp lệ cho cả 2 tài khoản |
| TC-05 Member tạo khách hàng | PASS | trả 403 {"message":"Forbidden: insufficient role"} |
| TC-06 Admin tạo khách hàng | PASS | trả 201, customer uid=2 được tạo trong MongoDB |
| TC-07 Member đọc danh sách | PASS | trả 200, thấy đúng customer vừa tạo |
| TC-08 Không có token | PASS | trả 401 {"message":"No token provided"} |
| TC-09/TC-11 Logout + dùng lại token | PASS | logout trả {"message":"Logged out successfully"}; gọi lại /api/customers với token đó trả {"message":"Token has been logged out"} |
| TC-12 Health check | PASS | {"status":"ok","service":"api-gateway"} |

## Kết luận
Toàn bộ luồng Client -> API Gateway (REST) -> Auth/Customer Service (gRPC) -> Database hoạt động đúng theo yêu cầu, bao gồm:
- Xác thực JWT tập trung tại Gateway, gọi xuống Auth Service qua gRPC
- Phân quyền RBAC đúng luật (member đọc được, admin mới tạo/sửa/xóa)
- Logout vô hiệu hóa token ngay lập tức, không cần đợi token hết hạn
- Rate limiting đã cấu hình (chưa test số lượng request vượt ngưỡng trong báo cáo này)

## Hạng mục chưa kiểm thử
- Rate limiting khi vượt quá 100 request/phút
- Product Service, Order Service, Shipment Service (ngoài phạm vi spec giảng viên)
- Docker Compose cho toàn hệ thống (chưa dựng)

## Cập nhật 2026-10-05 — chạy qua Docker Compose
Toàn bộ hệ thống (auth-db, customer-db, auth-service, customer-service, api-gateway) đã chạy bằng `docker compose up --build`, cả 5 container đều healthy. Chạy lại đúng chuỗi register -> login -> admin tạo customer -> health check qua cổng 8080 thật sự của container, tất cả PASS. Lưu ý: migration Prisma không tự chạy trong Docker, cần chạy tay `npx prisma migrate deploy` từ máy host sau lần `up` đầu tiên (database trong container là volume mới, trống).
