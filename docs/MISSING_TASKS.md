# 🔴 Tasks Còn Thiếu Cho 4 Roles

## Sprint 2 - Cần bổ sung:

### BS-82: [BE-B] Review & Rating System
**Mô tả:** API cho Buyer đánh giá Seller sau khi hoàn thành đơn hàng
**Assignee:** Thành viên B
**Endpoints:**
- `POST /api/reviews` - Buyer tạo review
- `GET /api/reviews/seller/{sellerId}` - Xem reviews của seller
- `GET /api/reviews/listing/{listingId}` - Xem reviews của listing
**Chức năng:**
- Validate order đã COMPLETED
- Tính toán và cập nhật reputationScore của Seller
- Chỉ cho phép review 1 lần per order

---

## Sprint 3 - Cần bổ sung:

### BS-83: [BE-B] Inspection Request API
**Mô tả:** API cho Seller yêu cầu kiểm định xe
**Assignee:** Thành viên B
**Endpoints:**
- `POST /api/seller/inspections/request` - Seller yêu cầu kiểm định
- `GET /api/seller/inspections` - Xem lịch sử kiểm định của mình
**Chức năng:**
- Seller chọn listing cần kiểm định
- Tạo inspection request với status = REQUESTED
- Notify inspectors

---

### BS-84: [FE-C] Review & Rating UI
**Mô tả:** Giao diện cho Buyer đánh giá Seller
**Assignee:** Thành viên C
**Màn hình:**
- Review form (rating stars, comment)
- Review list trên seller profile
- Review badge trên listing card
**Chức năng:**
- Hiển thị form review sau khi order COMPLETED
- Show rating stars và comments
- Display reputation score

---

### BS-85: [FE-C] Payment Integration UI
**Mô tả:** Tích hợp Stripe payment form
**Assignee:** Thành viên C
**Màn hình:**
- Stripe Elements payment form
- Payment confirmation page
- Payment history page
**Chức năng:**
- Nhập thông tin thẻ (test mode)
- Xử lý payment intent
- Hiển thị trạng thái thanh toán

---

## Tổng kết:

**Cần thêm 4 tasks:**
1. BS-82: Review & Rating System (Backend)
2. BS-83: Inspection Request API (Backend)
3. BS-84: Review & Rating UI (Frontend)
4. BS-85: Payment Integration UI (Frontend)

**Phân bổ:**
- Thành viên B: +2 tasks (BS-82, BS-83)
- Thành viên C: +2 tasks (BS-84, BS-85)

**Sau khi thêm 4 tasks này → ĐỦ cho 4 roles**
