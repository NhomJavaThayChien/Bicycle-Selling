# Bicycle Selling Frontend

React frontend for the Bicycle Selling marketplace.

## Tech Stack
- React
- React Router
- Axios
- Local storage for auth session
- Responsive CSS with custom UI shell

## Main Features
- Landing page and bike listing pages
- Bike detail page with wishlist and seller contact flow
- Buyer checkout flow with shipping fee calculation
- Buyer order history with review form
- Seller dashboard and posting form
- Buyer and seller chat UI
- Public seller profile page
- Personal profile page
- Payment success confirmation page
- Floating chatbot UI with Gemini fallback

## Scripts

### `npm start`
Runs the app in development mode.

### `npm test`
Runs the test watcher.

### `npm run build`
Builds the app for production.

## Environment
Set the API base URL in the frontend API client if the backend is not running on the default local host.

## Local Run
```bash
npm install
npm start
```

## Notes
- JWT is attached automatically to authenticated API requests.
- Some UI flows include graceful fallback behavior when a backend endpoint is not available yet.


./mvnw spring-boot:run

Vai trò	Username	Email	Mục đích kiểm tra
Quản trị viên	admin	admin@bicycleshop.com	Quản lý hệ thống, duyệt tin, quản lý người dùng.
Người bán	seller_thanh	thanh@gmail.com	Đăng tin bán xe, quản lý danh sách xe của mình.
Người bán	seller_lan	lan@gmail.com	Tương tự (đã có sẵn một số tin đăng mẫu).
Người mua	buyer_minh	minh@gmail.com	Xem xe, thêm vào wishlist, đặt hàng.
Người mua	buyer_hoa	hoa@gmail.com	Tương tự người mua Minh.
Kiểm định viên	inspector_nam	nam@bicycle-inspect.com	Thực hiện kiểm định các xe đang chờ duyệt.
