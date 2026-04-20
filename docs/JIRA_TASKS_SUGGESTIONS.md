# 📋 Gợi Ý Tasks Cho Jira Scrum Board

## 🎯 Cách Tổ Chức

### Epic Structure
```
Epic 1: Authentication & Authorization
Epic 2: Bicycle Listing Management
Epic 3: Order & Payment System
Epic 4: Chat & Communication
Epic 5: Inspection System
Epic 6: Admin Dashboard
Epic 7: Frontend UI/UX
Epic 8: Third-party Integrations
```

---

## 📝 Sprint 1 - Week 1 (Setup & Authentication)

### Epic 1: Authentication & Authorization

**Story 1.1: Setup Backend Infrastructure**
- Task: Tạo Spring Boot project với dependencies
- Task: Cấu hình Neon PostgreSQL connection
- Task: Setup JPA entities (16 models)
- Task: Cấu hình application.properties
- Story Points: 5

**Story 1.2: Implement JWT Authentication**
- Task: Tạo JwtUtil class
- Task: Tạo UserDetailsService implementation
- Task: Tạo JwtAuthenticationFilter
- Task: Cấu hình Spring Security
- Story Points: 8

**Story 1.3: User Registration API**
- Task: Tạo RegisterRequest DTO
- Task: Tạo AuthService.register()
- Task: Tạo AuthController.register()
- Task: Validate email & username uniqueness
- Task: Hash password với BCrypt
- Story Points: 5

**Story 1.4: User Login API**
- Task: Tạo LoginRequest DTO
- Task: Tạo AuthService.login()
- Task: Tạo AuthController.login()
- Task: Generate JWT token
- Task: Return AuthResponse với token
- Story Points: 3

**Story 1.5: Role-Based Authorization**
- Task: Implement @PreAuthorize annotations
- Task: Configure role-based endpoints
- Task: Test authorization cho 4 roles
- Story Points: 5

**Story 1.6: API Documentation**
- Task: Setup Swagger/OpenAPI
- Task: Add @Operation annotations
- Task: Configure SecurityScheme cho JWT
- Task: Test Swagger UI
- Story Points: 3

**Story 1.7: CORS Configuration**
- Task: Configure CORS cho localhost:3000
- Task: Configure CORS cho localhost:5173
- Task: Test CORS từ frontend
- Story Points: 2

---

## 📝 Sprint 2 - Week 2 (Listings & Orders)

### Epic 2: Bicycle Listing Management

**Story 2.1: Create Listing API (Seller)**
- Task: Tạo ListingRequest DTO
- Task: Tạo ListingService.createListing()
- Task: Tạo ListingController.create()
- Task: Validate listing data
- Task: Set status = PENDING_APPROVAL
- Story Points: 8

**Story 2.2: Upload Listing Images**
- Task: Configure file upload (multipart)
- Task: Tạo ImageService.uploadImage()
- Task: Lưu URL vào listing_images table
- Task: Validate image format & size
- Story Points: 5

**Story 2.3: Update/Delete Listing (Seller)**
- Task: Tạo ListingService.updateListing()
- Task: Tạo ListingService.deleteListing()
- Task: Check ownership trước khi update/delete
- Task: Soft delete (set status = INACTIVE)
- Story Points: 5

**Story 2.4: Approve/Reject Listing (Admin)**
- Task: Tạo AdminListingController.approveListing()
- Task: Tạo AdminListingController.rejectListing()
- Task: Update status = ACTIVE/REJECTED
- Task: Gửi notification cho Seller
- Story Points: 5

**Story 2.5: Search & Filter Listings**
- Task: Implement search by keyword
- Task: Filter by brand, category, condition
- Task: Filter by price range
- Task: Filter by frame size
- Task: Pagination & sorting
- Story Points: 8

**Story 2.6: View Listing Detail**
- Task: Tạo ListingService.getListingById()
- Task: Increment viewCount
- Task: Include seller info & reputation
- Task: Include inspection report (nếu có)
- Story Points: 5

**Story 2.7: Seller Listings Management**
- Task: GET /api/seller/listings (danh sách tin của seller)
- Task: GET /api/seller/listings/{id}/stats (views, likes)
- Task: Filter by status
- Story Points: 3

### Epic 3: Order & Payment System

**Story 3.1: Create Order (Buyer)**
- Task: Tạo OrderRequest DTO
- Task: Tạo OrderService.createOrder()
- Task: Validate listing availability
- Task: Calculate deposit amount
- Task: Set status = PENDING
- Story Points: 8

**Story 3.2: Order Management (Buyer)**
- Task: GET /api/buyer/orders (lịch sử đơn)
- Task: GET /api/buyer/orders/{id} (chi tiết)
- Task: PATCH /api/buyer/orders/{id}/cancel
- Story Points: 5

**Story 3.3: Order Management (Seller)**
- Task: GET /api/seller/orders (đơn hàng nhận được)
- Task: GET /api/seller/orders/{id} (chi tiết)
- Task: PATCH /api/seller/orders/{id}/confirm
- Task: PATCH /api/seller/orders/{id}/reject
- Story Points: 5

**Story 3.4: Update Order Status**
- Task: Implement status transitions
- Task: Validate status changes
- Task: Send notifications on status change
- Story Points: 5

### Epic 4: Chat & Communication

**Story 4.1: Create Conversation**
- Task: POST /api/conversations (Buyer-Seller)
- Task: Check existing conversation
- Task: Create new if not exists
- Story Points: 5

**Story 4.2: Send/Receive Messages**
- Task: POST /api/conversations/{id}/messages
- Task: GET /api/conversations/{id}/messages
- Task: Pagination cho messages
- Story Points: 5

**Story 4.3: Mark Messages as Read**
- Task: PATCH /api/conversations/{id}/read
- Task: Update lastReadAt timestamp
- Story Points: 2

---

## 📝 Sprint 3 - Week 3 (Integrations & Advanced Features)

### Epic 8: Third-party Integrations

**Story 8.1: Stripe Payment Integration**
- Task: Setup Stripe SDK
- Task: POST /api/payments/create-intent
- Task: POST /api/payments/confirm
- Task: GET /api/payments/history
- Task: Handle webhooks
- Story Points: 13

**Story 8.2: GHN Shipping Integration**
- Task: Setup GHN SDK
- Task: POST /api/shipping/calculate-fee
- Task: POST /api/shipping/create-order
- Task: GET /api/shipping/{orderCode}/status
- Story Points: 8

**Story 8.3: Gemini Chatbot Integration**
- Task: Setup Gemini API
- Task: POST /api/chatbot/ask
- Task: Context-aware responses
- Story Points: 5

### Epic 5: Inspection System

**Story 5.1: Request Inspection (Seller)**
- Task: POST /api/inspections/request
- Task: Set status = REQUESTED
- Task: Notify inspectors
- Story Points: 5

**Story 5.2: Inspector Dashboard**
- Task: GET /api/inspector/inspections (pending requests)
- Task: GET /api/inspections/{id} (chi tiết)
- Story Points: 3

**Story 5.3: Submit Inspection Report**
- Task: PUT /api/inspector/inspections/{id}/report
- Task: Upload PDF report
- Task: Calculate overall score
- Task: Update listing inspection status
- Story Points: 8

**Story 5.4: Admin View Inspections**
- Task: GET /api/admin/inspections
- Task: Filter by status
- Story Points: 2

### Epic 2: Reviews & Ratings

**Story 2.8: Submit Review (Buyer)**
- Task: POST /api/reviews
- Task: Validate order completion
- Task: Calculate seller reputation score
- Task: Update user.reputationScore
- Story Points: 8

**Story 2.9: View Reviews**
- Task: GET /api/reviews/seller/{sellerId}
- Task: GET /api/reviews/listing/{listingId}
- Task: Pagination & sorting
- Story Points: 3

### Epic 2: Wishlist

**Story 2.10: Wishlist Management**
- Task: POST /api/wishlists/{listingId} (add)
- Task: DELETE /api/wishlists/{listingId} (remove)
- Task: GET /api/wishlists (view all)
- Story Points: 5

### Epic 3: Dispute System

**Story 3.5: Create Dispute**
- Task: POST /api/disputes
- Task: Attach order & evidence
- Task: Notify admin
- Story Points: 5

**Story 3.6: Admin Resolve Dispute**
- Task: GET /api/admin/disputes
- Task: GET /api/disputes/{id}
- Task: PATCH /api/admin/disputes/{id}/resolve
- Task: Update order status
- Story Points: 8

### Epic 6: Notification System

**Story 6.1: Auto Notifications**
- Task: Notification on new order
- Task: Notification on message
- Task: Notification on listing approval
- Task: Notification on review
- Story Points: 8

**Story 6.2: Notification API**
- Task: GET /api/notifications
- Task: PATCH /api/notifications/{id}/read
- Task: PATCH /api/notifications/read-all
- Story Points: 3

---

## 📝 Sprint 4 - Week 4 (Admin & Analytics)

### Epic 6: Admin Dashboard

**Story 6.3: User Management**
- Task: GET /api/admin/users (list all)
- Task: GET /api/admin/users/{id} (detail)
- Task: PATCH /api/admin/users/{id}/activate
- Task: DELETE /api/admin/users/{id}
- Story Points: 5

**Story 6.4: Category & Brand Management**
- Task: CRUD /api/admin/categories
- Task: CRUD /api/admin/brands
- Story Points: 5

**Story 6.5: Service Fee Management**
- Task: GET /api/admin/service-fees
- Task: Calculate total revenue
- Story Points: 3

**Story 6.6: Statistics Dashboard**
- Task: GET /api/admin/stats (overview)
- Task: GET /api/admin/stats/revenue (by month)
- Task: GET /api/admin/stats/listings (by week)
- Task: Charts data for frontend
- Story Points: 8

**Story 6.7: System Notifications**
- Task: GET /api/admin/notifications/system
- Task: View critical alerts
- Story Points: 2

### Epic 7: Frontend UI/UX

**Story 7.1: Landing Page**
- Task: Hero section với CTA
- Task: Featured listings carousel
- Task: Search bar
- Task: Footer với links
- Story Points: 8

**Story 7.2: Auth Pages**
- Task: Login page
- Task: Register page (role selection)
- Task: Protected routes
- Task: JWT token management
- Story Points: 8

**Story 7.3: Listing Pages**
- Task: Listing grid với filters
- Task: Listing detail page
- Task: Image gallery
- Task: Seller info card
- Story Points: 13

**Story 7.4: Seller Dashboard**
- Task: Create listing form (multi-step)
- Task: My listings table
- Task: Edit/delete actions
- Task: Order management
- Story Points: 13

**Story 7.5: Buyer Dashboard**
- Task: Wishlist page
- Task: Order history
- Task: Order detail & tracking
- Task: Review form
- Story Points: 13

**Story 7.6: Chat Interface**
- Task: Conversation list
- Task: Chat window
- Task: Real-time messages (polling)
- Story Points: 13

**Story 7.7: Admin Panel**
- Task: Dashboard với stats
- Task: User management table
- Task: Listing approval queue
- Task: Dispute resolution
- Task: Charts & analytics
- Story Points: 21

**Story 7.8: Inspector Panel**
- Task: Inspection requests list
- Task: Inspection form
- Task: PDF upload
- Story Points: 8

**Story 7.9: Payment UI**
- Task: Stripe Elements integration
- Task: Payment form
- Task: Payment confirmation
- Story Points: 8

**Story 7.10: Chatbot Widget**
- Task: Floating chat button
- Task: Chat bubble UI
- Task: Gemini integration
- Story Points: 5

---

## 📊 Story Points Summary

| Sprint | Total Story Points | Focus Area |
|--------|-------------------|------------|
| Sprint 1 | 31 | Auth & Setup |
| Sprint 2 | 62 | Listings & Orders |
| Sprint 3 | 71 | Integrations & Advanced |
| Sprint 4 | 103 | Admin & Frontend |
| **Total** | **267** | **Full Project** |

---

## 🏷️ Labels Gợi Ý

- `backend` - Backend tasks
- `frontend` - Frontend tasks
- `api` - API development
- `ui` - UI/UX design
- `integration` - Third-party integrations
- `bug` - Bug fixes
- `test` - Testing tasks
- `documentation` - Documentation
- `high-priority` - Critical tasks
- `tech-debt` - Technical debt

---

## 👥 Assignment Gợi Ý

- **Thành viên A**: Epic 1, Epic 2 (Stories 2.1-2.7), Epic 6 (Stories 6.3-6.7)
- **Thành viên B**: Epic 3, Epic 4, Epic 5, Epic 8
- **Thành viên C**: Epic 7 (Stories 7.1-7.6, 7.9-7.10)
- **Thành viên D**: Epic 7 (Stories 7.7-7.8), Design System

---

## 📌 Notes

1. Mỗi Story nên có **Definition of Done**:
   - Code complete & reviewed
   - Unit tests passed
   - API documented in Swagger
   - Tested manually
   - Merged to dev branch

2. **Velocity tracking**: Sau Sprint 1, điều chỉnh story points dựa trên velocity thực tế

3. **Daily Standup**: Mỗi ngày update task status trong Jira

4. **Sprint Review**: Cuối mỗi sprint demo các tính năng hoàn thành

5. **Retrospective**: Thảo luận cải tiến cho sprint tiếp theo
