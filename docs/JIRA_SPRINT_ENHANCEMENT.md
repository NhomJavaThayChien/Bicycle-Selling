# 🔧 Bổ Sung Chi Tiết Cho Jira Sprint Hiện Tại

## 📋 Sprint 1 - Bổ Sung Subtasks

### BS-48: [BE-A] Setup project & Database
**Subtasks cần thêm:**
- [ ] BS-48.1: Tạo Spring Boot project với dependencies (Spring Web, JPA, Security, PostgreSQL, Lombok, Validation)
- [ ] BS-48.2: Cấu hình Neon PostgreSQL connection trong application.properties
- [ ] BS-48.3: Tạo 16 JPA Entities (User, BicycleListing, Order, Payment, Review, etc.)
- [ ] BS-48.4: Cấu hình Hibernate ddl-auto=update và encoding UTF-8
- [ ] BS-48.5: Test database connection và tạo tables tự động
- [ ] BS-48.6: Tạo data.sql với sample data (brands, categories)

**Acceptance Criteria:**
- ✅ Application khởi động thành công
- ✅ Tất cả 16 tables được tạo trong Neon DB
- ✅ Sample data được load thành công

---

### BS-49: [BE-A] Spring Security & Auth Login/Register
**Subtasks cần thêm:**
- [ ] BS-49.1: Tạo DTOs (LoginRequest, RegisterRequest, AuthResponse)
- [ ] BS-49.2: Implement JwtUtil class (generate, validate, getUserId)
- [ ] BS-49.3: Tạo UserDetailsImpl và UserDetailsServiceImpl
- [ ] BS-49.4: Tạo JwtAuthenticationFilter
- [ ] BS-49.5: Configure SecurityConfig với role-based authorization
- [ ] BS-49.6: Implement AuthService (register, login)
- [ ] BS-49.7: Tạo AuthController với 2 endpoints
- [ ] BS-49.8: Tạo UserRepository với findByUsernameOrEmail
- [ ] BS-49.9: Test API register với 4 roles (BUYER, SELLER, INSPECTOR, ADMIN)
- [ ] BS-49.10: Test API login và JWT token validation

**Endpoints:**
- `POST /api/auth/register`
- `POST /api/auth/login`

**Acceptance Criteria:**
- ✅ Register thành công với validation
- ✅ Login trả về JWT token
- ✅ Token có thể dùng để authenticate
- ✅ Password được hash với BCrypt

---

### BS-50: [BE-A] Swagger & CORS Configuration
**Subtasks cần thêm:**
- [ ] BS-50.1: Thêm springdoc-openapi dependency
- [ ] BS-50.2: Tạo OpenApiConfig với @SecurityScheme
- [ ] BS-50.3: Add @Tag và @Operation cho controllers
- [ ] BS-50.4: Configure CORS cho localhost:3000 và localhost:5173
- [ ] BS-50.5: Test Swagger UI tại /swagger-ui.html
- [ ] BS-50.6: Test CORS từ frontend mock

**Acceptance Criteria:**
- ✅ Swagger UI accessible và hiển thị đầy đủ APIs
- ✅ Có thể test API với JWT từ Swagger
- ✅ CORS không bị block từ frontend

---

### BS-51: [BE-B] Setup Third-party Sandboxes
**Subtasks cần thêm:**
- [ ] BS-51.1: Đăng ký Stripe Test Account và lấy API keys
- [ ] BS-51.2: Đăng ký GHN Sandbox và lấy API token
- [ ] BS-51.3: Lấy Gemini API Key từ Google AI Studio
- [ ] BS-51.4: Lưu keys vào application.properties (hoặc .env)
- [ ] BS-51.5: Tạo document hướng dẫn setup cho team
- [ ] BS-51.6: Test connection đến 3 services

**Acceptance Criteria:**
- ✅ Tất cả API keys hoạt động
- ✅ Document setup đầy đủ

---

### BS-52: [FE-C] Setup FE Project & Layout
**Subtasks cần thêm:**
- [ ] BS-52.1: Init React + Vite project
- [ ] BS-52.2: Install dependencies (axios, react-router-dom, react-query, tailwindcss)
- [ ] BS-52.3: Setup folder structure (pages/, components/, services/, hooks/, utils/)
- [ ] BS-52.4: Tạo Layout component (Header, Footer, Sidebar)
- [ ] BS-52.5: Setup React Router với routes cơ bản
- [ ] BS-52.6: Configure Tailwind CSS
- [ ] BS-52.7: Tạo theme colors & typography

**Acceptance Criteria:**
- ✅ Project chạy được trên localhost:5173
- ✅ Layout hiển thị đúng

---

### BS-53: [FE-C] Landing Page UI
**Subtasks cần thêm:**
- [ ] BS-53.1: Hero section với banner & CTA buttons
- [ ] BS-53.2: Featured listings carousel (mock data)
- [ ] BS-53.3: Search bar với filters
- [ ] BS-53.4: Category cards
- [ ] BS-53.5: Footer với links & social media
- [ ] BS-53.6: Responsive mobile design

**Acceptance Criteria:**
- ✅ Landing page đẹp và responsive
- ✅ Navigation hoạt động

---

### BS-54: [FE-D] Design System & Common Components
**Subtasks cần thêm:**
- [ ] BS-54.1: Define color palette & typography
- [ ] BS-54.2: Tạo Button component (variants: primary, secondary, outline)
- [ ] BS-54.3: Tạo Input component với validation
- [ ] BS-54.4: Tạo Card component
- [ ] BS-54.5: Tạo Badge component (status colors)
- [ ] BS-54.6: Tạo Modal component
- [ ] BS-54.7: Tạo Table component với pagination
- [ ] BS-54.8: Tạo Toast/Notification component
- [ ] BS-54.9: Tạo Loading Spinner & Skeleton
- [ ] BS-54.10: Document components trong Storybook (optional)

**Acceptance Criteria:**
- ✅ Tất cả components reusable
- ✅ Consistent design

---

### BS-55: [FE-D] Axios Interceptor & Error Pages
**Subtasks cần thêm:**
- [ ] BS-55.1: Setup axios instance với baseURL
- [ ] BS-55.2: Tạo request interceptor (auto attach JWT)
- [ ] BS-55.3: Tạo response interceptor (handle 401, 403, 500)
- [ ] BS-55.4: Tạo 404 Not Found page
- [ ] BS-55.5: Tạo 403 Forbidden page
- [ ] BS-55.6: Tạo 500 Error page
- [ ] BS-55.7: Tạo Loading page

**Acceptance Criteria:**
- ✅ JWT tự động gửi với mọi request
- ✅ Error pages hiển thị đúng

---

### BS-81: Tạo tài liệu sơ bộ của dự án
**Subtasks cần thêm:**
- [ ] BS-81.1: Hoàn thiện SYSTEM_DESIGN.md
- [ ] BS-81.2: Hoàn thiện TASK_ASSIGNMENT.md
- [ ] BS-81.3: Tạo README.md cho Backend
- [ ] BS-81.4: Tạo README.md cho Frontend
- [ ] BS-81.5: Tạo API_DOCUMENTATION.md (overview)
- [ ] BS-81.6: Tạo DEPLOYMENT_GUIDE.md

**Acceptance Criteria:**
- ✅ Tài liệu đầy đủ và dễ hiểu

---

## 📋 Sprint 2 - Bổ Sung Subtasks

### BS-56: [BE-A] Listing CRUD API
**Subtasks cần thêm:**
- [ ] BS-56.1: Tạo ListingRequest/Response DTOs
- [ ] BS-56.2: Tạo BicycleRepository với custom queries
- [ ] BS-56.3: Implement ListingService.createListing() - Seller only
- [ ] BS-56.4: Implement ListingService.updateListing() - check ownership
- [ ] BS-56.5: Implement ListingService.deleteListing() - soft delete
- [ ] BS-56.6: Implement ListingService.getMyListings() - Seller
- [ ] BS-56.7: Tạo ListingController với @PreAuthorize
- [ ] BS-56.8: Validate listing data (price > 0, required fields)
- [ ] BS-56.9: Set default status = PENDING_APPROVAL
- [ ] BS-56.10: Test CRUD với Postman

**Endpoints:**
- `POST /api/seller/listings`
- `PUT /api/seller/listings/{id}`
- `DELETE /api/seller/listings/{id}`
- `GET /api/seller/listings`
- `GET /api/seller/listings/{id}/stats`

**Acceptance Criteria:**
- ✅ Seller có thể CRUD listings của mình
- ✅ Không thể sửa/xóa listing của người khác

---

### BS-57: [BE-A] Search & Detail API
**Subtasks cần thêm:**
- [ ] BS-57.1: Implement search by keyword (title, description)
- [ ] BS-57.2: Filter by brand (query param)
- [ ] BS-57.3: Filter by category (query param)
- [ ] BS-57.4: Filter by condition (NEW, LIKE_NEW, GOOD, FAIR, POOR)
- [ ] BS-57.5: Filter by price range (priceMin, priceMax)
- [ ] BS-57.6: Filter by frame size
- [ ] BS-57.7: Pagination (page, size) & sorting (sortBy, sortDir)
- [ ] BS-57.8: Implement getListingById() - increment viewCount
- [ ] BS-57.9: Include seller info & reputation trong response
- [ ] BS-57.10: Include inspection report nếu có

**Endpoints:**
- `GET /api/listings?keyword=&brand=&category=&condition=&priceMin=&priceMax=&frameSize=&page=0&size=20&sortBy=createdAt&sortDir=desc`
- `GET /api/listings/{id}`

**Acceptance Criteria:**
- ✅ Search & filter hoạt động chính xác
- ✅ Pagination & sorting đúng
- ✅ ViewCount tăng khi xem detail

---

### BS-58: [BE-A] Image Upload Service
**Subtasks cần thêm:**
- [ ] BS-58.1: Configure multipart file upload (max size 10MB)
- [ ] BS-58.2: Tạo ImageService.uploadImage()
- [ ] BS-58.3: Validate image format (jpg, png, webp)
- [ ] BS-58.4: Lưu file vào local storage hoặc cloud (Cloudinary/S3)
- [ ] BS-58.5: Tạo ListingImage entity record
- [ ] BS-58.6: Implement deleteImage()
- [ ] BS-58.7: Set isPrimary flag cho ảnh đầu tiên
- [ ] BS-58.8: Limit max 10 ảnh per listing

**Endpoints:**
- `POST /api/seller/listings/{id}/images`
- `DELETE /api/seller/listings/{id}/images/{imageId}`

**Acceptance Criteria:**
- ✅ Upload nhiều ảnh thành công
- ✅ URL được lưu vào DB

---

### BS-59: [BE-B] Order & Transaction API
**Subtasks cần thêm:**
- [ ] BS-59.1: Tạo OrderRequest/Response DTOs
- [ ] BS-59.2: Implement OrderService.createOrder() - Buyer only
- [ ] BS-59.3: Validate listing availability (status = ACTIVE)
- [ ] BS-59.4: Calculate deposit amount (10% hoặc custom)
- [ ] BS-59.5: Set order status = PENDING
- [ ] BS-59.6: Implement getBuyerOrders() - lịch sử đơn Buyer
- [ ] BS-59.7: Implement getSellerOrders() - đơn hàng Seller nhận
- [ ] BS-59.8: Implement updateOrderStatus() - Seller confirm/reject
- [ ] BS-59.9: Implement cancelOrder() - Buyer cancel
- [ ] BS-59.10: Send notification khi tạo/update order

**Endpoints:**
- `POST /api/buyer/orders`
- `GET /api/buyer/orders`
- `GET /api/buyer/orders/{id}`
- `PATCH /api/buyer/orders/{id}/cancel`
- `GET /api/seller/orders`
- `GET /api/seller/orders/{id}`
- `PATCH /api/seller/orders/{id}/confirm`
- `PATCH /api/seller/orders/{id}/reject`

**Acceptance Criteria:**
- ✅ Buyer tạo order thành công
- ✅ Seller confirm/reject được
- ✅ Status transitions đúng

---

### BS-60: [BE-B] Chat System API
**Subtasks cần thêm:**
- [ ] BS-60.1: Tạo ConversationRequest/Response DTOs
- [ ] BS-60.2: Implement createConversation() - check existing
- [ ] BS-60.3: Implement getMyConversations() - list hội thoại
- [ ] BS-60.4: Implement sendMessage()
- [ ] BS-60.5: Implement getMessages() với pagination
- [ ] BS-60.6: Implement markAsRead() - update lastReadAt
- [ ] BS-60.7: Include unread count trong conversation list

**Endpoints:**
- `POST /api/conversations`
- `GET /api/conversations`
- `GET /api/conversations/{id}/messages`
- `POST /api/conversations/{id}/messages`
- `PATCH /api/conversations/{id}/read`

**Acceptance Criteria:**
- ✅ Buyer-Seller chat được
- ✅ Messages hiển thị đúng thứ tự

---

### BS-61: [FE-C] Auth & Protected Routes UI
**Subtasks cần thêm:**
- [ ] BS-61.1: Tạo Login page với form validation
- [ ] BS-61.2: Tạo Register page với role selection
- [ ] BS-61.3: Implement AuthContext/AuthProvider
- [ ] BS-61.4: Store JWT token trong localStorage
- [ ] BS-61.5: Tạo ProtectedRoute component
- [ ] BS-61.6: Redirect to login nếu chưa auth
- [ ] BS-61.7: Decode JWT để lấy user info
- [ ] BS-61.8: Implement logout function
- [ ] BS-61.9: Show user info trong Header

**Acceptance Criteria:**
- ✅ Login/Register hoạt động
- ✅ Protected routes chặn đúng

---

### BS-62: [FE-C] Listing UI (Search & Filter)
**Subtasks cần thêm:**
- [ ] BS-62.1: Tạo ListingGrid component
- [ ] BS-62.2: Tạo ListingCard component
- [ ] BS-62.3: Tạo SearchBar component
- [ ] BS-62.4: Tạo FilterSidebar (brand, category, price, condition)
- [ ] BS-62.5: Implement pagination
- [ ] BS-62.6: Implement sorting dropdown
- [ ] BS-62.7: Connect to API GET /api/listings
- [ ] BS-62.8: Loading state & empty state
- [ ] BS-62.9: Responsive grid layout

**Acceptance Criteria:**
- ✅ Search & filter hoạt động
- ✅ Pagination đúng

---

### BS-63: [FE-C] Listing Detail & Wishlist UI
**Subtasks cần thêm:**
- [ ] BS-63.1: Tạo ListingDetail page
- [ ] BS-63.2: Image gallery với zoom
- [ ] BS-63.3: Specs table (frame size, wheel size, etc.)
- [ ] BS-63.4: Seller info card với reputation
- [ ] BS-63.5: Inspection badge nếu có
- [ ] BS-63.6: "Add to Wishlist" button
- [ ] BS-63.7: "Contact Seller" button
- [ ] BS-63.8: "Buy Now" button
- [ ] BS-63.9: Tạo Wishlist page
- [ ] BS-63.10: Connect to wishlist APIs

**Acceptance Criteria:**
- ✅ Detail page đầy đủ thông tin
- ✅ Wishlist hoạt động

---

### BS-64: [FE-D] Admin Overview & Listing Management
**Subtasks cần thêm:**
- [ ] BS-64.1: Tạo Admin Layout với sidebar
- [ ] BS-64.2: Dashboard với stats cards (mock data)
- [ ] BS-64.3: Pending listings table
- [ ] BS-64.4: Approve/Reject buttons với modal
- [ ] BS-64.5: View listing detail modal
- [ ] BS-64.6: Filter by status
- [ ] BS-64.7: Connect to admin APIs

**Acceptance Criteria:**
- ✅ Admin approve/reject được listings

---

### BS-65: [FE-D] User & Catalog Management (Admin)
**Subtasks cần thêm:**
- [ ] BS-65.1: User management table
- [ ] BS-65.2: Filter by role
- [ ] BS-65.3: Activate/Deactivate user button
- [ ] BS-65.4: View user detail modal
- [ ] BS-65.5: Category CRUD UI
- [ ] BS-65.6: Brand CRUD UI
- [ ] BS-65.7: Connect to admin APIs

**Acceptance Criteria:**
- ✅ Admin quản lý users & catalogs được

---

## 📋 Sprint 3 - Bổ Sung Subtasks

### BS-66: [BE-A] User Profile & Reputation
**Subtasks cần thêm:**
- [ ] BS-66.1: Implement getMyProfile() - GET /api/users/me
- [ ] BS-66.2: Implement updateProfile() - PUT /api/users/me
- [ ] BS-66.3: Implement getUserProfile() - GET /api/users/{id}/profile
- [ ] BS-66.4: Include reputation score & total sales
- [ ] BS-66.5: Include active listings count
- [ ] BS-66.6: Calculate reputation từ reviews

**Endpoints:**
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/{id}/profile`

---

### BS-67: [BE-A] Wishlist & Unit Tests
**Subtasks cần thêm:**
- [ ] BS-67.1: Implement addToWishlist()
- [ ] BS-67.2: Implement removeFromWishlist()
- [ ] BS-67.3: Implement getMyWishlist()
- [ ] BS-67.4: Write unit tests cho AuthService
- [ ] BS-67.5: Write unit tests cho ListingService
- [ ] BS-67.6: Write unit tests cho OrderService

**Endpoints:**
- `POST /api/wishlists/{listingId}`
- `DELETE /api/wishlists/{listingId}`
- `GET /api/wishlists`

---

### BS-68: [BE-B] Payment & Shipping Integration
**Subtasks cần thêm:**
- [ ] BS-68.1: Setup Stripe SDK
- [ ] BS-68.2: Implement createPaymentIntent()
- [ ] BS-68.3: Implement confirmPayment()
- [ ] BS-68.4: Implement getPaymentHistory()
- [ ] BS-68.5: Setup GHN SDK
- [ ] BS-68.6: Implement calculateShippingFee()
- [ ] BS-68.7: Implement createShippingOrder()
- [ ] BS-68.8: Implement getShippingStatus()

**Endpoints:**
- `POST /api/payments/create-intent`
- `POST /api/payments/confirm`
- `GET /api/payments/history`
- `POST /api/shipping/calculate-fee`
- `POST /api/shipping/create-order`
- `GET /api/shipping/{orderCode}/status`

---

### BS-69: [BE-B] AI Chatbot & Reviews
**Subtasks cần thêm:**
- [ ] BS-69.1: Setup Gemini SDK
- [ ] BS-69.2: Implement askChatbot() với context
- [ ] BS-69.3: Implement createReview() - v
alidate order completion
- [ ] BS-69.4: Calculate & update seller reputation
- [ ] BS-69.5: Implement getSellerReviews()
- [ ] BS-69.6: Implement getListingReviews()

**Endpoints:**
- `POST /api/chatbot/ask`
- `POST /api/reviews`
- `GET /api/reviews/seller/{sellerId}`
- `GET /api/reviews/listing/{listingId}`

---

### BS-70: [BE-B] Inspection & Dispute System
**Subtasks cần thêm:**
- [ ] BS-70.1: Implement requestInspection() - Seller
- [ ] BS-70.2: Implement getInspectorInspections() - Inspector
- [ ] BS-70.3: Implement submitInspectionReport() - Inspector
- [ ] BS-70.4: Calculate overall score từ các hạng mục
- [ ] BS-70.5: Implement createDispute() - Buyer/Seller
- [ ] BS-70.6: Implement getAdminDisputes() - Admin
- [ ] BS-70.7: Implement resolveDispute() - Admin

**Endpoints:**
- `POST /api/inspections/request`
- `GET /api/inspector/inspections`
- `PUT /api/inspector/inspections/{id}/report`
- `GET /api/inspections/{id}`
- `POST /api/disputes`
- `GET /api/admin/disputes`
- `GET /api/disputes/{id}`
- `PATCH /api/admin/disputes/{id}/resolve`

---

### BS-71: [FE-C] Seller Dashboard & Posting Form
**Subtasks cần thêm:**
- [ ] BS-71.1: Tạo Seller Dashboard layout
- [ ] BS-71.2: My Listings table với actions
- [ ] BS-71.3: Create Listing form - Step 1: Basic info
- [ ] BS-71.4: Create Listing form - Step 2: Specs
- [ ] BS-71.5: Create Listing form - Step 3: Price & Location
- [ ] BS-71.6: Create Listing form - Step 4: Upload images
- [ ] BS-71.7: Edit listing form
- [ ] BS-71.8: Delete confirmation modal
- [ ] BS-71.9: Connect to seller APIs

**Acceptance Criteria:**
- ✅ Seller tạo/sửa/xóa listings được

---

### BS-72: [FE-C] Checkout & Order History UI
**Subtasks cần thêm:**
- [ ] BS-72.1: Checkout page với form địa chỉ
- [ ] BS-72.2: Shipping fee calculator
- [ ] BS-72.3: Payment method selection
- [ ] BS-72.4: Order summary
- [ ] BS-72.5: Buyer order history table
- [ ] BS-72.6: Order detail page với tracking
- [ ] BS-72.7: Cancel order button
- [ ] BS-72.8: Seller order management table
- [ ] BS-72.9: Confirm/Reject order buttons

**Acceptance Criteria:**
- ✅ Checkout flow hoàn chỉnh
- ✅ Order tracking hoạt động

---

### BS-73: [FE-C] Chat / Inbox UI
**Subtasks cần thêm:**
- [ ] BS-73.1: Conversation list sidebar
- [ ] BS-73.2: Chat window với messages
- [ ] BS-73.3: Message input với send button
- [ ] BS-73.4: Unread badge
- [ ] BS-73.5: Auto-scroll to bottom
- [ ] BS-73.6: Polling for new messages (5s interval)
- [ ] BS-73.7: Connect to chat APIs

**Acceptance Criteria:**
- ✅ Chat real-time (polling)

---

### BS-74: [FE-D] Inspector Dashboard
**Subtasks cần thêm:**
- [ ] BS-74.1: Inspector dashboard layout
- [ ] BS-74.2: Pending inspections table
- [ ] BS-74.3: Inspection form với scoring
- [ ] BS-74.4: PDF upload
- [ ] BS-74.5: Submit report button
- [ ] BS-74.6: View inspection history

**Acceptance Criteria:**
- ✅ Inspector submit reports được

---

### BS-75: [FE-D] Dispute & Notification UI
**Subtasks cần thêm:**
- [ ] BS-75.1: Create dispute form
- [ ] BS-75.2: Admin dispute management table
- [ ] BS-75.3: Dispute detail modal
- [ ] BS-75.4: Resolve dispute form
- [ ] BS-75.5: Notification bell icon
- [ ] BS-75.6: Notification dropdown
- [ ] BS-75.7: Mark as read functionality
- [ ] BS-75.8: Notification list page

**Acceptance Criteria:**
- ✅ Dispute system hoạt động
- ✅ Notifications real-time

---

## 📋 Sprint 4 - Bổ Sung Subtasks

### BS-76: [BE-A] Code Review & Integration
**Subtasks cần thêm:**
- [ ] BS-76.1: Review code của BE-B
- [ ] BS-76.2: Fix merge conflicts
- [ ] BS-76.3: Refactor duplicate code
- [ ] BS-76.4: Optimize database queries
- [ ] BS-76.5: Add missing validations
- [ ] BS-76.6: Fix security issues
- [ ] BS-76.7: Integration testing

---

### BS-77: [BE-B] Reporting & Admin Stats
**Subtasks cần thêm:**
- [ ] BS-77.1: Implement getAdminStats() - overview
- [ ] BS-77.2: Implement getRevenueStats() - by month
- [ ] BS-77.3: Implement getListingStats() - by week
- [ ] BS-77.4: Implement getServiceFees()
- [ ] BS-77.5: Implement getAdminInspections()
- [ ] BS-77.6: Implement getSystemNotifications()

**Endpoints:**
- `GET /api/admin/stats`
- `GET /api/admin/stats/revenue`
- `GET /api/admin/stats/listings`
- `GET /api/admin/service-fees`
- `GET /api/admin/inspections`
- `GET /api/admin/notifications/system`

---

### BS-78: [FE-C] Final UI/UX & AI UI
**Subtasks cần thêm:**
- [ ] BS-78.1: Review form UI
- [ ] BS-78.2: Profile page UI
- [ ] BS-78.3: Seller profile view
- [ ] BS-78.4: Stripe payment form
- [ ] BS-78.5: Payment confirmation page
- [ ] BS-78.6: Chatbot floating button
- [ ] BS-78.7: Chatbot bubble UI
- [ ] BS-78.8: Connect to Gemini API
- [ ] BS-78.9: Polish animations & transitions
- [ ] BS-78.10: Fix responsive issues

---

### BS-79: [FE-D] Advanced Reports & Dark Mode
**Subtasks cần thêm:**
- [ ] BS-79.1: Revenue chart (recharts)
- [ ] BS-79.2: Listings chart (recharts)
- [ ] BS-79.3: User growth chart
- [ ] BS-79.4: Export reports to CSV
- [ ] BS-79.5: Implement dark mode toggle
- [ ] BS-79.6: Dark mode styles cho tất cả components
- [ ] BS-79.7: Save theme preference
- [ ] BS-79.8: GHN tracking timeline UI

---

### BS-80: Hoàn thiện tài liệu chi tiết
**Subtasks cần thêm:**
- [ ] BS-80.1: Update API_DOCUMENTATION.md với tất cả endpoints
- [ ] BS-80.2: Update README.md với setup instructions
- [ ] BS-80.3: Tạo USER_GUIDE.md
- [ ] BS-80.4: Tạo DEPLOYMENT_GUIDE.md
- [ ] BS-80.5: Tạo TESTING_GUIDE.md
- [ ] BS-80.6: Record demo video
- [ ] BS-80.7: Prepare presentation slides

---

## 🎯 Tổng Kết Bổ Sung

### Số lượng Subtasks đã thêm:
- **Sprint 1**: 56 subtasks
- **Sprint 2**: 78 subtasks
- **Sprint 3**: 62 subtasks
- **Sprint 4**: 38 subtasks
- **Tổng**: **234 subtasks**

### Cách Import vào Jira:

1. **Mở từng Story** (BS-48, BS-49, etc.)
2. **Click "Add Subtask"**
3. **Copy-paste từng subtask** từ file này
4. **Set Assignee** cho từng subtask
5. **Set Story Points** (1-2 points per subtask)

### Ví dụ Import BS-49:
```
Story: BS-49 [BE-A] Spring Security & Auth Login/Register
├─ Subtask: BS-49.1 Tạo DTOs (LoginRequest, RegisterRequest, AuthResponse)
├─ Subtask: BS-49.2 Implement JwtUtil class
├─ Subtask: BS-49.3 Tạo UserDetailsImpl và UserDetailsServiceImpl
├─ Subtask: BS-49.4 Tạo JwtAuthenticationFilter
├─ Subtask: BS-49.5 Configure SecurityConfig
├─ Subtask: BS-49.6 Implement AuthService
├─ Subtask: BS-49.7 Tạo AuthController
├─ Subtask: BS-49.8 Tạo UserRepository
├─ Subtask: BS-49.9 Test API register
└─ Subtask: BS-49.10 Test API login
```

### Priority Suggestions:

**High Priority (Must Have):**
- BS-48, BS-49, BS-50 (Sprint 1 Backend Core)
- BS-56, BS-57, BS-59 (Sprint 2 Core Features)
- BS-68, BS-70 (Sprint 3 Integrations)

**Medium Priority (Should Have):**
- BS-52, BS-53, BS-61, BS-62 (Frontend Core)
- BS-60, BS-73 (Chat System)
- BS-77 (Admin Stats)

**Low Priority (Nice to Have):**
- BS-69 (AI Chatbot)
- BS-79 (Dark Mode)
- BS-75 (Notifications UI)

---

## 📊 Estimation Guide

**Subtask Complexity:**
- **1 point**: Simple task (< 2 hours) - Config, simple CRUD
- **2 points**: Medium task (2-4 hours) - Business logic, validation
- **3 points**: Complex task (4-8 hours) - Integration, complex logic
- **5 points**: Very complex (1 day) - Major feature, multiple dependencies

**Story Estimation:**
- Sum of subtask points
- Add 20% buffer for testing & bug fixes

---

## 🔄 Daily Workflow

1. **Morning Standup**: Update subtask status
2. **Work on Subtasks**: Move to "In Progress"
3. **Code Review**: Create PR when subtask done
4. **Testing**: QA test completed subtasks
5. **Evening**: Update Jira board

---

## ✅ Definition of Done (Per Subtask)

- [ ] Code implemented
- [ ] Self-tested locally
- [ ] Code reviewed by peer
- [ ] Unit tests written (if applicable)
- [ ] API documented in Swagger (if API)
- [ ] No console errors
- [ ] Committed to feature branch
- [ ] PR created & merged

---

## 📌 Notes

- **Subtasks có thể parallel**: Nhiều người làm cùng lúc các subtasks độc lập
- **Dependencies**: Một số subtasks phải chờ subtasks khác (mark dependencies trong Jira)
- **Blockers**: Report ngay nếu bị block
- **Scope creep**: Tránh thêm features ngoài scope, tạo story mới nếu cần
