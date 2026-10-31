# Auth Service API (qua API Gateway: http://localhost:8080/api/auth)

## POST /register
Request:
```json
{ "username": "string", "password": "string", "role": "member | admin (optional, default member)" }
```
Response 201:
```json
{ "uid": 1, "username": "string", "role": "member" }
```
Response 400: username đã tồn tại, hoặc role không hợp lệ

## POST /login
Request:
```json
{ "username": "string", "password": "string" }
```
Response 200:
```json
{ "token": "jwt...", "user": { "uid": 1, "username": "string", "role": "member" } }
```
Response 401: sai username/password

## POST /logout
Header: `Authorization: Bearer <token>`
Response 200:
```json
{ "message": "Logged out successfully" }
```
Sau logout, token bị đưa vào blacklist — mọi request dùng lại token này bị từ chối 401/403.
