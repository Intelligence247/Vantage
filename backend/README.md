# Sovereign Estate Backend API

Production-grade NestJS REST API for a multi-vendor real estate platform serving the Nigerian property market.

## Tech Stack

- **Runtime:** Node.js 20 + NestJS 11
- **Language:** TypeScript (strict mode)
- **Database:** MongoDB 7 + Mongoose 9
- **Auth:** JWT (access + refresh tokens), bcrypt
- **Validation:** Zod 4
- **File Uploads:** Cloudinary + Multer
- **Docs:** Swagger / OpenAPI 3
- **Logging:** Winston (JSON in production, colorized console in dev)
- **Security:** Helmet, express-mongo-sanitize, Rate Limiting (Throttler)
- **Docker:** Multi-stage build, docker-compose with MongoDB

## Quick Start

### Prerequisites

- Node.js >= 20
- MongoDB running locally (or use Docker)
- Cloudinary account

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Fill in your values
```

### 3. Run Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api/docs`

### 4. Run with Docker Compose

```bash
# Start API + MongoDB
docker compose up -d

# Check logs
docker compose logs -f api

# Stop
docker compose down
```

## Project Structure

```
src/
├── config/               # Environment validation, configuration factory, winston
├── common/
│   ├── decorators/       # @Roles(), @Public(), @CurrentUser()
│   ├── enums/            # Role enum (user, agent, admin)
│   ├── filters/          # GlobalExceptionFilter
│   ├── guards/           # JwtAuthGuard, RolesGuard
│   ├── interceptors/     # TransformInterceptor (uniform response wrapper)
│   └── utils/            # Zod validation helper
├── database/             # MongoDB connection module
└── modules/
    ├── auth/             # Register, Login, Token refresh, Logout
    ├── users/            # Profile, Admin user management
    ├── properties/       # CRUD, Search, Filters, Favorites
    ├── inquiries/        # Property inquiries, Contact form
    ├── admin/            # Dashboard stats, User verification
    └── cloudinary/       # Image upload/delete
```

## API Endpoints

### Public

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/health`                    | Health check          |
| GET    | `/api`                       | API info              |
| POST   | `/api/auth/register`         | Register user/agent   |
| POST   | `/api/auth/login`            | Login                 |
| POST   | `/api/auth/refresh`          | Refresh tokens        |
| GET    | `/api/properties`            | List properties       |
| GET    | `/api/properties/featured`   | Featured properties   |
| GET    | `/api/properties/:id`        | Property details      |
| POST   | `/api/properties/:id/inquiry`| Send inquiry          |
| POST   | `/api/contact`               | Contact form          |

### Authenticated (User / Agent)

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| POST   | `/api/auth/logout`                | Logout                   |
| GET    | `/api/users/me`                   | Get profile              |
| PUT    | `/api/users/profile`              | Update profile           |
| PUT    | `/api/users/password`             | Change password          |
| PUT    | `/api/users/notifications`        | Update notification prefs|
| POST   | `/api/properties`                 | Create property (Agent)  |
| PUT    | `/api/properties/:id`             | Update property (Agent)  |
| DELETE | `/api/properties/:id`             | Delete property (Agent)  |
| GET    | `/api/properties/agent/me`        | Agent's properties       |
| GET    | `/api/properties/agent/stats`     | Agent stats              |
| POST   | `/api/properties/:id/favorite`    | Toggle favorite          |
| GET    | `/api/properties/favorites`       | My favorites             |
| GET    | `/api/inbox`                      | My inquiries             |

### Admin Only

| Method | Endpoint                                      | Description       |
| ------ | --------------------------------------------- | ----------------- |
| GET    | `/api/dashboard/admin/stats`                  | Dashboard stats   |
| GET    | `/api/dashboard/admin/users`                  | List all users    |
| PUT    | `/api/dashboard/admin/users/:id/verify`       | Verify agent      |
| PUT    | `/api/dashboard/admin/users/:id/suspend`      | Suspend user      |
| GET    | `/api/dashboard/admin/properties/pending`     | Pending properties|
| PUT    | `/api/dashboard/admin/properties/:id/approve` | Approve property  |

## Uniform Response Format

All responses follow:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": { "email": "Invalid email format" },
  "statusCode": 400,
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Testing

```bash
# Unit tests
npm run test

# With coverage
npm run test:cov

# E2e tests (needs running MongoDB)
npm run test:e2e
```

## Docker Build (Production)

```bash
# Build image
docker build -t sovereign-estate-api .

# Run container
docker run -p 3000:3000 --env-file .env sovereign-estate-api
```

## GCP Cloud Run Deployment

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/sovereign-estate-api

# Deploy to Cloud Run
gcloud run deploy sovereign-estate-api \
  --image gcr.io/PROJECT_ID/sovereign-estate-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,MONGO_URI=<your-atlas-uri>,JWT_ACCESS_SECRET=<secret>,JWT_REFRESH_SECRET=<secret>,CLOUDINARY_CLOUD_NAME=<name>,CLOUDINARY_API_KEY=<key>,CLOUDINARY_API_SECRET=<secret>,CORS_ORIGIN=https://your-frontend.com"
```

## License

Private - All rights reserved.
