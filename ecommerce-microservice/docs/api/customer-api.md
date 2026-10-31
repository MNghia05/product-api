# Customer Service API (qua API Gateway: http://localhost:8080/api/customers)

Mọi endpoint yêu cầu header `Authorization: Bearer <token>`.

## GET /
Role: member hoặc admin
Response 200: mảng Customer

## GET /:uid
Role: member hoặc admin
Response 200: 1 Customer
Response 404: không tìm thấy

## POST /
Role: admin
Request:
```json
{ "uid": 2, "fullname": "string", "age": 25, "address": "string" }
```
Response 201: Customer vừa tạo
Response 403: role không đủ quyền (member bị chặn)

## PUT /:uid
Role: admin
Request: các field muốn cập nhật (fullname, age, address)
Response 200: Customer sau cập nhật

## DELETE /:uid
Role: admin
Response 200:
```json
{ "message": "Customer deleted successfully" }
```
