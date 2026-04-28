# API Documentation Overview

This document summarizes the backend API contracts used by the current Bicycle Selling application.

## 1. Authentication

### `POST /api/auth/register`
Register a new account.

### `POST /api/auth/login`
Authenticate with username/email and password.

## 2. User Profile

### `GET /api/users/{userId}/profile`
Public seller/buyer profile.

### `GET /api/me`
Authenticated user's private profile.

### `PUT /api/me/profile`
Update authenticated user's profile.

### `POST /api/me/avatar`
Upload avatar image.

## 3. Listings

### `GET /api/listings`
Public listing search with filters.

Query params:
- `keyword`
- `brandId`
- `categoryId`
- `condition`
- `priceMin`
- `priceMax`
- `frameSize`
- `page`
- `size`
- `sortBy`
- `sortDir`

### `GET /api/listings/{id}`
Listing detail and view count increment.

### `POST /api/seller/listings`
Create listing.

### `PUT /api/seller/listings/{id}`
Update listing.

### `DELETE /api/seller/listings/{id}`
Delete listing.

### `GET /api/seller/listings`
List seller-owned listings.

### `GET /api/seller/listings/{id}/stats`
Return listing view stats.

### `POST /api/seller/listings/{id}/images`
Upload images for a listing.

### `DELETE /api/seller/listings/{listingId}/images/{imageId}`
Delete a listing image.

### `PATCH /api/admin/listings/{id}/approve`
Approve listing.

### `PATCH /api/admin/listings/{id}/reject`
Reject listing.

## 4. Orders

### `POST /api/orders`
Create order.

### `GET /api/orders/{orderId}`
Get order detail.

### `PUT /api/orders/{orderId}/cancel`
Cancel order.

### `PUT /api/orders/{orderId}/confirm`
Confirm order.

### `GET /api/orders/buyer`
List buyer orders.

### `GET /api/orders/seller`
List seller orders.

### `PUT /api/orders/{orderId}/complete`
Mark order completed.

### `PUT /api/orders/seller/{orderId}/reject`
Reject seller order.

## 5. Payments

### `POST /api/payments/cash`
Create cash payment.

### `POST /api/payments/deposit`
Create deposit payment and Stripe checkout session.

### `POST /api/payments/full-paid`
Create full payment and Stripe checkout session.

### `GET /api/payments`
List payments for the authenticated user.

## 6. Shipping

### `GET /api/shipping/provinces`
Get GHN provinces.

### `GET /api/shipping/districts/{provinceId}`
Get districts for a province.

### `GET /api/shipping/wards/{districtId}`
Get wards for a district.

### `GET /api/shipping/fee`
Calculate shipping fee.

Required query params:
- `listingId`
- `fromDistrictId`
- `fromWardCode`
- `toDistrictId`
- `toWardCode`

### `POST /api/shipping/create`
Create a shipping order.

## 7. Reviews

### `POST /api/reviews/orders/{orderId}`
Create a review for a completed order.

### `GET /api/reviews/sellers/{sellerId}`
Get reviews by seller.

Query params:
- `page`
- `size`

## 8. Chat

### `POST /api/conservation?otherUserId={id}&listingId={id}`
Create or get a conversation.

### `POST /api/chat/messages`
Send a message.

### `GET /api/chat/conversations/{conversationId}/messages`
Fetch conversation messages.

### `POST /api/chat/conversations/{conversationId}/read`
Mark messages as read.

### `DELETE /api/chat/messages/{messageId}`
Delete one message.

### `DELETE /api/chat/messages/user/{userId}`
Delete all messages from a user.

## 9. Typical Response Shapes

### Listing response
```json
{
  "id": 1,
  "title": "Road Bike",
  "price": 12000000,
  "status": "APPROVED",
  "sellerId": 5,
  "sellerUsername": "seller01",
  "sellerFullName": "Nguyen Van A",
  "sellerReputation": 4.8,
  "primaryImageUrl": "https://...",
  "imageUrls": ["https://..."]
}
```

### Review response
```json
{
  "id": 10,
  "rating": 5,
  "comment": "Great seller",
  "sellerId": 5,
  "reviewer": {
    "id": 2,
    "username": "buyer01",
    "avatarUrl": "https://..."
  }
}
```

### Payment response
```json
{
  "message": "Payment created successfully"
}
```

## 10. Implementation Notes
- JWT is required for buyer, seller, and admin actions.
- Public listing search and listing detail are available without login.
- Chat inbox listing is not exposed as a dedicated backend endpoint in the current implementation, so the frontend caches conversation metadata locally.
- Stripe checkout is supported through payment endpoints and a frontend confirmation screen.
