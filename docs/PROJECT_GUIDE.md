# 📚 Hướng Dẫn Dự Án - Website Mua Bán Xe Đạp Cũ

## 📖 Mục Lục
1. [Giới thiệu](#giới-thiệu)
2. [4 User Roles](#4-user-roles)
3. [Tasks Còn Thiếu](#tasks-còn-thiếu)
4. [API Endpoints Tổng Hợp](#api-endpoints-tổng-hợp)

---

## Giới thiệu

Dự án xây dựng nền tảng kết nối mua bán xe đạp thể thao cũ với 4 vai trò chính:
- **BUYER**: Người mua xe
- **SELLER**: Người bán xe
- **INSPECTOR**: Người kiểm định xe
- **ADMIN**: Quản trị viên

**Tech Stack:**
- Backend: Spring Boot 4.0.3 + PostgreSQL (Neon)
- Frontend: React + Vite
- Authentication: JWT
- Payment: Stripe
- Shipping: GHN
- AI: Gemini

---

## 4 User Roles

### 1️⃣ BUYER (Người Mua)

**Quyền hạn:**
- Xem & tìm kiếm xe đạp
- Tạo đơn hàng (đặt mua/đặt cọc)
- Thanh toán qua Stripe
- Chat với Seller
- Đánh giá Seller sau khi mua
- Quản lý Wishlist
- Xem lịch sử đơn hàng

**Endpoints:**
```
GET    /api/listings                    # Xem danh sách xe
GET    /api/listings/{id}               # Chi tiết xe
POST   /api/buyer/orders                # Tạo đơn hàng
GET    /api/buyer/orders                # Lịch sử đơn
GET    /api/buyer/orders/{id}           # Chi tiết đơn
PATCH  /api/buyer/orders/{id}/cancel    # Hủy đơn
POST   /api/reviews                     # Đánh giá seller
POST   /api/wishlists/{listingId}       # Thêm wishlist
DELETE /api/wishlists/{listingId}       # Xóa wishlist
GET    /api/wishlists                   # Xem wishlist
POST   /api/conversations               # Tạo chat
POST   /api/conversations/{id}/messages # Gửi tin nhắn
GET    /api/conversations/{id}/messages # Xem tin nhắn
POST   /api/payments/create-intent      # Tạo payment
POST   /api/payments/confirm            # Xác nhận payment
```

---

### 2️⃣ SELLER (Người Bán)

**Quyền hạn:**
- Đăng tin bán xe
- Sửa/xóa tin đăng
- Upload ảnh xe
- Xem & quản lý đơn hàng
- Xác nhận/từ chối đơn
- Chat với Buyer
- Yêu cầu kiểm định xe
- Xem reviews của mình

**Endpoints:**
```
POST   /api/seller/listings             # Đăng tin
PUT    /api/seller/listings/{id}        # Sửa tin
DELETE /api/seller/listings/{id}        # Xóa tin
GET    /api/seller/listings             # Danh sách tin của mình
GET    /api/seller/listings/{id}/stats  # Thống kê views
POST   /api/seller/listings/{id}/images # Upload ảnh
DELETE /api/seller/listings/{id}/images/{imageId} # Xóa ảnh
GET    /api/seller/orders               # Đơn hàng nhận được
GET    /api/seller/orders/{id}          # Chi tiết đơn
PATCH  /api/seller/orders/{id}/confirm  # Xác nhận đơn
PATCH  /api/seller/orders/{id}/reject   # Từ chối đơn
POST   /api/seller/inspections/request  # Yêu cầu kiểm định
GET    /api/seller/inspections          # Lịch sử kiểm định
GET    /api/reviews/seller/{sellerId}   # Xem reviews
```

---

### 3️⃣ INSPECTOR (Người Kiểm Định)

**Quyền hạn:**
- Xem danh sách xe cần kiểm định
- Tạo báo cáo kiểm định
- Upload báo cáo PDF
- Cập nhật trạng thái kiểm định

**Endpoints:**
```
GET /api/inspector/inspections              # Danh sách yêu cầu
GET /api/inspections/{id}                   # Chi tiết yêu cầu
PUT /api/inspector/inspections/{id}/report  # Submit báo cáo
```

---

### 4️⃣ ADMIN (Quản Trị Viên)

**Quyền hạn:**
- Quản lý Users (xem, kích hoạt, xóa)
- Duyệt/từ chối tin đăng
- Quản lý danh mục & thương hiệu
- Xử lý tranh chấp
- Xem thống kê & báo cáo
- Quản lý phí dịch vụ

**Endpoints:**
```
# User Management
GET    /api/admin/users                    # Danh sách users
GET    /api/admin/users/{id}               # Chi tiết user
PATCH  /api/admin/users/{id}/activate      # Kích hoạt/vô hiệu
DELETE /api/admin/users/{id}               # Xóa user

# Listing Management
GET   /api/admin/listings                  # Tất cả listings
PATCH /api/admin/listings/{id}/approve     # Duyệt tin
PATCH /api/admin/listings/{id}/reject      # Từ chối tin

# Catalog Management
GET    /api/admin/categories               # Danh sách categories
POST   /api/admin/categories               # Tạo category
PUT    /api/admin/categories/{id}          # Sửa category
DELETE /api/admin/categories/{id}          # Xóa category
GET    /api/admin/brands                   # Danh sách brands
POST   /api/admin/brands                   # Tạo brand
PUT    /api/admin/brands/{id}              # Sửa brand
DELETE /api/admin/brands/{id}              # Xóa brand

# Dispute Management
GET   /api/admin/disputes                  # Danh sách tranh chấp
GET   /api/disputes/{id}                   # Chi tiết tranh chấp
PATCH /api/admin/disputes/{id}/resolve     # Giải quyết

# Statistics & Reports
GET /api/admin/stats                       # Tổng quan
GET /api/admin/stats/revenue               # Doanh thu theo tháng
GET /api/admin/stats/listings              # Xe đăng theo tuần
GET /api/admin/service-fees                # Phí dịch vụ
GET /api/admin/inspections                 # Tất cả kiểm định
GET /api/admin/notifications/system        # Thông báo hệ thống
```

---

## Tasks Còn Thiếu

### 🔴 Cần bổ sung 4 tasks vào Jira:

#### Sprint 2:
**BS-82: [BE-B] Review & Rating System**
- POST /api/reviews
- GET /api/reviews/seller/{sellerId}
- GET /api/reviews/listing/{listingId}
- Tính toán reputationScore

**BS-84: [FE-C] Review & Rating UI**
- Review form với rating stars
- Review list trên seller profile
- Review badge trên listing

#### Sprint 3:
**BS-83: [BE-B] Inspection Request API**
- POST /api/seller/inspections/request
- GET /api/seller/inspections
- Notify inspectors

**BS-85: [FE-C] Payment Integration UI**
- Stripe Elements form
- Payment confirmation page
- Payment history

---

## API Endpoints Tổng Hợp

### Authentication (Public)
```
POST /api/auth/register  # Đăng ký
POST /api/auth/login     # Đăng nhập
```

### Listings (Public/Seller)
```
GET    /api/listings                           # Public: Tìm kiếm
GET    /api/listings/{id}                      # Public: Chi tiết
POST   /api/seller/listings                    # Seller: Tạo
PUT    /api/seller/listings/{id}               # Seller: Sửa
DELETE /api/seller/listings/{id}               # Seller: Xóa
GET    /api/seller/listings                    # Seller: Danh sách
POST   /api/seller/listings/{id}/images        # Seller: Upload ảnh
```

### Orders (Buyer/Seller)
```
POST  /api/buyer/orders                # Buyer: Tạo đơn
GET   /api/buyer/orders                # Buyer: Lịch sử
GET   /api/buyer/orders/{id}           # Buyer: Chi tiết
PATCH /api/buyer/orders/{id}/cancel    # Buyer: Hủy
GET   /api/seller/orders               # Seller: Đơn nhận
PATCH /api/seller/orders/{id}/confirm  # Seller: Xác nhận
PATCH /api/seller/orders/{id}/reject   # Seller: Từ chối
```

### Chat (Buyer/Seller)
```
POST  /api/conversations                    # Tạo chat
GET   /api/conversations                     # Danh sách
GET   /api/conversations/{id}/messages      # Xem tin nhắn
POST  /api/conversations/{id}/messages      # Gửi tin nhắn
PATCH /api/conversations/{id}/read          # Đánh dấu đã đọc
```

### Payment (Buyer)
```
POST /api/payments/create-intent  # Tạo payment intent
POST /api/payments/confirm        # Xác nhận thanh toán
GET  /api/payments/history        # Lịch sử thanh toán
```

### Shipping (Buyer/Seller)
```
POST /api/shipping/calculate-fee        # Tính phí ship
POST /api/shipping/create-order         # Tạo đơn GHN
GET  /api/shipping/{orderCode}/status   # Tracking
```

### Reviews (Buyer)
```
POST /api/reviews                      # Tạo review
GET  /api/reviews/seller/{sellerId}    # Reviews của seller
GET  /api/reviews/listing/{listingId}  # Reviews của listing
```

### Inspections (Seller/Inspector)
```
POST /api/seller/inspections/request        # Seller: Yêu cầu
GET  /api/seller/inspections                # Seller: Lịch sử
GET  /api/inspector/inspections             # Inspector: Danh sách
PUT  /api/inspector/inspections/{id}/report # Inspector: Submit
GET  /api/inspections/{id}                  # Chi tiết
```

### Disputes (Buyer/Seller/Admin)
```
POST  /api/disputes                        # Tạo tranh chấp
GET   /api/admin/disputes                  # Admin: Danh sách
GET   /api/disputes/{id}                   # Chi tiết
PATCH /api/admin/disputes/{id}/resolve     # Admin: Giải quyết
```

### Wishlist (Buyer)
```
POST   /api/wishlists/{listingId}  # Thêm
DELETE /api/wishlists/{listingId}  # Xóa
GET    /api/wishlists              # Xem tất cả
```

### Notifications (All)
```
GET   /api/notifications              # Danh sách
PATCH /api/notifications/{id}/read    # Đánh dấu đã đọc
PATCH /api/notifications/read-all     # Đọc tất cả
```

### Chatbot (All)
```
POST /api/chatbot/ask  # Hỏi Gemini AI
```

### User Profile (All)
```
GET /api/users/me              # Profile của mình
PUT /api/users/me              # Cập nhật profile
GET /api/users/{id}/profile    # Xem profile người khác
```

### Admin APIs
```
# Users
GET    /api/admin/users
GET    /api/admin/users/{id}
PATCH  /api/admin/users/{id}/activate
DELETE /api/admin/users/{id}

# Listings
GET   /api/admin/listings
PATCH /api/admin/listings/{id}/approve
PATCH /api/admin/listings/{id}/reject

# Categories & Brands
CRUD /api/admin/categories
CRUD /api/admin/brands

# Stats
GET /api/admin/stats
GET /api/admin/stats/revenue
GET /api/admin/stats/listings
GET /api/admin/service-fees
GET /api/admin/inspections
```

---

## Tổng Số Endpoints: ~70 APIs

**Phân bổ:**
- Authentication: 2
- Listings: 7
- Orders: 7
- Chat: 5
- Payment: 3
- Shipping: 3
- Reviews: 3
- Inspections: 5
- Disputes: 4
- Wishlist: 3
- Notifications: 3
- Chatbot: 1
- User Profile: 3
- Admin: 21

---

## 📝 Notes

1. Tất cả API (trừ auth & public listings) đều cần JWT token
2. Role-based authorization được enforce bởi Spring Security
3. Swagger UI: http://localhost:8080/swagger-ui.html
4. CORS enabled cho localhost:3000 và localhost:5173

---

## 🚀 Quick Start

### Backend
```bash
cd BACKEND
./mvnw spring-boot:run
```

### Frontend
```bash
cd FRONTEND
npm install
npm run dev
```

### Test API
1. Đăng ký user: POST /api/auth/register
2. Đăng nhập: POST /api/auth/login
3. Copy JWT token
4. Dùng token trong header: `Authorization: Bearer {token}`
