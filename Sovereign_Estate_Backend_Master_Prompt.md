# 🏗 Sovereign Estate Backend -- Master AI Build Prompt

## 🧠 ROLE

You are a senior backend architect building a **production-grade NestJS
API** for a scalable multi-vendor real estate platform called
**Sovereign Estate**.

This system must be:

-   Clean
-   Modular
-   Fully typed
-   Lint-safe
-   Build-safe
-   Test-covered
-   Scalable
-   Secure
-   Enterprise-grade
-   Dockerized
-   Cloud-ready (GCP)

No shortcuts. No TODO comments. No unfinished logic.

------------------------------------------------------------------------

# 🏗 PROJECT REQUIREMENTS

## Tech Stack (Strict)

-   Framework: NestJS (latest stable)
-   Language: TypeScript (strict mode enabled)
-   Database: MongoDB with Mongoose
-   Authentication: JWT (Access + Refresh tokens)
-   Image Storage: Cloudinary
-   Validation: Zod (preferred) or Joi
-   Logging: Winston
-   Security: Helmet + Express rate limit
-   Testing:
    -   Unit tests (Jest)
    -   End-to-End tests (Supertest)
-   Environment Config: @nestjs/config
-   Password Hashing: bcrypt (12 salt rounds minimum)
-   API Documentation & Testing: Swagger (@nestjs/swagger)
-   Containerization: Docker
-   Deployment Target: Google Cloud Platform (GCP)

Everything must be free and open-source.

------------------------------------------------------------------------

# 🐳 DOCKER REQUIREMENTS (MANDATORY)

The AI must:

-   Create a production-ready Dockerfile
-   Use multi-stage build
-   Use Node Alpine base image
-   Optimize for small image size
-   Expose correct port
-   Use non-root user inside container
-   Support environment variables
-   Include .dockerignore file
-   Ensure application runs in production mode inside container

Also generate:

-   docker-compose.yml for local development
-   Separate service for MongoDB in development
-   Environment variable configuration for Docker

The Docker setup must build and run successfully without modification.

------------------------------------------------------------------------

# ☁ GCP DEPLOYMENT READINESS

The backend must be designed for deployment on Google Cloud Platform.

Ensure:

-   App listens on process.env.PORT
-   No hardcoded ports
-   Production-ready logging
-   No local filesystem dependency
-   Environment variables fully configurable
-   Ready for deployment to:
    -   Cloud Run
    -   GKE
    -   Compute Engine

Include:

-   Example Cloud Run deployment command
-   Production build instructions
-   Health check endpoint (/health)

------------------------------------------------------------------------

# 📚 SWAGGER REQUIREMENTS (MANDATORY)

Implement Swagger properly:

-   Use @nestjs/swagger
-   Document all endpoints
-   Use DTO decorators for schema definitions
-   Add example request/response bodies
-   Enable Swagger UI at `/api/docs`
-   Configure bearer authentication in Swagger
-   Ensure Swagger supports testing JWT-protected routes

Swagger must be production-ready and cleanly configured.

------------------------------------------------------------------------

# 🧱 ARCHITECTURE RULES

Use a modular layered architecture:

Each module must follow:

-   controller
-   service
-   repository (data access abstraction)
-   dto
-   schema
-   tests

Project structure:

    src/
      modules/
        auth/
        users/
        properties/
        inquiries/
        admin/
      common/
        guards/
        decorators/
        interceptors/
        filters/
        utils/
      config/
      database/

------------------------------------------------------------------------

# 🔐 AUTHENTICATION REQUIREMENTS

Implement:

-   Access Token (15 min expiry)
-   Refresh Token (7 days expiry)
-   Store hashed refresh tokens in DB
-   Token rotation on refresh
-   Logout invalidates refresh token

JWT payload must include:

    sub (userId)
    email
    role
    isVerified

------------------------------------------------------------------------

# 👥 ROLE-BASED ACCESS CONTROL

Roles:

-   user
-   agent
-   admin

Implement:

-   Roles decorator
-   RolesGuard
-   JWT Auth Guard
-   Public decorator

Protect routes properly.

------------------------------------------------------------------------

# 🚀 ONBOARDING & SIGNUP FLOW (CRITICAL)

The signup flow must be secure, smooth, and production-grade.

### User Registration Flow

1.  Validate input using Zod schema
2.  Ensure email uniqueness
3.  Hash password (bcrypt 12 rounds)
4.  Create user
5.  Issue access + refresh tokens
6.  Return structured response:

```{=html}
<!-- -->
```
    {
      user: {
        id,
        name,
        email,
        role,
        isVerified
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }

### Agent Onboarding Flow

1.  Agent registers
2.  Default isVerified = false
3.  Agent uploads verification document (Cloudinary integration)
4.  Admin approves verification
5.  isVerified becomes true

Include:

-   Proper error handling
-   Duplicate email handling
-   Structured validation errors
-   Clean response formatting
-   Consistent API response wrapper

------------------------------------------------------------------------

# 🏠 PROPERTY MODULE

Property schema must include:

-   title
-   description
-   price
-   location (GeoJSON + 2dsphere index)
-   type (sale \| rent \| lease)
-   category (residential \| commercial \| land)
-   features\[\]
-   images\[\]
-   is360
-   status (available \| pending \| sold)
-   agent (ref User)
-   views

Add indexes:

-   price
-   state
-   status
-   2dsphere on location

------------------------------------------------------------------------

# ☁ CLOUDINARY INTEGRATION

Implement:

-   Secure file upload endpoint
-   Signed uploads
-   Store only URL + public_id
-   Ability to delete images
-   File size validation

------------------------------------------------------------------------

# 📊 ADMIN MODULE

Admin must be able to:

-   Verify agents
-   Suspend users
-   View global analytics
-   View flagged properties

Use MongoDB aggregation for analytics.

------------------------------------------------------------------------

# 🛡 SECURITY

Enable:

-   Helmet
-   CORS (configurable)
-   Rate limiting (100 requests per 15 minutes)
-   Mongo injection sanitization
-   Global validation pipe
-   Global exception filter
-   Request size limit

------------------------------------------------------------------------

# 🧾 LOGGING

Use Winston.

Log:

-   Errors
-   Warnings
-   Auth events
-   Server startup

Use structured JSON logs compatible with GCP logging.

------------------------------------------------------------------------

# 🧪 TESTING REQUIREMENTS

## Unit Tests

Write unit tests for:

-   AuthService
-   UsersService
-   PropertiesService
-   Guards
-   Validation logic

Mock database properly.

Minimum 80% coverage.

------------------------------------------------------------------------

## End-to-End Tests

Using Supertest:

Test flows:

1.  Register user
2.  Login
3.  Refresh token
4.  Create property (agent only)
5.  Block unauthorized property creation
6.  Admin verifies agent
7.  Verified agent creates property
8.  Public fetch properties

Use in-memory MongoDB for testing.

All tests must pass without manual DB setup.

------------------------------------------------------------------------

# 🧹 CODE QUALITY RULES

-   No ESLint errors
-   No TypeScript errors
-   No unused imports
-   No any types
-   Strict typing everywhere
-   No console.log
-   Proper dependency injection
-   Proper async/await handling
-   Clean try/catch blocks

------------------------------------------------------------------------

# 📦 ENVIRONMENT VARIABLES

Validate environment variables at startup:

    MONGO_URI
    JWT_ACCESS_SECRET
    JWT_REFRESH_SECRET
    CLOUDINARY_NAME
    CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET
    PORT

Fail fast if missing.

------------------------------------------------------------------------

# 📘 OUTPUT REQUIREMENTS

The AI must generate:

1.  Complete project structure
2.  All core files
3.  DTOs
4.  Schemas
5.  Guards
6.  Tests
7.  Example .env
8.  README with setup steps
9.  Postman examples
10. Fully configured Swagger setup
11. Dockerfile
12. docker-compose.yml
13. GCP deployment instructions

Everything must run without modification.
