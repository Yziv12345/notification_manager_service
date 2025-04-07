# 📬 Notification System

This project simulates a **Notification Management System** designed for sending notifications to users via different channels (e.g., Email, SMS), while handling **rate limiting**, **error simulation**, **user preferences**, and **extensibility** for future channels.

It consists of:

- `notification-manager`: The central service managing users, preferences, notification dispatching, rate-limiting, and error tracking.
- `notification-service`: A service that simulates the actual sending of notifications.
- `MongoDB`: Used to store dynamic notification documents and optionally user data.
- `Docker Compose`: For seamless orchestration of services.
- Written in **TypeScript** for type safety, scalability, and maintainability.

---

## 🧠 Assumptions

- A generic `/send` endpoint is exposed by `notification-manager`. After saving a notification to MongoDB, the manager calls the `notification-service` to deliver it via each enabled channel (`/send-email`, `/send-sms`).
- **MongoDB** is used for **notifications**, offering a dynamic schema that supports extensibility (adding channels or metadata per message).
- **Users** are stored in-memory for demo purposes, but in a production-grade system:
  - **Redis** would be used as a fast caching layer to fetch user preferences quickly.
  - Alternatively, user data could be persisted in a separate **MongoDB collection** or **SQL database** (like PostgreSQL).
- Rate-limiting and error tracking logic is designed with **Redis-style caching** in mind.
- Error and rate limit tracking is decoupled and extensible.

---

## 📦 Features

### ✅ Notification Dispatching
- Supports multiple channels per user (e.g., email and SMS simultaneously).
- Only dispatches to channels enabled in the user’s preferences.

### ⚡ Rate Limiting
- Per-user and per-channel limits.
- Configurable via environment variables.
- Tracks the number of dispatches within a time window.
- Designed to be compatible with caching solutions like Redis.

### ❌ Error Simulation & Tracking
- Simulates a percentage of failed notification sends.
- All errors are tracked internally.
- Exposes API to monitor and reset error state.

### 👥 User Preference Management
- Mocked users are loaded into the system on startup.
- In a real system, user data would be queried from Redis, MongoDB, or PostgreSQL.
- User preferences determine which channels receive notifications.

---

## 📡 API Endpoints

### User
- `GET /users`: Lists all loaded users and their channel preferences.

### Notification
- `POST /send`: Dispatch a message based on user preferences.
  ```json
  {
    "recipient": "ironman@avengers.com",
    "message": "Suit up!"
  }


# Tests:
# Send a notification
curl -X POST http://localhost:8080/send \
-H "Content-Type: application/json" \
-d '{"recipient": "ironman@avengers.com", "message": "Hello from the API"}'

# View users
curl http://localhost:8080/users

# Check error tracker
curl http://localhost:8080/errors

# Reset error tracker
curl -X POST http://localhost:8080/errors/reset


# Docker
version: '3.8'

services:
  notification-manager:
    build:
      context: ./notification-manager
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - mongo
    environment:
      - PORT=8080
      - MONGO_URI=mongodb://mongo:27017/notification_service
      - EMAIL_RATE_LIMIT=3
      - SMS_RATE_LIMIT=2
      - RATE_LIMIT_WINDOW_MS=2000
      - ERROR_RATE=0.1
    networks:
      - notif-net

  notification-service:
    image: aryekog/backend-interview-notifications-service:0.0.2
    ports:
      - "5001:5001"
    depends_on:
      - mongo
    environment:
      - EMAIL_RATE_LIMIT=3
      - SMS_RATE_LIMIT=2
      - RATE_LIMIT_WINDOW_MS=2000
      - ERROR_RATE=0.1
      - MONGO_URI=mongodb://mongo:27017/notification_service
    networks:
      - notif-net

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - notif-net

volumes:
  mongo-data:

networks:
  notif-net:
