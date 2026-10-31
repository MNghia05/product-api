# Test Cases — chạy qua API Gateway (http://localhost:8080)

## TC-01: Đăng ký tài khoản mới
- Bước: POST /api/auth/register với username/password hợp lệ
- Kỳ vọng: 201, trả về uid/username/role

## TC-02: Đăng ký username đã tồn tại
- Bước: POST /api/auth/register với username đã có
- Kỳ vọng: 400

## TC-03: Đăng nhập đúng thông tin
- Bước: POST /api/auth/login với username/password đúng
- Kỳ vọng: 200, trả về token

## TC-04: Đăng nhập sai mật khẩu
- Bước: POST /api/auth/login với password sai
- Kỳ vọng: 401

## TC-05: Member tạo khách hàng (phải bị chặn)
- Bước: POST /api/customers với token role=member
- Kỳ vọng: 403 Forbidden

## TC-06: Admin tạo khách hàng (phải thành công)
- Bước: POST /api/customers với token role=admin
- Kỳ vọng: 201, trả về customer vừa tạo

## TC-07: Member đọc danh sách khách hàng
- Bước: GET /api/customers với token role=member
- Kỳ vọng: 200, trả về mảng customer

## TC-08: Gọi API không có token
- Bước: GET /api/customers không có header Authorization
- Kỳ vọng: 401 No token provided

## TC-09: Member xóa khách hàng (phải bị chặn)
- Bước: DELETE /api/customers/:uid với token role=member
- Kỳ vọng: 403 Forbidden

## TC-10: Admin xóa khách hàng (phải thành công)
- Bước: DELETE /api/customers/:uid với token role=admin
- Kỳ vọng: 200

## TC-11: Logout rồi dùng lại token cũ
- Bước: POST /api/auth/logout, sau đó GET /api/customers với cùng token
- Kỳ vọng: request sau logout bị từ chối (token đã vào blacklist)

## TC-12: Gateway health check
- Bước: GET /health
- Kỳ vọng: 200, {"status":"ok","service":"api-gateway"}
