# Bicycle Selling Backend

Spring Boot REST API for the Bicycle Selling marketplace.

## Tech Stack
- Java 17+
- Spring Boot
- Spring Security + JWT
- Spring Data JPA + Hibernate
- PostgreSQL
- Maven
- Swagger / OpenAPI

## Main Modules
- Authentication
- Listings
- Orders
- Payments
- Shipping
- Reviews
- Chat
- User profile
- Wishlist

## Run Locally
1. Make sure PostgreSQL is running and the database credentials are set in `src/main/resources/application.properties`.
2. Install dependencies and start the app:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

3. Open Swagger UI to inspect the API contracts.

## Key API Groups
- `/api/auth`
- `/api/listings`
- `/api/seller/listings`
- `/api/orders`
- `/api/payments`
- `/api/shipping`
- `/api/reviews`
- `/api/chat`
- `/api/conservation`
- `/api/users`

## Notes
- Public listing search and detail endpoints do not require auth.
- Seller, buyer, and admin operations are protected with JWT.
- Stripe, GHN, and Gemini integrations are configured for sandbox or fallback flows in the current implementation.
