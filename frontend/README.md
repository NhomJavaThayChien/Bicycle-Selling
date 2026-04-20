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
