# Phase 1 - Authentication & Authorization

## Đã hoàn thành

✅ Cấu hình Spring Boot với Neon PostgreSQL  
✅ Cấu hình Spring Security + JWT  
✅ API Đăng ký (`POST /api/auth/register`)  
✅ API Đăng nhập (`POST /api/auth/login`)  
✅ Authorization Filter phân quyền theo UserRole  
✅ Cấu hình CORS cho Frontend  
✅ Cấu hình Swagger UI  

## Cách chạy

1. Cài đặt dependencies:
```bash
cd BACKEND
./mvnw clean install
```

2. Chạy ứng dụng:
```bash
./mvnw spring-boot:run
```

3. Truy cập Swagger UI:
```
http://localhost:8080/swagger-ui.html
```

## API Endpoints

### Authentication

#### 1. Đăng ký
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "phoneNumber": "0123456789",
  "role": "BUYER"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "username": "testuser",
  "email": "test@example.com",
  "role": "BUYER"
}
```

#### 2. Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "testuser",
  "password": "password123"
}
```

Response: Giống như đăng ký

### Test Authorization

Sử dụng token từ response để test các endpoint:

```http
GET /api/test/buyer
Authorization: Bearer {token}
```

## User Roles

- `BUYER` - Người mua
- `SELLER` - Người bán
- `INSPECTOR` - Người kiểm định
- `ADMIN` - Quản trị viên

## Phân quyền

- `/api/auth/**` - Public (không cần đăng nhập)
- `/api/test/public` - Public
- `/api/buyer/**` - BUYER hoặc ADMIN
- `/api/seller/**` - SELLER hoặc ADMIN
- `/api/inspector/**` - INSPECTOR
- `/api/admin/**` - ADMIN only

## Swagger UI

Truy cập: `http://localhost:8080/swagger-ui.html`

Để test API với JWT:
1. Đăng ký/đăng nhập để lấy token
2. Click nút "Authorize" trên Swagger UI
3. Nhập: `Bearer {token}`
4. Click "Authorize"
5. Bây giờ có thể test các protected endpoints

## CORS Configuration

Frontend có thể gọi API từ:
- `http://localhost:3000` (React)
- `http://localhost:5173` (Vite)

## JWT Configuration

- Secret key: Cấu hình trong `application.properties`
- Expiration: 24 giờ (86400000 ms)
- Token format: `Bearer {token}`

## Database

Kết nối Neon PostgreSQL đã được cấu hình trong `application.properties`

## Next Steps (Phase 2)

- Implement CRUD cho Bicycle Listings
- Upload hình ảnh
- Search & Filter
