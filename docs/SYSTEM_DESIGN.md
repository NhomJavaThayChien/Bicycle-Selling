# 📐 TÀI LIỆU THIẾT KẾ & KIẾN TRÚC HỆ THỐNG
**Dự án: Website Kết Nối Mua Bán Xe Đạp Thể Thao Cũ**

---

## 1. Công nghệ & Công cụ sử dụng (Tech Stack)

Để đảm bảo hiệu năng, tính bảo mật và trải nghiệm người dùng, hệ thống sử dụng các công nghệ hiện đại sau:

### 🌟 Frontend (Web Client)
*   **Core:** ReactJS (hoặc Next.js) kết hợp với Vite để build siêu tốc.
*   **Ngôn ngữ:** JavaScript / TypeScript (Khuyến nghị dùng TypeScript để bắt lỗi Type).
*   **Styling & UI:** TailwindCSS (tùy chỉnh linh hoạt) kết hợp với các Material Design Components (MUI / Ant Design).
*   **State Management & Data Fetching:** React Query (quản lý state API) và Axios (gửi HTTP request).
*   **Routing:** React Router DOM (v6+).
*   **Biểu đồ (Admin):** Recharts.

### 🌟 Backend (REST API Server)
*   **Core:** Java 17+ và Spring Boot 3.x.
*   **Database Access:** Spring Data JPA + Hibernate (ORM).
*   **Bảo mật:** Spring Security + JSON Web Token (JWT) + BCrypt (Mã hóa mật khẩu).
*   **Validation:** Hibernate Validator.
*   **Tài liệu API:** Springdoc OpenAPI (Swagger UI).
*   **Build Tool:** Maven.

### 🌟 Database & Lưu trữ
*   **RDBMS:** PostgreSQL (Cụ thể là dùng Neon.tech cloud để team dễ dùng chung không cần cài local).
*   **Lưu trữ file/ảnh:** AWS S3, Cloudinary hoặc Firebase Storage.

### 🌟 Dịch vụ Báo bên thứ ba (Third-party Integrations)
*   **Thanh toán:** Stripe API (Test mode để mô phỏng luồng tiền thật).
*   **Vận chuyển:** GHN (Giao Hàng Nhanh) API (Test mode để tính phí và lấy mã vận đơn).
*   **Trí tuệ nhân tạo (AI):** Google Gemini Pro API (Xây dựng chatbot giải đáp tự động).

### 🌟 DevOps & Quản lý dự án
*   **Quản lý Task:** Jira Software (Mô hình Scrum 4 Sprints).
*   **Quản lý Source Code:** GitHub (Dùng chiến lược Member Branching hoặc Feature Branching).
*   **Môi trường chạy:** Docker (Đóng gói ứng dụng) / Vercel (Deploy FE) / Render hoặc Heroku (Deploy BE).

---

## 2. Yêu cầu Hệ thống (System Requirements)

### 2.1 Yêu cầu Chức năng (Functional Requirements)
**Đối với Khách hàng (Buyer):**
*   Tìm kiếm, lọc xe theo các tiêu chí (Hãng, Giá, Phân loại, Tình trạng, Kích cỡ khung).
*   Xem chi tiết sản phẩm, đánh giá và thông tin người bán.
*   Thêm vào danh sách yêu thích (Wishlist).
*   Hệ thống trò chuyện (Chat) trực tiếp với người bán.
*   Đặt hàng, thanh toán trực tuyến (tích hợp Stripe) hoặc đặt cọc.
*   Theo dõi trạng thái đơn hàng (tích hợp GHN Tracking).

**Đối với Người bán (Seller):**
*   Đăng tin bán xe (yêu cầu điền đầy đủ thông tin, upload ảnh thật).
*   Quản lý danh sách tin đăng (Sửa, ẩn, xóa).
*   Quản lý đơn đặt hàng từ khách hàng (Xác nhận, hủy).
*   Tương tác với khách hàng qua Chat.
*   Sử dụng Chatbot (Gemini) để tư vấn và viết mô tả tự động cho xe.

**Đối với Ban Quản trị (Admin / Inspector):**
*   Duyệt bài đăng mới của Seller (Bài đăng chỉ hiển thị công khai sau khi được Approve).
*   Quản lý User (Kích hoạt, khóa tài khoản vi phạm).
*   Quản lý danh mục xe và thương hiệu (Categories, Brands).
*   Tiếp nhận yêu cầu kiểm định, kiểm tra xe thực tế và cấp chứng nhận chất lượng (Inspector).
*   Giải quyết khiếu nại, tranh chấp giao dịch (Dispute).
*   Xem Dashboard thống kê (Doanh thu, số lượng xe, người dùng mới, biểu đồ tăng trưởng).

### 2.2 Yêu cầu Phi chức năng (Non-functional Requirements)
*   **Hiệu năng (Performance):** Tốc độ phản hồi API < 500ms. Hình ảnh upload cần được nén/tối ưu băng thông trước khi gửi lên Cloud. Hỗ trợ 1000+ người truy cập đồng thời vào giờ cao điểm.
*   **Bảo mật (Security):** Mật khẩu bắt buộc mã hóa Bcrypt. Mọi API tương tác dữ liệu phải xác thực token (JWT). Dữ liệu cá nhân (địa chỉ, số điện thoại) chỉ được tiết lộ giữa hai bên khi phát sinh đơn hàng. Bảo vệ dự án khỏi các lỗi SQL Injection, XSS.
*   **Độ tin cậy (Reliability):** Backend thiết kế theo nguyên lý bảo toàn giao dịch (ACID) đối với luồng Checkout và Payment. Hệ thống kỳ vọng Uptime tính sẵn sàng > 99%.
*   **Khả năng mở rộng (Scalability):** Tách bạch rõ giữa Backend API và Frontend React để triển khai độc lập. Dễ dàng nhân bản container backend hoặc sử dụng Load Balancer (khi chạy Docker).
*   **Tiêu chuẩn UX/UI:** Ứng dụng triển khai chuẩn thiết kế Mobile-first Design, hoạt động cực mượt mà trên Mobile/Tablet. Hỗ trợ giao diện sáng/tối (Light/Dark Mode).

---

## 3. Tổng quan Kiến trúc Hệ thống (High-Level Architecture)

Hệ thống được thiết kế theo kiến trúc Client-Server (Frontend - Backend tách biệt), giao tiếp thông qua RESTful API.

```mermaid
graph TD
    %% Frontend Clients
    subgraph Frontend [Frontend (React/Vite)]
        B[Buyer UI]
        S[Seller UI]
        A[Admin/Inspector Dashboard]
    end

    %% Backend Server
    subgraph Backend [Backend (Spring Boot)]
        API[REST API Controllers]
        Security[Spring Security + JWT]
        Services[Business Logic Services]
        Repo[JPA/Hibernate Data Access]
        
        API --> Security
        Security --> Services
        Services --> Repo
    end

    %% Database
    subgraph Database [Database]
        DB[(Neon PostgreSQL)]
    end

    %% External Services
    subgraph External [External Services / 3rd Party]
        Stripe[Stripe API - Thanh toán]
        GHN[GHN API - Giao hàng]
        Gemini[Google Gemini API - Chatbot]
    end

    %% Connections
    B <-->|HTTP/JSON| API
    S <-->|HTTP/JSON| API
    A <-->|HTTP/JSON| API
    
    Repo <-->|TCP/IP| DB
    
    Services -->|HTTP| Stripe
    Services -->|HTTP| GHN
    Services -->|HTTP| Gemini
```

---

## 4. Sơ đồ Thực thể Liên kết (ERD - Database Schema)

Dưới đây là sơ đồ mô tả cấu trúc Database cơ bản với khoảng 16 thực thể (Entities) chính của dự án.

```mermaid
erDiagram
    USERS ||--o{ BICYCLE_LISTING : posts
    USERS ||--o{ ORDERS : places
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ WISHLIST : saves
    USERS {
        Long id PK
        String username
        String email
        String password
        String role "BUYER, SELLER, ADMIN, INSPECTOR"
        double reputationScore
    }

    CATEGORIES ||--o{ BICYCLE_LISTING : categorizes
    CATEGORIES {
        Long id PK
        String name
    }

    BRANDS ||--o{ BICYCLE_LISTING : brands
    BRANDS {
        Long id PK
        String name
    }

    BICYCLE_LISTING ||--o{ LISTING_IMAGES : contains
    BICYCLE_LISTING {
        Long id PK
        Long sellerId FK
        Long categoryId FK
        Long brandId FK
        String title
        String description
        double price
        String condition
        String status "PENDING, APPROVED, REJECTED, SOLD"
    }

    LISTING_IMAGES {
        Long id PK
        Long listingId FK
        String imageUrl
    }

    WISHLIST {
        Long id PK
        Long userId FK
        Long listingId FK
    }

    ORDERS ||--o{ REVIEWS : has
    ORDERS ||--|| DISPUTES : can_have
    BICYCLE_LISTING ||--o{ ORDERS : included_in
    ORDERS {
        Long id PK
        Long buyerId FK
        Long listingId FK
        double totalAmount
        String status "PENDING, PAID, SHIPPED, COMPLETED, CANCELLED"
        String shippingCode
    }

    REVIEWS {
        Long id PK
        Long orderId FK
        Long reviewerId FK
        Long revieweeId FK
        int rating
        String comment
    }

    INSPECTIONS {
        Long id PK
        Long listingId FK
        Long inspectorId FK
        String reportUrl
        String status "REQUESTED, PASSED, FAILED"
    }
    BICYCLE_LISTING ||--o{ INSPECTIONS : undergoes

    DISPUTES {
        Long id PK
        Long orderId FK
        String reason
        String status "OPEN, RESOLVED"
        String adminDecision
    }

    CONVERSATIONS ||--o{ MESSAGES : contains
    USERS ||--o{ CONVERSATIONS : participates
    CONVERSATIONS {
        Long id PK
        Long buyerId FK
        Long sellerId FK
    }

    MESSAGES {
        Long id PK
        Long conversationId FK
        Long senderId FK
        String content
        boolean isRead
    }

    NOTIFICATIONS {
        Long id PK
        Long userId FK
        String message
        boolean isRead
    }
    USERS ||--o{ NOTIFICATIONS : receives
```

---

## 5. Các Luồng Nghiệp Vụ Cốt Lõi (Sequence Diagrams)

### 5.1. Luồng Đăng tin & Kiểm duyệt (Post & Approve Listing)
Đảm bảo chất lượng tin đăng trước khi hiển thị cho người mua.

```mermaid
sequenceDiagram
    actor Seller
    participant System as Backend System
    actor Admin/Inspector
    participant DB as Database

    Seller->>System: 1. Đăng tin bán xe (Upload Info + Image)
    System->>DB: 2. Lưu tin (Status: PENDING_APPROVAL)
    System->>Seller: 3. Thông báo: "Chờ duyệt"
    
    System->>Admin/Inspector: 4. Gửi Notification có tin mới cần duyệt
    Admin/Inspector->>System: 5. Xem chi tiết tin đăng
    
    alt Tin đăng hợp lệ
        Admin/Inspector->>System: 6a. Duyệt tin (Approve)
        System->>DB: Cập nhật Status: APPROVED
        System->>Seller: Thông báo: "Bài đăng đã được duyệt"
    else Tin đăng vi phạm / Cần kiểm định thực tế
        Admin/Inspector->>System: 6b. Từ chối (Reject) + Lý do
        System->>DB: Cập nhật Status: REJECTED
        System->>Seller: Thông báo: "Bài đăng bị từ chối" + Kèm lý do
    end
```

### 5.2. Luồng Mua Bán & Thanh Toán (Order & Payment)
Quá trình từ lúc người mua đặt cọc đến khi kết thúc giao dịch và đánh giá.

```mermaid
sequenceDiagram
    actor Buyer
    participant System as Backend
    participant Stripe as Stripe API
    participant GHN as GHN API
    actor Seller

    Buyer->>System: 1. Nhấn "Mua ngay" / "Đặt cọc"
    System->>Stripe: 2. Tạo Payment Intent
    Stripe-->>System: 3. Trả về Client Secret
    System-->>Buyer: 4. Trả Client Secret để hiển thị form thanh toán
    
    Buyer->>Stripe: 5. Người mua nhập thẻ, xác nhận thanh toán
    Stripe-->>System: 6. Webhook/Callback: Thanh toán thành công!
    
    System->>DB: 7. Tạo Order (Status: PAID)
    System->>Seller: 8. Thông báo: "Bạn có đơn hàng mới đã thanh toán"
    
    Seller->>System: 9. Đóng gói & Xác nhận giao hàng
    System->>GHN: 10. Tạo đơn giao hàng qua Giao Hàng Nhanh
    GHN-->>System: 11. Trả về Mã vận đơn (Tracking Code)
    System-->>Buyer: 12. Cập nhật mã Tracking, đổi trạng thái sang SHIPPED
    
    Note over Buyer, Seller: Vài ngày sau (Nhận được hàng)
    
    Buyer->>System: 13. Xác nhận "Đã nhận hàng"
    System->>DB: 14. Cập nhật Order Status: COMPLETED, Listing: SOLD
    
    Buyer->>System: 15. Gửi Đánh giá (Review) cho Seller
    System->>DB: 16. Lưu Review, tính lại Điểm uy tín (Reputation Score) của Seller
```

---

## 6. Quản Lý Trạng Thái (State Machines)

### 6.1. Vòng đời của Tin đăng (Bicycle Listing State)
```mermaid
stateDiagram-v2
    [*] --> DRAFT : Người bán đang nhập
    DRAFT --> PENDING_APPROVAL : Bấm Đăng tin
    PENDING_APPROVAL --> APPROVED : Admin Duyệt
    PENDING_APPROVAL --> REJECTED : Admin Từ chối
    REJECTED --> PENDING_APPROVAL : Người bán sửa & gửi lại
    APPROVED --> HIDDEN : Người bán ẩn tin
    HIDDEN --> APPROVED : Người bán hiện tin
    APPROVED --> SOLD : Đã giao dịch thành công
    SOLD --> [*]
```

### 6.2. Vòng đời của Đơn hàng (Order State)
```mermaid
stateDiagram-v2
    [*] --> PENDING_PAYMENT : Bắt đầu đặt hàng
    PENDING_PAYMENT --> CANCELLED : Không thanh toán/Hủy
    PENDING_PAYMENT --> PAID : Thanh toán thành công (Stripe)
    PAID --> SHIPPED : Seller chuyển cho GHN
    SHIPPED --> DELIVERED : GHN báo phát thành công
    DELIVERED --> COMPLETED : Buyer xác nhận nhận hàng
    DELIVERED --> DISPUTED : Buyer báo lỗi/Khiếu nại
    DISPUTED --> COMPLETED : Admin phân xử xong
    CANCELLED --> [*]
    COMPLETED --> [*] : Cho phép Đánh giá (Review)
```

---

## 7. Tổ chức Thư mục (Project Structure)

### 7.1 Backend (Spring Boot)
```text
BACKEND/
├── src/main/java/com/bicycle/selling/
│   ├── config/            # Cấu hình Security, CORS, Swagger, JWT
│   ├── controller/        # Xử lý Request/Response (REST APIs)
│   ├── dto/               # Data Transfer Objects (Request/Response payload)
│   ├── exception/         # Xử lý lỗi tập trung (Global Exception Handler)
│   ├── model/             # JPA Entities (User, BicycleListing...)
│   │   └── enums/         # Enum cho Status, Role...
│   ├── repository/        # Spring Data JPA Interfaces
│   ├── service/           # Logic nghiệp vụ chính
│   │   ├── impl/          # Implement của logic
│   │   └── thirdparty/    # Logic tích hợp Stripe, GHN, Gemini
│   ├── security/          # JWT Filters, UserDetails
│   └── SellingApplication.java
└── src/main/resources/
     ├── application.properties  # Cấu hình kết nối DB, API Keys
     └── data.sql                # Script seed dữ liệu giả
```

### 7.2 Frontend (React / Vite)
```text
FRONTEND/
├── src/
│   ├── assets/            # CSS, Hình ảnh tĩnh
│   ├── components/        # Các thành phần tái sử dụng (Button, Table, Card...)
│   ├── layouts/           # Header, Footer, AdminSidebar
│   ├── pages/             # Các màn hình chính (Home, Login, AdminDashboard)
│   ├── services/          # Các hàm Axios gọi REST API Backend
│   ├── hooks/             # Custom React Hooks
│   ├── context/           # React Context (AuthContext, CartContext)
│   ├── utils/             # Các hàm tiện ích (Format tiền, Format ngày...)
│   ├── App.jsx            # Cấu hình React Router Go
│   └── main.jsx           # Entry point
├── package.json
└── vite.config.js
```
