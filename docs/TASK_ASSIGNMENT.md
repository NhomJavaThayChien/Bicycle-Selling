# 📋 TÀI LIỆU PHÂN CÔNG NHIỆM VỤ
## Dự án: Website Kết Nối Mua Bán Xe Đạp Thể Thao Cũ

---

## 👥 Thành Viên Nhóm

| Vai trò | Tên thành viên | Phụ trách chính |
|---------|----------------|-----------------|
| **Nhóm trưởng + Backend Developer** | `[Tên A]` | Authentication, Kiến trúc hệ thống, API Core |
| **Backend Developer** | `[Tên B]` | API Giao dịch, Tích hợp bên thứ ba |
| **Frontend Developer** | `[Tên C]` | Giao diện Buyer & Seller |
| **Frontend Developer** | `[Tên D]` | Giao diện Admin, Inspector & Mở rộng |

> **Lưu ý chung:**
> - **Database** đã được thiết kế và hoàn thiện (toàn bộ 16 JPA Entities).
> - **Backend API** phải hoàn thành **trước 3 ngày** so với Frontend để FE có dữ liệu mà test.
> - Backend đặt API theo chuẩn `REST`, trả về `JSON`. Frontend gọi API qua `fetch` / `axios`.
> - Mọi API backend đều cần có **Swagger/OpenAPI doc** để FE tham khảo.

---

## 🗓️ Kế Hoạch Tổng Thể (Gợi ý 4 tuần)

```
Tuần 1: Auth + Setup + Core API + UI Skeleton
Tuần 2: Tính năng cốt lõi (Seller, Buyer, Listing)
Tuần 3: Giao dịch, Kiểm định, Quản trị, Chat
Tuần 4: Tích hợp mở rộng + Test + Fix Bug + Báo cáo
```

---

## � Mô Tả Chi Tiết 4 User Roles

### 1️⃣ BUYER (Người Mua)
**Quyền hạn:**
- Xem danh sách xe đạp công khai
- Tìm kiếm & lọc xe theo hãng, danh mục, giá, tình trạng, khung
- Xem chi tiết listing (tăng viewCount)
- Tạo order để mua xe (đặt mua / đặt cọc)
- Thanh toán qua Stripe
- Chat với Seller
- Xem lịch sử đơn hàng của mình
- Đánh giá Seller sau khi đơn hoàn thành
- Quản lý Wishlist (yêu thích xe)
- Xem profile cá nhân & chỉnh sửa thông tin

**Endpoints:** `/api/buyer/**`, `/api/listings/**` (GET), `/api/orders/**`, `/api/conversations/**`, `/api/reviews/**`, `/api/wishlists/**`

---

### 2️⃣ SELLER (Người Bán)
**Quyền hạn:**
- Đăng tin bán xe (tạo listing)
- Sửa / ẩn / xóa tin đăng của mình
- Upload ảnh cho listing
- Xem danh sách đơn hàng từ Buyers
- Xác nhận / từ chối đơn hàng
- Chat với Buyers
- Nhận thanh toán (Stripe)
- Xem lịch sử giao dịch
- Xem profile cá nhân & điểm uy tín
- Xem danh sách reviews từ Buyers

**Endpoints:** `/api/seller/**`, `/api/listings/**` (POST/PUT/DELETE), `/api/orders/**`, `/api/conversations/**`, `/api/reviews/**`

---

### 3️⃣ INSPECTOR (Người Kiểm Định)
**Quyền hạn:**
- Xem danh sách xe cần kiểm định (status = REQUESTED)
- Tạo báo cáo kiểm định (điểm từng hạng mục: khung, phanh, truyền động, bánh, yên/tay lái)
- Upload báo cáo PDF
- Cập nhật trạng thái kiểm định (REQUESTED → COMPLETED)
- Xem chi tiết listing & thông tin xe
- Xem profile cá nhân

**Endpoints:** `/api/inspector/**`, `/api/inspections/**`

---

### 4️⃣ ADMIN (Quản Trị Viên)
**Quyền hạn:**
- **Quản lý Users:** xem danh sách, kích hoạt / vô hiệu hoá tài khoản, xem chi tiết
- **Duyệt Listings:** xem danh sách xe PENDING_APPROVAL, duyệt / từ chối kèm lý do
- **Quản lý Danh mục & Thương hiệu:** CRUD categories, CRUD brands
- **Quản lý Giao dịch:** xem tất cả orders, cập nhật trạng thái
- **Xử lý Tranh chấp:** xem danh sách disputes, giải quyết kèm kết quả
- **Quản lý Kiểm định:** xem danh sách inspection requests
- **Xem Thống kê:** tổng user, tổng xe, giao dịch tháng, doanh thu, biểu đồ
- **Quản lý Service Fees:** xem doanh thu từ phí dịch vụ
- **Quản lý Notifications:** xem tất cả thông báo hệ thống

**Endpoints:** `/api/admin/**` (toàn bộ)

---

## 🔷 THÀNH VIÊN A — Nhóm Trưởng + Backend

> **Phụ trách:** Xương sống backend - Auth, Listing, Search, Quản lý User

### Phase 1 — Tuần 1 (Setup & Auth)
- [ ] Tạo và cấu hình project Spring Boot, kết nối Neon PostgreSQL
- [ ] Cấu hình Spring Security + JWT
- [ ] Viết API **Đăng ký** (`POST /api/auth/register`)
- [ ] Viết API **Đăng nhập** (`POST /api/auth/login`) — trả về JWT Token
- [ ] Viết **Authorization Filter** phân quyền theo `UserRole` (BUYER, SELLER, INSPECTOR, ADMIN)
- [ ] Cấu hình CORS cho Frontend có thể gọi API
- [ ] Cấu hình Swagger UI (`/swagger-ui.html`)

### Phase 2 — Tuần 2 (Listing API)
- [ ] **API đăng tin** (`POST /api/listings`) — Seller
- [ ] **API sửa / ẩn / xóa tin** (`PUT/PATCH/DELETE /api/listings/{id}`) — Seller
- [ ] **API duyệt / từ chối tin** (`PATCH /api/admin/listings/{id}/approve`) — Admin
- [ ] **API tìm kiếm & lọc xe** (`GET /api/listings?brand=&category=&priceMin=&priceMax=&condition=&frameSize=`) — Public
- [ ] **API xem chi tiết** (`GET /api/listings/{id}`) — Public, tăng `viewCount`
- [ ] **Upload ảnh** (`POST /api/listings/{id}/images`) — lưu URL vào `listing_images`

### Phase 3 — Tuần 3 (User & Quản lý)
- [ ] **Profile cá nhân** (`GET/PUT /api/users/me`)
- [ ] **Xem profile người bán** (`GET /api/users/{id}/profile`) — gồm điểm uy tín
- [ ] **Quản lý User** (Admin): `GET /api/admin/users`, `GET /api/admin/users/{id}`, `PATCH /api/admin/users/{id}/activate`, `DELETE /api/admin/users/{id}`
- [ ] **Quản lý danh mục & thương hiệu** (`CRUD /api/admin/categories`, `/api/admin/brands`)
- [ ] **Wishlist**: `POST /api/wishlists/{listingId}`, `DELETE /api/wishlists/{listingId}`, `GET /api/wishlists`
- [ ] **Seller Listings Management**: `GET /api/seller/listings` (danh sách tin của seller), `GET /api/seller/listings/{id}/stats` (thống kê views, likes)
- [ ] **Buyer Orders**: `GET /api/buyer/orders`, `GET /api/buyer/orders/{id}`, `PATCH /api/buyer/orders/{id}/cancel`
- [ ] **Seller Orders**: `GET /api/seller/orders`, `GET /api/seller/orders/{id}`, `PATCH /api/seller/orders/{id}/confirm`
- [ ] Viết Unit Test cho các service chính

### Phase 4 — Tuần 4
- [ ] Review code của thành viên B
- [ ] Fix bug tích hợp Backend + Frontend
- [ ] Hỗ trợ deploy / README

---

## 🔶 THÀNH VIÊN B — Backend Developer

> **Phụ trách:** Giao dịch, Chat, Kiểm định, Tranh chấp, Tích hợp bên thứ ba

### Phase 1 — Tuần 1 (Setup)
- [ ] Thiết lập Stripe Test Mode (tạo tài khoản sandbox)
- [ ] Thiết lập GHN Sandbox (đăng ký tài khoản dev)
- [ ] Thiết lập Gemini API Key

### Phase 2 — Tuần 2 (Chat & Order)
- [ ] **API tạo đơn đặt mua / đặt cọc** (`POST /api/orders`) — Buyer
- [ ] **API cập nhật trạng thái đơn** (`PATCH /api/orders/{id}/status`) — Seller/Admin
- [ ] **API lịch sử đơn hàng** (`GET /api/orders/my-orders`) — Buyer & Seller
- [ ] **API tạo cuộc hội thoại** (`POST /api/conversations`) giữa Buyer và Seller
- [ ] **API gửi / nhận tin nhắn** (`POST/GET /api/conversations/{id}/messages`)
- [ ] **API đánh dấu đã đọc** (`PATCH /api/conversations/{id}/read`)

### Phase 3 — Tuần 3 (Tích hợp mở rộng)
- [ ] **Stripe** — Tạo Payment Intent (`POST /api/payments/create-intent`)
- [ ] **Stripe** — Xác nhận thanh toán (`POST /api/payments/confirm`)
- [ ] **Stripe** — Lịch sử thanh toán (`GET /api/payments/history`)
- [ ] **GHN** — Tính phí vận chuyển (`POST /api/shipping/calculate-fee`)
- [ ] **GHN** — Tạo đơn giao hàng (`POST /api/shipping/create-order`)
- [ ] **GHN** — Tra cứu trạng thái đơn (`GET /api/shipping/{orderCode}/status`)
- [ ] **Gemini Chatbot** — Nhận câu hỏi, gọi API Gemini, trả về câu trả lời (`POST /api/chatbot/ask`)
- [ ] **Review (Đánh giá)** — `POST /api/reviews` sau khi đơn COMPLETED; tự cập nhật `reputationScore` cho Seller
- [ ] **Review (Đánh giá)** — `GET /api/reviews/seller/{sellerId}` xem reviews của seller, `GET /api/reviews/listing/{listingId}` xem reviews của listing
- [ ] **Kiểm định** — `POST /api/inspections/request` (Seller yêu cầu), `GET /api/inspector/inspections` (danh sách cho Inspector)
- [ ] **Kiểm định** — `PUT /api/inspector/inspections/{id}/report` — Inspector upload báo cáo, `GET /api/inspections/{id}` xem chi tiết
- [ ] **Tranh chấp** — `POST /api/disputes` (Buyer/Seller tạo), `GET /api/admin/disputes` (Admin xem danh sách), `GET /api/disputes/{id}` (xem chi tiết)
- [ ] **Tranh chấp** — `PATCH /api/admin/disputes/{id}/resolve` — Admin xử lý
- [ ] **Hệ thống Thông báo** — Tự động tạo `Notification` khi: đơn mới, tin nhắn mới, duyệt tin
- [ ] **Hệ thống Thông báo** — `GET /api/notifications`, `PATCH /api/notifications/{id}/read`, `PATCH /api/notifications/read-all`
- [ ] **Service Fee** — `GET /api/admin/service-fees` — Admin xem doanh thu

### Phase 4 — Tuần 4
- [ ] **Thống kê Admin**: `GET /api/admin/stats` (tổng user, tổng xe, giao dịch tháng, doanh thu)
- [ ] **Thống kê Admin**: `GET /api/admin/stats/revenue` (doanh thu theo tháng), `GET /api/admin/stats/listings` (xe đăng theo tuần)
- [ ] **Quản lý Inspections**: `GET /api/admin/inspections` (danh sách tất cả kiểm định)
- [ ] **Notifications cho Admin**: `GET /api/admin/notifications/system` (thông báo hệ thống)
- [ ] Viết Unit Test cho Payment, Shipping service
- [ ] Fix bug tích hợp

---

## 🟢 THÀNH VIÊN C — Frontend Developer

> **Phụ trách:** Giao diện cho Buyer, Seller và trải nghiệm mua bán cốt lõi

### Phase 1 — Tuần 1 (Setup & Layout)
- [ ] Khởi tạo project Frontend (ReactJS + Vite hoặc Next.js)
- [ ] Cài thư viện: `axios`, `react-router-dom`, `react-query`
- [ ] Tạo cấu trúc thư mục: `pages/`, `components/`, `services/` (API calls), `hooks/`
- [ ] Xây dựng **Layout chung**: Header, Footer
- [ ] Dựng màn hình **Trang chủ (Landing Page)**: Banner, nút CTA, xe nổi bật

### Phase 2 — Tuần 2 (Auth & Listing)
- [ ] Màn hình **Đăng ký** (chọn vai trò Buyer / Seller)
- [ ] Màn hình **Đăng nhập** — lưu JWT token vào `localStorage`
- [ ] Setup **Protected Route** (chặn các trang cần đăng nhập)
- [ ] Màn hình **Danh sách xe** với bộ lọc: hãng, danh mục, giá, tình trạng, khung
- [ ] Màn hình **Chi tiết xe**: gallery ảnh, thông số kỹ thuật, badge "Đã kiểm định", thông tin người bán
- [ ] Màn hình **Wishlist** — nút trái tim, xem danh sách xe đã lưu

### Phase 3 — Tuần 3 (Seller & Buyer Journey)
- [ ] Màn hình **Đăng tin bán xe** — Form nhiều bước: thông tin cơ bản, thông số kỹ thuật, giá & vị trí, upload nhiều ảnh
- [ ] Màn hình **Quản lý tin đăng của Seller** — danh sách, nút sửa/ẩn/xóa, badge trạng thái
- [ ] Màn hình **Đặt mua / Đặt cọc** — form điền địa chỉ, chọn phương thức thanh toán, xem phí ship từ GHN
- [ ] Màn hình **Lịch sử đơn hàng** cho Buyer (xem trạng thái đơn, tracking)
- [ ] Màn hình **Quản lý đơn hàng** cho Seller (xác nhận/từ chối đơn)
- [ ] Màn hình **Chat / Nhắn tin** — danh sách hội thoại và khung chat

### Phase 4 — Tuần 4
- [ ] Màn hình **Đánh giá người bán** sau khi đơn hoàn thành
- [ ] Màn hình **Profile cá nhân** (xem điểm uy tín, edit thông tin)
- [ ] Màn hình **Xem profile Seller** — danh sách xe đang bán, điểm đánh giá
- [ ] **Tích hợp Stripe UI** — form nhập thẻ test (dùng Stripe.js Elements)
- [ ] **Chatbot UI** — nút chat nổi góc màn hình, bong bóng chat với Gemini
- [ ] Fix UI/UX bug, responsive mobile

---

## 🟣 THÀNH VIÊN D — Frontend Developer

> **Phụ trách:** Giao diện Admin, Inspector, Notification và tính năng mở rộng

### Phase 1 — Tuần 1 (Setup & Design System)
- [ ] Dựng **Design System** dùng chung: màu sắc, typography, button, badge, card
- [ ] Tạo các **component dùng chung**: `Modal`, `Table`, `Pagination`, `StatusBadge`, `ImageGallery`, `Toast`
- [ ] Màn hình **Trang 404** và màn hình **Loading Skeleton**
- [ ] Cấu hình **Axios interceptor** tự động đính kèm JWT vào mọi request

### Phase 2 — Tuần 2 (Admin Dashboard)
- [ ] Màn hình **Tổng quan Admin**: thẻ thống kê (tổng user, tổng xe, giao dịch tháng, doanh thu)
- [ ] Màn hình **Kiểm duyệt tin đăng**: bảng danh sách xe PENDING_APPROVAL, nút Duyệt / Từ chối kèm form lý do
- [ ] Màn hình **Quản lý User**: bảng user, bộ lọc theo role, nút kích hoạt / vô hiệu hoá tài khoản
- [ ] Màn hình **Quản lý Danh mục & Thương hiệu**: CRUD danh mục, CRUD hãng xe

### Phase 3 — Tuần 3 (Inspector & Dispute)
- [ ] Màn hình **Dashboard Inspector**: danh sách yêu cầu kiểm định (REQUESTED)
- [ ] Màn hình **Form Kiểm định**: nhập điểm từng hạng mục (khung, phanh, truyền động, bánh, yên/tay lái), upload báo cáo PDF
- [ ] Màn hình **Quản lý Tranh chấp** (Admin): xem chi tiết, form nhập kết quả giải quyết
- [ ] Màn hình **Quản lý Giao dịch & Phí dịch vụ** (Admin): bảng tổng hợp
- [ ] **Hệ thống Notification UI**: chuông thông báo trên header, dropdown danh sách chưa đọc, đánh dấu đã đọc

### Phase 4 — Tuần 4
- [ ] Màn hình **Báo cáo thống kê** (Admin): biểu đồ số xe đăng theo tuần, doanh thu theo tháng (`recharts`)
- [ ] **GHN Tracking UI** — hiển thị trạng thái đơn hàng đang giao theo từng bước
- [ ] **Responsive & Dark Mode** cho toàn bộ Admin Panel
- [ ] Fix bug tổng thể, review PR của thành viên C
- [ ] Hỗ trợ viết báo cáo / demo

---

## 🔗 Quy Tắc Phối Hợp Backend & Frontend

Để FE và BE làm việc song song không bị chờ nhau:

1. **Thành viên A & B:** Mỗi tuần cập nhật Swagger UI, thông báo API nào đã sẵn sàng.
2. **Thành viên C & D:** Khi chờ API thật, dùng **Mock Data** (dữ liệu giả) dựng giao diện trước. Khi API xong thì thay.
3. Tất cả API trả về cùng một cấu trúc JSON chuẩn:

```json
{
  "success": true,
  "message": "Thành công",
  "data": {}
}
```

---

## ⚠️ Quy Tắc Git Chung

| Quy tắc | Mô tả |
|---------|-------|
| **Nhánh chính** | `main` — chỉ merge khi chức năng hoàn chỉnh |
| **Nhánh phát triển** | `dev` — merge hàng ngày từ các nhánh tính năng |
| **Nhánh cá nhân** | `feature/[ten-chuc-nang]` (VD: `feature/auth-api`, `feature/listing-ui`) |
| **Commit message** | Tiếng Anh, rõ ràng: `feat: add login API`, `fix: encoding error in data.sql` |
| **Pull Request** | Phải có ít nhất 1 người review trước khi merge vào `dev` |

---

## 📦 Tài Khoản & Công Cụ Dùng Chung

| Công cụ | Mục đích | Ai cần |
|---------|----------|--------|
| **Neon.tech** | Database PostgreSQL Cloud | Cả nhóm (nhóm trưởng tạo, share connection string) |
| **Stripe Dashboard** | Quản lý test payment | Thành viên B |
| **GHN Sandbox** | Test vận chuyển | Thành viên B |
| **Google AI Studio** | Lấy Gemini API Key | Thành viên B |
| **GitHub** | Quản lý source code | Cả nhóm |
| **Swagger UI** | Tài liệu API (`/swagger-ui.html`) | Cả nhóm |
| **Postman** | Test API thủ công | Thành viên A, B |
