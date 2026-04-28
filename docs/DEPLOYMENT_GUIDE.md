# Deployment Guide

## 1. Prerequisites
- Java 17+
- Maven Wrapper or Maven
- Node.js 18+
- PostgreSQL database
- Stripe sandbox keys
- GHN sandbox credentials
- Optional Gemini API key

## 2. Backend Setup

### Configure environment
Update `BACKEND/src/main/resources/application.properties` with:
- PostgreSQL connection details
- JWT secret
- Stripe config
- GHN config
- Upload/storage config if applicable

### Run locally
```bash
cd BACKEND
./mvnw spring-boot:run
```

Windows:
```bash
cd BACKEND
mvnw.cmd spring-boot:run
```

### Verify
- Swagger UI loads
- `/api/listings` responds
- Login/register works

## 3. Frontend Setup

### Install and run
```bash
cd frontend
npm install
npm start
```

### Build for production
```bash
npm run build
```

## 4. Recommended Deployment Split

### Backend
- Deploy to Render, Railway, Heroku, or a VM/container host
- Point it to Neon PostgreSQL or another managed PostgreSQL instance
- Use environment variables instead of hardcoding secrets

### Frontend
- Deploy to Vercel, Netlify, or a static host
- Configure the frontend base API URL to match the deployed backend

## 5. Environment Variables to Prepare
Backend examples:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `STRIPE_API_KEY`
- `STRIPE_ENDPOINT_SECRET`
- `GHN_SHOP_ID`

Frontend examples:
- `REACT_APP_API_BASE_URL`

## 6. Post-deployment Checks
- Login/register flow
- Listing search and detail pages
- Seller dashboard and posting form
- Checkout, payment confirmation, and order history
- Reviews on completed orders
- Chat conversation flow
- Profile pages

## 7. Troubleshooting
- If the backend fails at startup, check missing placeholders in `application.properties`.
- If port `8080` is already in use, stop the existing process or change the server port.
- If the frontend cannot call the API, verify CORS and the configured base URL.
